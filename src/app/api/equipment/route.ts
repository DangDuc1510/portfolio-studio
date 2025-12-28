import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Equipment from "@/lib/models/Equipment";
import {
  HTTP_STATUS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from "@/constants";

// GET /api/equipment
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
    const limit = parseInt(
      searchParams.get("limit") || String(DEFAULT_LIMIT),
      10
    );
    const sortBy = searchParams.get("sortBy") || DEFAULT_SORT_BY;
    const sortOrder =
      searchParams.get("sortOrder") === "asc" ? "asc" : DEFAULT_SORT_ORDER;

    const query: Record<string, unknown> = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (type) {
      const validTypes = ["camera", "lens", "drone", "gimbal", "other"];
      if (validTypes.includes(type)) {
        query.type = type;
      }
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      Equipment.find(query).sort(sort).skip(skip).limit(limit).exec(),
      Equipment.countDocuments(query).exec(),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// POST /api/equipment
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "name and type are required" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const validTypes = ["camera", "lens", "drone", "gimbal", "other"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const equipment = await new Equipment({ name, type }).save();

    return NextResponse.json(equipment, { status: HTTP_STATUS.CREATED });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

