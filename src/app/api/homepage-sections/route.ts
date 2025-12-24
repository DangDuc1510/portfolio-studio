import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HomepageSection from "@/lib/models/HomepageSection";
import { requireApiKey } from "@/lib/api-key-guard";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/constants";

// GET /api/homepage-sections
export async function GET() {
  try {
    await connectDB();
    const sections = await HomepageSection.find().exec();
    return NextResponse.json(sections);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// POST /api/homepage-sections
export async function POST(request: NextRequest) {
  try {
    requireApiKey(request);
    await connectDB();
    const body = await request.json();
    const sectionData = {
      ...body,
      updatedAt: new Date(),
    };
    const createdSection = await new HomepageSection(sectionData).save();
    return NextResponse.json(createdSection, {
      status: HTTP_STATUS.CREATED,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
      {
        error: errorMessage,
        message: ERROR_MESSAGES.FAILED_TO_CREATE("homepage section"),
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
