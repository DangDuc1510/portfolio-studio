import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Album, AlbumSchema } from '../albums/schemas/album.schema';
import { HomepageSection, HomepageSectionSchema } from '../homepage-sections/schemas/homepage-section.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: HomepageSection.name, schema: HomepageSectionSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}

