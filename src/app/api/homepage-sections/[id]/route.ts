import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HomepageSection from '@/lib/models/HomepageSection';
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

// GET /api/homepage-sections/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'HomepageSection');
    const section = await HomepageSection.findById(id).exec();
    
    if (!section) {
      return NextResponse.json({ error: 'Homepage section not found' }, { status: 404 });
    }
    
    return NextResponse.json(section);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/homepage-sections/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'HomepageSection');
    const body = await request.json();
    const updatedSection = await HomepageSection.findByIdAndUpdate(id, body, { new: true }).exec();
    
    if (!updatedSection) {
      return NextResponse.json({ error: 'Homepage section not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedSection);
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

