import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  // Helper method to validate ObjectId
  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  // Helper method to validate and throw if invalid
  private validateObjectId(id: string, entityName: string = 'Resource'): void {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ${entityName} ID: ${id}`);
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryData = {
      ...createCategoryDto,
      updatedAt: new Date(),
    };
    const createdCategory = new this.categoryModel(categoryData);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Category | null> {
    this.validateObjectId(id, 'Category');
    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    this.validateObjectId(id, 'Category');
    const updateData = {
      ...updateCategoryDto,
      updatedAt: new Date(),
    };
    return this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Category | null> {
    this.validateObjectId(id, 'Category');
    const category = await this.categoryModel.findById(id).exec();
    
    // Prevent deletion of "Video" category
    if (category && category.name.toLowerCase() === 'video') {
      throw new Error('Cannot delete the "Video" category');
    }
    
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}

