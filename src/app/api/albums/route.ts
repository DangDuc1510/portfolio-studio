import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Album from '@/lib/models/Album';
import { requireApiKey } from '@/lib/api-key-guard';

// GET /api/albums
export async function GET() {
  try {
    await connectDB();
    const albums = await Album.find().exec();
    return NextResponse.json(albums);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

