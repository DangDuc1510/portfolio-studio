import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { isValidObjectId } from "@/utils/utils";
import { syncAlbumProductIds } from "@/utils/album";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from "@/constants";

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const productType = searchParams.get("productType") || undefined;
    const albumId = searchParams.get("albumId") || undefined;
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

    if (productType) {
      const validProductTypes = ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"];
      if (validProductTypes.includes(productType)) {
        query.productType = productType;
      }
    }

    if (albumId) {
      if (!isValidObjectId(albumId)) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_ID("Album", albumId) },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
      query.albumId = new mongoose.Types.ObjectId(albumId);
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).exec(),
      Product.countDocuments(query).exec(),
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

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("body", body);
    const { albumId, productType, equipmentIds, ...productData } = body;

    // Validate productType
    const validProductTypes = ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"];
    if (!productType || !validProductTypes.includes(productType)) {
      return NextResponse.json(
        {
          error:
            "productType is required and must be one of: QUAY_DUNG, THIET_KE, CHUP_CHINH_ANH",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (albumId && !isValidObjectId(albumId)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_ID("Album", albumId) },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Validate and convert equipmentIds
    let equipmentObjectIds: mongoose.Types.ObjectId[] | undefined;
    console.log("equipmentIds", equipmentIds);
    if (equipmentIds !== undefined) {
      if (Array.isArray(equipmentIds)) {
        equipmentObjectIds = equipmentIds
          .filter((id) => isValidObjectId(id))
          .map((id) => new mongoose.Types.ObjectId(id));
      } else {
        equipmentObjectIds = [];
      }
    }

    const newProductData: Record<string, unknown> = {
      ...productData,
      productType,
      ...(albumId && {
        albumId: new mongoose.Types.ObjectId(albumId),
      }),
      ...(equipmentIds !== undefined && {
        equipmentIds: equipmentObjectIds || [],
      }),
    };

    const createdProduct = await new Product(newProductData).save();

    if (albumId) {
      await syncAlbumProductIds(albumId);
    }

    return NextResponse.json(createdProduct, { status: HTTP_STATUS.CREATED });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
