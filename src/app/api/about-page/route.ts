import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AboutPage from "@/lib/models/AboutPage";

// GET - Fetch About Page data
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query params
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    // Find the about page (there should only be one)
    const query = includeUnpublished ? {} : { isPublished: true };
    const aboutPage = await AboutPage.findOne(query);

    if (!aboutPage) {
      // Return default structure if not found
      return NextResponse.json(
        {
          message: "About page not found. Please create one in CMS.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: aboutPage,
    });
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch about page",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create About Page (only if doesn't exist)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if about page already exists
    const existingPage = await AboutPage.findOne({});
    if (existingPage) {
      return NextResponse.json(
        {
          success: false,
          message: "About page already exists. Use PUT to update.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Create new about page
    const aboutPage = await AboutPage.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "About page created successfully",
        data: aboutPage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating about page:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create about page",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update About Page
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Find and update the about page (there should only be one)
    let aboutPage = await AboutPage.findOne({});

    if (!aboutPage) {
      // Create if doesn't exist
      aboutPage = await AboutPage.create(body);
      return NextResponse.json(
        {
          success: true,
          message: "About page created successfully",
          data: aboutPage,
        },
        { status: 201 }
      );
    }

    // Update existing page
    Object.assign(aboutPage, body);
    await aboutPage.save();

    return NextResponse.json({
      success: true,
      message: "About page updated successfully",
      data: aboutPage,
    });
  } catch (error) {
    console.error("Error updating about page:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update about page",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

