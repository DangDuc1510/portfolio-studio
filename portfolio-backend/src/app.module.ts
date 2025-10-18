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
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/portfolio_db?authSource=admin'),
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
