import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HomepageSection, HomepageSectionDocument } from './schemas/homepage-section.schema';
import { UpdateHomepageSectionDto } from './dto/update-homepage-section.dto';

@Injectable()
export class HomepageSectionsService {
  constructor(@InjectModel(HomepageSection.name) private homepageSectionModel: Model<HomepageSectionDocument>) {}

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

  async findAll(): Promise<HomepageSection[]> {
    return this.homepageSectionModel.find().exec();
  }

  async findOne(sectionName: string): Promise<HomepageSection | null> {
    return this.homepageSectionModel.findOne({ sectionName }).exec();
  }

  async findById(id: string): Promise<HomepageSection | null> {
    this.validateObjectId(id, 'HomepageSection');
    return this.homepageSectionModel.findById(id).exec();
  }

  async update(sectionName: string, updateHomepageSectionDto: UpdateHomepageSectionDto): Promise<HomepageSection> {
    return this.homepageSectionModel.findOneAndUpdate({ sectionName }, updateHomepageSectionDto, { new: true, upsert: true }).exec();
  }

  async updateById(id: string, updateHomepageSectionDto: UpdateHomepageSectionDto): Promise<HomepageSection | null> {
    this.validateObjectId(id, 'HomepageSection');
    return this.homepageSectionModel.findByIdAndUpdate(id, updateHomepageSectionDto, { new: true }).exec();
  }
}
