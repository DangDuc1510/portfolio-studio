import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { requireApiKey } from "@/lib/api-key-guard";
import { isValidObjectId, validateObjectId } from "@/utils/utils";
import { syncAlbumProductIds } from "@/utils/album";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/constants";

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Product");
    const product = await Product.findById(id).lean().exec();

    if (!product) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Product") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Convert ObjectId fields to strings for proper serialization
    const serializedProduct = {
      ...product,
      _id: product._id.toString(),
      albumId: product.albumId ? product.albumId.toString() : null,
      equipmentIds:
        product.equipmentIds && Array.isArray(product.equipmentIds)
          ? product.equipmentIds.map((id: mongoose.Types.ObjectId) =>
              id.toString()
            )
          : [],
    };

    return NextResponse.json(serializedProduct);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// PATCH /api/products/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Product");

    const oldProduct = await Product.findById(id).exec();
    if (!oldProduct) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Product") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const body = await request.json();

    // Build updateData explicitly to ensure all fields are set correctly
    const updateData: Record<string, unknown> = {};

    // Copy all fields from body except the ones we handle specially
    const {
      equipmentIds,
      albumId,
      productType,
      _id,
      createdAt,
      updatedAt,
      ...fieldsToUpdate
    } = body;

    // Copy all other fields first
    Object.assign(updateData, fieldsToUpdate);

    // Explicitly handle string fields to ensure they are saved even if empty
    // This ensures MongoDB updates these fields properly
    if ("photographyType" in body) {
      updateData.photographyType = body.photographyType ?? "";
    }
    if ("location" in body) {
      updateData.location = body.location ?? "";
    }
    if ("categoryText" in body) {
      updateData.categoryText = body.categoryText ?? "";
    }
    if ("designType" in body) {
      updateData.designType = body.designType ?? "";
    }
    if ("clientType" in body) {
      updateData.clientType = body.clientType ?? "";
    }

    // Handle images array
    if ("images" in body) {
      updateData.images = Array.isArray(body.images) ? body.images : [];
    }

    // Handle platformLinks array
    if ("platformLinks" in body) {
      updateData.platformLinks = Array.isArray(body.platformLinks)
        ? body.platformLinks
        : [];
    }

    // Handle toolsUsed array
    if ("toolsUsed" in body) {
      updateData.toolsUsed = Array.isArray(body.toolsUsed)
        ? body.toolsUsed
        : [];
    }

    // Validate productType if provided
    if (body.productType !== undefined) {
      const validProductTypes = ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"];
      if (!validProductTypes.includes(body.productType)) {
        return NextResponse.json(
          {
            error:
              "productType must be one of: QUAY_DUNG, THIET_KE, CHUP_CHINH_ANH",
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
    }

    // Validate and convert equipmentIds if provided
    if (equipmentIds !== undefined) {
      if (Array.isArray(equipmentIds)) {
        if (equipmentIds.length === 0) {
          // Explicitly set empty array
          updateData.equipmentIds = [];
        } else {
          const validIds = equipmentIds.filter((id) => isValidObjectId(id));
          if (validIds.length !== equipmentIds.length) {
            return NextResponse.json(
              { error: "Some equipment IDs are invalid" },
              { status: HTTP_STATUS.BAD_REQUEST }
            );
          }
          updateData.equipmentIds = validIds.map(
            (id) => new mongoose.Types.ObjectId(id)
          );
        }
      } else if (equipmentIds === null) {
        updateData.equipmentIds = [];
      }
    }

    let oldAlbumId: string | null = null;
    let newAlbumId: string | null = null;

    if (oldProduct.albumId) {
      oldAlbumId = oldProduct.albumId.toString();
    }

    if (body.albumId !== undefined) {
      if (body.albumId === null || body.albumId === "") {
        updateData.albumId = null;
        newAlbumId = null;
      } else {
        if (!isValidObjectId(body.albumId)) {
          return NextResponse.json(
            { error: ERROR_MESSAGES.INVALID_ID("Album", body.albumId) },
            { status: HTTP_STATUS.BAD_REQUEST }
          );
        }
        updateData.albumId = new mongoose.Types.ObjectId(body.albumId);
        newAlbumId = body.albumId;
      }
    } else {
      newAlbumId = oldAlbumId;
    }

    // Use updateOne first to ensure the update happens
    await Product.updateOne(
      { _id: id },
      { $set: updateData },
      { runValidators: true }
    ).exec();

    // Then fetch the updated document
    const updatedProduct = await Product.findById(id).exec();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    // Convert to plain object and serialize ObjectId fields to strings
    const productObj = updatedProduct.toObject();

    if (oldAlbumId !== newAlbumId) {
      if (oldAlbumId) {
        await syncAlbumProductIds(oldAlbumId);
      }
      if (newAlbumId) {
        await syncAlbumProductIds(newAlbumId);
      }
    }
    const serializedProduct = {
      ...productObj,
      _id: productObj._id.toString(),
      albumId: productObj.albumId ? productObj.albumId.toString() : null,
      equipmentIds:
        productObj.equipmentIds && Array.isArray(productObj.equipmentIds)
          ? productObj.equipmentIds.map((id: mongoose.Types.ObjectId) =>
              id.toString()
            )
          : [],
    };

    return NextResponse.json(serializedProduct);
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

// PUT /api/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}

// DELETE /api/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Product");

    const product = await Product.findById(id).exec();
    if (!product) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Product") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id).exec();

    if (product.albumId) {
      await syncAlbumProductIds(product.albumId.toString());
    }

    return NextResponse.json(deletedProduct);
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
