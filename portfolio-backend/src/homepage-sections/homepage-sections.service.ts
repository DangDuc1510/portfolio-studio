import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomepageSection, HomepageSectionDocument } from './schemas/homepage-section.schema';
import { UpdateHomepageSectionDto } from './dto/update-homepage-section.dto';

@Injectable()
export class HomepageSectionsService {
  constructor(@InjectModel(HomepageSection.name) private homepageSectionModel: Model<HomepageSectionDocument>) {}

  async findAll(): Promise<HomepageSection[]> {
    return this.homepageSectionModel.find().exec();
  }

  async findOne(sectionName: string): Promise<HomepageSection | null> {
    return this.homepageSectionModel.findOne({ sectionName }).exec();
  }

  async update(sectionName: string, updateHomepageSectionDto: UpdateHomepageSectionDto): Promise<HomepageSection> {
    return this.homepageSectionModel.findOneAndUpdate({ sectionName }, updateHomepageSectionDto, { new: true, upsert: true }).exec();
  }
}
