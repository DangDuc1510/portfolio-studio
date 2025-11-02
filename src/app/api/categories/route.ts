import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { requireApiKey } from '@/lib/api-key-guard';

// Configure runtime for Vercel
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max duration

// GET /api/categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).exec();
    return NextResponse.json(categories, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: unknown) {
    console.error('GET /api/categories error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = errorMessage.includes('MongoDB connection failed') ? 503 : 500;
    return NextResponse.json(
      { 
        error: errorMessage,
        message: 'Failed to fetch categories',
      },
      { status: statusCode }
    );
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    requireApiKey(request);
    await connectDB();
    const body = await request.json();
    const categoryData = {
      ...body,
      updatedAt: new Date(),
    };
    const createdCategory = await new Category(categoryData).save();
    return NextResponse.json(createdCategory, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    console.error('POST /api/categories error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    const statusCode = errorMessage.includes('MongoDB connection failed') ? 503 : 500;
    return NextResponse.json(
      { 
        error: errorMessage,
        message: 'Failed to create category',
      },
      { status: statusCode }
    );
  }
}

