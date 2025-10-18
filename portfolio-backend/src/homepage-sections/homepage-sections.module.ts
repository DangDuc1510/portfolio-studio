import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomepageSectionsController } from './homepage-sections.controller';
import { HomepageSectionsService } from './homepage-sections.service';
import { HomepageSection, HomepageSectionSchema } from './schemas/homepage-section.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HomepageSection.name, schema: HomepageSectionSchema }]),
  ],
  controllers: [HomepageSectionsController],
  providers: [HomepageSectionsService],
})
export class HomepageSectionsModule {}
