import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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

// GET /api/albums
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const albums = await Album.find().exec();
    return NextResponse.json(albums);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/albums
export async function POST(request: NextRequest) {
  try {
    requireApiKey(request);
    await connectDB();
    const body = await request.json();
    const createdAlbum = await new Album(body).save();
    return NextResponse.json(createdAlbum, { status: 201 });
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

