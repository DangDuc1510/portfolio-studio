import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PageSettings from "@/lib/models/PageSettings";

// GET /api/page-settings/[pageType] - Get page settings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageType: string }> }
) {
  try {
    await connectDB();
    const { pageType } = await params;

    // Validate pageType
    const validPageTypes = ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"];
    if (!validPageTypes.includes(pageType)) {
      return NextResponse.json({ error: "Invalid page type" }, { status: 400 });
    }

    let pageSettings = await PageSettings.findOne({ pageType }).populate(
      "featuredProductIds"
    );

    // If not found, create default settings
    if (!pageSettings) {
      const defaultTitles = {
        QUAY_DUNG: "Quay dựng",
        THIET_KE: "Thiết kế",
        CHUP_CHINH_ANH: "Chụp - Chỉnh ảnh",
      };

      const defaultDescriptions = {
        QUAY_DUNG: "Khám phá các dự án quay dựng chuyên nghiệp của chúng tôi",
        THIET_KE: "Các dự án thiết kế sáng tạo và độc đáo",
        CHUP_CHINH_ANH: "Bộ sưu tập ảnh nghệ thuật và chỉnh sửa chuyên nghiệp",
      };

      pageSettings = await PageSettings.create({
        pageType,
        title: defaultTitles[pageType as keyof typeof defaultTitles],
        description:
          defaultDescriptions[pageType as keyof typeof defaultDescriptions],
        featuredProductIds: [],
      });
    }

    return NextResponse.json(pageSettings, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching page settings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch page settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/page-settings/[pageType] - Update page settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ pageType: string }> }
) {

  try {
    await connectDB();
    const { pageType } = await params;
    const body = await request.json();

    // Validate pageType
    const validPageTypes = ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"];
    if (!validPageTypes.includes(pageType)) {
      return NextResponse.json({ error: "Invalid page type" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.backgroundImage !== undefined)
      updateData.backgroundImage = body.backgroundImage;
    if (body.featuredProductIds !== undefined)
      updateData.featuredProductIds = body.featuredProductIds;
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined)
      updateData.seoDescription = body.seoDescription;

    const pageSettings = await PageSettings.findOneAndUpdate(
      { pageType },
      updateData,
      { new: true, upsert: true }
    ).populate("featuredProductIds");

    return NextResponse.json(pageSettings, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating page settings:", error);
    return NextResponse.json(
      {
        error: "Failed to update page settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
