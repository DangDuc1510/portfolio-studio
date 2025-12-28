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

    // QUAY_DUNG filters
    const location = searchParams.get("location");
    if (location) {
      try {
        const locations = JSON.parse(location);
        if (Array.isArray(locations) && locations.length > 0) {
          query.location = { $in: locations };
        }
      } catch {
        // If not JSON, treat as single location
        query.location = location;
      }
    }

    const categoryText = searchParams.get("categoryText");
    if (categoryText) {
      try {
        const categories = JSON.parse(categoryText);
        if (Array.isArray(categories) && categories.length > 0) {
          query.categoryText = { $in: categories };
        }
      } catch {
        // If not JSON, treat as single category
        query.categoryText = categoryText;
      }
    }

    const equipmentIds = searchParams.get("equipmentIds");
    if (equipmentIds) {
      try {
        const ids = JSON.parse(equipmentIds);
        if (Array.isArray(ids) && ids.length > 0) {
          const validIds = ids
            .filter((id) => isValidObjectId(id))
            .map((id) => new mongoose.Types.ObjectId(id));
          if (validIds.length > 0) {
            query.equipmentIds = { $in: validIds };
          }
        }
      } catch {
        // If not JSON, try as single ID
        if (isValidObjectId(equipmentIds)) {
          query.equipmentIds = new mongoose.Types.ObjectId(equipmentIds);
        }
      }
    }

    // THIET_KE filters
    const designType = searchParams.get("designType");
    if (designType) {
      try {
        const designTypes = JSON.parse(designType);
        if (Array.isArray(designTypes) && designTypes.length > 0) {
          query.designType = { $in: designTypes };
        }
      } catch {
        // If not JSON, treat as single designType
        query.designType = designType;
      }
    }

    const clientType = searchParams.get("clientType");
    if (clientType) {
      try {
        const clientTypes = JSON.parse(clientType);
        if (Array.isArray(clientTypes) && clientTypes.length > 0) {
          query.clientType = { $in: clientTypes };
        }
      } catch {
        // If not JSON, treat as single clientType
        query.clientType = clientType;
      }
    }

    const toolsUsed = searchParams.get("toolsUsed");
    if (toolsUsed) {
      try {
        const tools = JSON.parse(toolsUsed);
        if (Array.isArray(tools) && tools.length > 0) {
          query.toolsUsed = { $in: tools };
        }
      } catch {
        // If not JSON, treat as single tool
        query.toolsUsed = toolsUsed;
      }
    }

    // CHUP_CHINH_ANH filters
    const photographyType = searchParams.get("photographyType");
    if (photographyType) {
      try {
        const photographyTypes = JSON.parse(photographyType);
        if (Array.isArray(photographyTypes) && photographyTypes.length > 0) {
          query.photographyType = { $in: photographyTypes };
        }
      } catch {
        // If not JSON, treat as single photographyType
        query.photographyType = photographyType;
      }
    }

    // Filter by year (based on createdAt)
    const year = searchParams.get("year");
    if (year) {
      try {
        const years = JSON.parse(year);
        if (Array.isArray(years) && years.length > 0) {
          const yearNumbers = years
            .map((y) => parseInt(y, 10))
            .filter((y) => !isNaN(y));
          if (yearNumbers.length > 0) {
            const yearQueries = yearNumbers.map((y) => {
              const startDate = new Date(y, 0, 1);
              const endDate = new Date(y + 1, 0, 1);
              return {
                createdAt: {
                  $gte: startDate,
                  $lt: endDate,
                },
              };
            });
            query.$or = yearQueries;
          }
        }
      } catch {
        // If not JSON, treat as single year
        const yearNum = parseInt(year, 10);
        if (!isNaN(yearNum)) {
          const startDate = new Date(yearNum, 0, 1);
          const endDate = new Date(yearNum + 1, 0, 1);
          query.createdAt = {
            $gte: startDate,
            $lt: endDate,
          };
        }
      }
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
