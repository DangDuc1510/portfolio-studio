import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Equipment from "@/lib/models/Equipment";
import { requireApiKey } from "@/lib/api-key-guard";
import { validateObjectId } from "@/utils/utils";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/constants";

// GET /api/equipment/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Equipment");
    const equipment = await Equipment.findById(id).exec();

    if (!equipment) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Equipment") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(equipment);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// PATCH /api/equipment/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Equipment");

    const equipment = await Equipment.findById(id).exec();
    if (!equipment) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Equipment") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = { ...body };

    if (body.type) {
      const validTypes = ["camera", "lens", "drone", "gimbal", "other"];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { error: `type must be one of: ${validTypes.join(", ")}` },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    ).exec();

    return NextResponse.json(updatedEquipment);
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

// DELETE /api/equipment/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireApiKey(request);
    await connectDB();
    const { id } = await params;
    validateObjectId(id, "Equipment");

    const equipment = await Equipment.findById(id).exec();
    if (!equipment) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND("Equipment") },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const deletedEquipment = await Equipment.findByIdAndDelete(id).exec();

    return NextResponse.json(deletedEquipment);
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

