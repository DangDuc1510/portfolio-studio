import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Album from "@/lib/models/Album";
import { requireApiKey } from "@/lib/api-key-guard";
import { validateObjectId } from "@/utils/utils";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/constants";

// GET /api/albums/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Album");
    const album = await Album.findById(id).exec();

    if (!album) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Album") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(album);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
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
    validateObjectId(id, "Album");
    const body = await request.json();
    const updatedAlbum = await Album.findByIdAndUpdate(id, body, {
      new: true,
    }).exec();

    if (!updatedAlbum) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Album") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(updatedAlbum);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    if (errorMessage.includes(ERROR_MESSAGES.UNAUTHORIZED)) {
      return NextResponse.json(
        { error: errorMessage },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
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
    // requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Album");
    const deletedAlbum = await Album.findByIdAndDelete(id).exec();

    if (!deletedAlbum) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Album") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(deletedAlbum);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    if (errorMessage.includes(ERROR_MESSAGES.UNAUTHORIZED)) {
      return NextResponse.json(
        { error: errorMessage },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
