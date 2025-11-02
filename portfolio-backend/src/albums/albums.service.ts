import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const createdAlbum = new this.albumModel(createAlbumDto);
    return createdAlbum.save();
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel.find().exec();
  }

  async findOne(id: string): Promise<Album | null> {
    return this.albumModel.findById(id).exec();
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album | null> {
    return this.albumModel.findByIdAndUpdate(id, updateAlbumDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Album | null> {
    return this.albumModel.findByIdAndDelete(id).exec();
  }

  // Helper method to sync productIds in album based on products
  async syncProductIds(albumId: string): Promise<void> {
    // This will be called from ProductsService when a product's albumId changes
    // Find all products with this albumId
    const products = await this.productModel.find({ albumId: new Types.ObjectId(albumId) }).exec();
    
    const productIds = products.map((p) => p._id);
    await this.albumModel.findByIdAndUpdate(albumId, { productIds }, { new: true }).exec();
  }
}
