import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {}

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

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate albumId if provided
    if (createProductDto.albumId && !this.isValidObjectId(createProductDto.albumId)) {
      throw new BadRequestException(`Invalid Album ID: ${createProductDto.albumId}`);
    }

    const productData = {
      ...createProductDto,
      ...(createProductDto.albumId && {
        albumId: new Types.ObjectId(createProductDto.albumId),
      }),
    };
    const createdProduct = await new this.productModel(productData).save();
    
    // Sync album's productIds if albumId is set
    if (createProductDto.albumId) {
      await this.syncAlbumProductIds(createProductDto.albumId);
    }
    
    return createdProduct;
  }

  async findAll(filters?: {
    search?: string;
    category?: string;
    albumId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
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
      if (!this.isValidObjectId(filters.albumId)) {
        throw new BadRequestException(`Invalid Album ID: ${filters.albumId}`);
      }
      query.albumId = new Types.ObjectId(filters.albumId);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    // Sort options
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.productModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
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
    this.validateObjectId(id, 'Product');
    return this.productModel.findById(id).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    this.validateObjectId(id, 'Product');
    // Get old product to check old albumId
    const oldProduct = await this.productModel.findById(id).exec();
    
    const updateData: any = { ...updateProductDto };
    let oldAlbumId: string | null = null;
    let newAlbumId: string | null = null;
    
    if (oldProduct?.albumId) {
      oldAlbumId = oldProduct.albumId.toString();
    }
    
    if (updateProductDto.albumId !== undefined) {
      if (updateProductDto.albumId === null || updateProductDto.albumId === '') {
        updateData.albumId = null;
        newAlbumId = null;
      } else {
        // Validate albumId if provided
        if (!this.isValidObjectId(updateProductDto.albumId)) {
          throw new BadRequestException(`Invalid Album ID: ${updateProductDto.albumId}`);
        }
        updateData.albumId = new Types.ObjectId(updateProductDto.albumId);
        newAlbumId = updateProductDto.albumId;
      }
    } else {
      newAlbumId = oldAlbumId;
    }
    
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    
    // Sync album's productIds when albumId changes
    if (oldAlbumId !== newAlbumId) {
      // Sync old album (remove product from old album)
      if (oldAlbumId) {
        await this.syncAlbumProductIds(oldAlbumId);
      }
      // Sync new album (add product to new album)
      if (newAlbumId) {
        await this.syncAlbumProductIds(newAlbumId);
      }
    }
    
    return updatedProduct;
  }

  async remove(id: string): Promise<Product | null> {
    this.validateObjectId(id, 'Product');
    // Get product before deleting to sync album
    const product = await this.productModel.findById(id).exec();
    
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    
    // Sync album's productIds if product had an albumId
    if (product?.albumId) {
      await this.syncAlbumProductIds(product.albumId.toString());
    }
    
    return deletedProduct;
  }

  // Helper method to sync productIds in album
  private async syncAlbumProductIds(albumId: string): Promise<void> {
    this.validateObjectId(albumId, 'Album');
    // Find all products with this albumId
    const products = await this.productModel.find({ albumId: new Types.ObjectId(albumId) }).exec();
    
    const productIds = products.map((p) => p._id);
    
    // Update album's productIds using AlbumsService
    await this.albumsService.syncProductIds(albumId);
  }

  async getCategories(): Promise<string[]> {
    // Get categories from Categories collection
    const categories = await this.categoriesService.findAll();
    return categories.map((cat) => cat.name);
  }
}
