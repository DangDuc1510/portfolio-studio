import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
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

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).exec();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
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
    return NextResponse.json(createdCategory, { status: 201 });
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

