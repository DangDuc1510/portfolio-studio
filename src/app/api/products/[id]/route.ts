import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Album from '@/lib/models/Album';
import mongoose from 'mongoose';
import { requireApiKey } from '@/lib/api-key-guard';

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

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'Product');
    const product = await Product.findById(id).exec();
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'Product');

    const oldProduct = await Product.findById(id).exec();
    if (!oldProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const updateData: any = { ...body };
    
    let oldAlbumId: string | null = null;
    let newAlbumId: string | null = null;

    if (oldProduct.albumId) {
      oldAlbumId = oldProduct.albumId.toString();
    }

    if (body.albumId !== undefined) {
      if (body.albumId === null || body.albumId === '') {
        updateData.albumId = null;
        newAlbumId = null;
      } else {
        if (!isValidObjectId(body.albumId)) {
          return NextResponse.json(
            { error: `Invalid Album ID: ${body.albumId}` },
            { status: 400 }
          );
        }
        updateData.albumId = new mongoose.Types.ObjectId(body.albumId);
        newAlbumId = body.albumId;
      }
    } else {
      newAlbumId = oldAlbumId;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).exec();

    if (oldAlbumId !== newAlbumId) {
      if (oldAlbumId) {
        await syncAlbumProductIds(oldAlbumId);
      }
      if (newAlbumId) {
        await syncAlbumProductIds(newAlbumId);
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}

// DELETE /api/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'Product');

    const product = await Product.findById(id).exec();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id).exec();

    if (product.albumId) {
      await syncAlbumProductIds(product.albumId.toString());
    }

    return NextResponse.json(deletedProduct);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

