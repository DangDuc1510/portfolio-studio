import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Album from '@/lib/models/Album';
import { requireApiKey } from '@/lib/api-key-guard';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants';

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
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
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
    return NextResponse.json(createdAlbum, { status: HTTP_STATUS.CREATED });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (errorMessage.includes(ERROR_MESSAGES.UNAUTHORIZED)) {
      return NextResponse.json({ error: errorMessage }, { status: HTTP_STATUS.UNAUTHORIZED });
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

