import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HomepageSection from "@/lib/models/HomepageSection";
import { requireApiKey } from "@/lib/api-key-guard";
import { validateObjectId } from "@/utils/utils";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/constants";

// GET /api/homepage-sections/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "HomepageSection");
    const section = await HomepageSection.findById(id).exec();

    if (!section) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Homepage section") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(section);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
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
    validateObjectId(id, "HomepageSection");
    const body = await request.json();
    const updatedSection = await HomepageSection.findByIdAndUpdate(id, body, {
      new: true,
    }).exec();

    if (!updatedSection) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Homepage section") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(updatedSection);
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

// DELETE /api/homepage-sections/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "HomepageSection");

    const deletedSection = await HomepageSection.findByIdAndDelete(id).exec();

    if (!deletedSection) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Homepage section") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(deletedSection);
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
