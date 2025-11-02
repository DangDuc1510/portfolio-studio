import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import Product from '@/lib/models/Product';
import Album from '@/lib/models/Album';
import HomepageSection from '@/lib/models/HomepageSection';
import { requireApiKey } from '@/lib/api-key-guard';

// GET /api/stats/dashboard
export async function GET(request: NextRequest) {
  try {
    requireApiKey(request);
    await connectDB();

    const [totalAlbums, totalProducts, totalCustomers, totalHomepageSections] = await Promise.all([
      Album.countDocuments().exec(),
      Product.countDocuments().exec(),
      Customer.countDocuments().exec(),
      HomepageSection.countDocuments().exec(),
    ]);

    const customerStatusStats = await Customer.aggregate([
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

    const productsByCategory = await Product.aggregate([
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const customersOverTime = await Customer.aggregate([
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

    const productsOverTime = await Product.aggregate([
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

    const albumsWithProductCount = await Album.aggregate([
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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCustomers = await Customer.countDocuments({
      submissionDate: { $gte: sevenDaysAgo },
    }).exec();

    return NextResponse.json({
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
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

