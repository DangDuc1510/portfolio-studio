import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productData = {
      ...createProductDto,
      ...(createProductDto.albumId && {
        albumId: new Types.ObjectId(createProductDto.albumId),
      }),
    };
    const createdProduct = new this.productModel(productData);
    return createdProduct.save();
  }

  async findAll(filters?: {
    search?: string;
    category?: string;
    albumId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query: any = {};

    // Search by name (case-insensitive)
    if (filters?.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    // Filter by category
    if (filters?.category) {
      query.category = filters.category;
    }

    // Filter by albumId - convert to ObjectId
    if (filters?.albumId) {
      query.albumId = new Types.ObjectId(filters.albumId);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.productModel.find(query).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const updateData = {
      ...updateProductDto,
      ...(updateProductDto.albumId && {
        albumId: new Types.ObjectId(updateProductDto.albumId),
      }),
    };
    return this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async getCategories(): Promise<string[]> {
    // Get categories from Categories collection
    const categories = await this.categoriesService.findAll();
    return categories.map((cat) => cat.name);
  }
}
