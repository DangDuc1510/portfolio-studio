import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomepageSectionsController } from './homepage-sections.controller';
import { HomepageSectionsService } from './homepage-sections.service';
import { HomepageSectionsSeed } from './homepage-sections.seed';
import { HomepageSection, HomepageSectionSchema } from './schemas/homepage-section.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HomepageSection.name, schema: HomepageSectionSchema }]),
  ],
  controllers: [HomepageSectionsController],
  providers: [HomepageSectionsService, HomepageSectionsSeed],
  exports: [HomepageSectionsService],
})
export class HomepageSectionsModule {}
