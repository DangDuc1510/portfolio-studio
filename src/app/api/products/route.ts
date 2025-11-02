import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Album from '@/lib/models/Album';
import mongoose from 'mongoose';

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

function validateObjectId(id: string, entityName: string = 'Resource'): void {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ${entityName} ID: ${id}`);
  }
}

async function syncAlbumProductIds(albumId: string): Promise<void> {
  validateObjectId(albumId, 'Album');
  const products = await Product.find({ albumId: new mongoose.Types.ObjectId(albumId) }).exec();
  const productIds = products.map((p) => p._id);
  await Album.findByIdAndUpdate(albumId, { productIds }, { new: true }).exec();
}

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const albumId = searchParams.get('albumId') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const query: Record<string, unknown> = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (albumId) {
      if (!isValidObjectId(albumId)) {
        return NextResponse.json(
          { error: `Invalid Album ID: ${albumId}` },
          { status: 400 }
        );
      }
      query.albumId = new mongoose.Types.ObjectId(albumId);
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).exec(),
      Product.countDocuments(query).exec(),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { albumId, ...productData } = body;

    if (albumId && !isValidObjectId(albumId)) {
      return NextResponse.json(
        { error: `Invalid Album ID: ${albumId}` },
        { status: 400 }
      );
    }

    const newProductData = {
      ...productData,
      ...(albumId && {
        albumId: new mongoose.Types.ObjectId(albumId),
      }),
    };

    const createdProduct = await new Product(newProductData).save();

    if (albumId) {
      await syncAlbumProductIds(albumId);
    }

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

