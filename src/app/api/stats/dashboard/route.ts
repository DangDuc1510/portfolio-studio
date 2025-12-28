import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Album from '@/lib/models/Album';
import HomepageSection from '@/lib/models/HomepageSection';
import Equipment from '@/lib/models/Equipment';
import { requireApiKey } from '@/lib/api-key-guard';
import { ERROR_MESSAGES, HTTP_STATUS, STATS_DAYS_BACK, TOP_ALBUMS_LIMIT } from '@/constants';

// GET /api/stats/dashboard
export async function GET(request: NextRequest) {
  try {
    requireApiKey(request);
    await connectDB();

    const [
      totalAlbums,
      totalProducts,
      totalHomepageSections,
      totalEquipment,
    ] = await Promise.all([
      Album.countDocuments().exec(),
      Product.countDocuments().exec(),
      HomepageSection.countDocuments().exec(),
      Equipment.countDocuments().exec(),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - STATS_DAYS_BACK);

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

    // Products by type
    const productsByType = await Product.aggregate([
      {
        $group: {
          _id: '$productType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Equipment by type
    const equipmentByType = await Equipment.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    // Albums with product count
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
        $limit: TOP_ALBUMS_LIMIT,
      },
    ]);

    // Recent products (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProducts = await Product.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name productType createdAt')
      .lean()
      .exec();

    // Products created in last 7 days vs previous 7 days for growth
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const previousWeekProducts = await Product.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    }).exec();
    const currentWeekProducts = await Product.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    }).exec();

    // Calculate growth percentage
    const growthRate =
      previousWeekProducts > 0
        ? ((currentWeekProducts - previousWeekProducts) / previousWeekProducts) * 100
        : currentWeekProducts > 0
          ? 100
          : 0;

    return NextResponse.json({
      totals: {
        albums: totalAlbums,
        products: totalProducts,
        homepageSections: totalHomepageSections,
        equipment: totalEquipment,
      },
      productsByType: productsByType.map((item) => ({
        type: item._id || 'Unknown',
        count: item.count,
      })),
      equipmentByType: equipmentByType.map((item) => ({
        type: item._id || 'Unknown',
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
      recentProducts: recentProducts.map((item) => ({
        name: item.name,
        productType: item.productType,
        createdAt: item.createdAt,
      })),
      growth: {
        currentWeek: currentWeekProducts,
        previousWeek: previousWeekProducts,
        rate: Math.round(growthRate * 100) / 100,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (errorMessage.includes(ERROR_MESSAGES.UNAUTHORIZED)) {
      return NextResponse.json({ error: errorMessage }, { status: HTTP_STATUS.UNAUTHORIZED });
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

