import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';

// GET /api/products/categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).exec();
    const categoryNames = categories.map((cat) => cat.name);
    return NextResponse.json(categoryNames);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

