import { Controller, Get, Put, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { HomepageSectionsService } from './homepage-sections.service';
import { UpdateHomepageSectionDto } from './dto/update-homepage-section.dto';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('homepage-sections')
export class HomepageSectionsController {
  constructor(private readonly homepageSectionsService: HomepageSectionsService) {}

  @Get()
  findAll() {
    return this.homepageSectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homepageSectionsService.findById(id);
  }

  @Put(':sectionName')
  @UseGuards(ApiKeyGuard)
  update(
    @Param('sectionName') sectionName: string,
    @Body() updateHomepageSectionDto: UpdateHomepageSectionDto,
  ) {
    return this.homepageSectionsService.update(sectionName, updateHomepageSectionDto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  updateById(
    @Param('id') id: string,
    @Body() updateHomepageSectionDto: UpdateHomepageSectionDto,
  ) {
    return this.homepageSectionsService.updateById(id, updateHomepageSectionDto);
  }
}
