import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';

// GET /api/products/categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).exec();
    const categoryNames = categories.map((cat) => cat.name);
    return NextResponse.json(categoryNames);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

