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

// GET /api/albums/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'Album');
    const album = await Album.findById(id).exec();
    
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    return NextResponse.json(album);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/albums/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'Album');
    const body = await request.json();
    const updatedAlbum = await Album.findByIdAndUpdate(id, body, { new: true }).exec();
    
    if (!updatedAlbum) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedAlbum);
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

// PUT /api/albums/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}

// DELETE /api/albums/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, 'Album');
    const deletedAlbum = await Album.findByIdAndDelete(id).exec();
    
    if (!deletedAlbum) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    return NextResponse.json(deletedAlbum);
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

