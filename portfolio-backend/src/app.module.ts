import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { AlbumsModule } from './albums/albums.module';
import { CustomersModule } from './customers/customers.module';
import { HomepageSectionsModule } from './homepage-sections/homepage-sections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb+srv://ducbd1510_db_user:123456abc@db-portfolio-studio.4hxu4ed.mongodb.net/db-portfolio-studio/'),
    AuthModule,
    ProductsModule,
    AlbumsModule,
    CustomersModule,
    HomepageSectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
