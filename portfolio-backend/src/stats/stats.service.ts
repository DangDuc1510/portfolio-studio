import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Album, AlbumDocument } from '../albums/schemas/album.schema';
import { HomepageSection, HomepageSectionDocument } from '../homepage-sections/schemas/homepage-section.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(HomepageSection.name) private homepageSectionModel: Model<HomepageSectionDocument>,
  ) {}

  async getDashboardStats() {
    // Total counts
    const [totalAlbums, totalProducts, totalCustomers, totalHomepageSections] = await Promise.all([
      this.albumModel.countDocuments().exec(),
      this.productModel.countDocuments().exec(),
      this.customerModel.countDocuments().exec(),
      this.homepageSectionModel.countDocuments().exec(),
    ]);

    // Customer stats by status
    const customerStatusStats = await this.customerModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const customerStatusMap: Record<string, number> = {
      pending: 0,
      contacted: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    customerStatusStats.forEach((stat) => {
      customerStatusMap[stat._id] = stat.count;
    });

    // Products by category
    const productsByCategory = await this.productModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Customers over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const customersOverTime = await this.customerModel.aggregate([
      {
        $match: {
          submissionDate: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$submissionDate',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Products over time (last 30 days)
    const productsOverTime = await this.productModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Albums with product count
    const albumsWithProductCount = await this.albumModel.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'albumId',
          as: 'products',
        },
      },
      {
        $project: {
          name: 1,
          productCount: { $size: '$products' },
        },
      },
      {
        $sort: { productCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Recent customers (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCustomers = await this.customerModel.countDocuments({
      submissionDate: { $gte: sevenDaysAgo },
    }).exec();

    return {
      totals: {
        albums: totalAlbums,
        products: totalProducts,
        customers: totalCustomers,
        homepageSections: totalHomepageSections,
      },
      customerStatus: customerStatusMap,
      productsByCategory: productsByCategory.map((item) => ({
        category: item._id || 'Uncategorized',
        count: item.count,
      })),
      customersOverTime: customersOverTime.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      productsOverTime: productsOverTime.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      albumsWithProductCount: albumsWithProductCount.map((item) => ({
        name: item.name,
        productCount: item.productCount,
      })),
      recentCustomers,
    };
  }
}

