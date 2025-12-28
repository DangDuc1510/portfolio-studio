import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Equipment from "@/lib/models/Equipment";
import mongoose from "mongoose";

// GET /api/products/filters/[productType] - Get available filters for a product type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productType: string }> }
) {
  try {
    await connectDB();
    const { productType } = await params;

    // Validate productType
    const validProductTypes = ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"];
    if (!validProductTypes.includes(productType)) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    // First, fetch all products of this type
    const products = await Product.find({
      productType,
    })
      .lean()
      .exec();

    const filters: Record<string, unknown> = {};

    // Extract unique years from products (common for all product types)
    const years = [
      ...new Set(
        products
          .map((product) => {
            if (product.createdAt) {
              const date = new Date(product.createdAt);
              return date.getFullYear().toString();
            }
            return null;
          })
          .filter((year) => year != null)
      ),
    ].sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending (newest first)

    filters.years = years;

    // Get filters based on product type
    switch (productType) {
      case "QUAY_DUNG": {
        // Extract unique locations from products
        const locations = [
          ...new Set(
            products
              .map((product) => product.location)
              .filter((loc) => loc != null && loc !== "")
          ),
        ].sort();

        // Extract unique categories from products
        const categories = [
          ...new Set(
            products
              .map((product) => product.categoryText)
              .filter((cat) => cat != null && cat !== "")
          ),
        ].sort();

        // Extract unique equipment IDs from products
        const equipmentIdsSet = new Set<string>();
        products.forEach((product) => {
          if (product.equipmentIds && Array.isArray(product.equipmentIds)) {
            product.equipmentIds.forEach((id) => {
              if (id != null) {
                equipmentIdsSet.add(id.toString());
              }
            });
          }
        });

        const validEquipmentIds = Array.from(equipmentIdsSet).map(
          (id) => new mongoose.Types.ObjectId(id)
        );

        const equipment = await Equipment.find({
          _id: { $in: validEquipmentIds },
        }).select("name _id");

        filters.locations = locations;
        filters.categories = categories;
        filters.equipment = equipment;
        break;
      }

      case "THIET_KE": {
        // Extract unique design types from products
        const designTypes = [
          ...new Set(
            products
              .map((product) => product.designType)
              .filter((type) => type != null && type !== "")
          ),
        ].sort();

        // Extract unique client types from products
        const clientTypes = [
          ...new Set(
            products
              .map((product) => product.clientType)
              .filter((type) => type != null && type !== "")
          ),
        ].sort();

        // Extract unique tools from products
        const toolsSet = new Set<string>();
        products.forEach((product) => {
          if (product.toolsUsed && Array.isArray(product.toolsUsed)) {
            product.toolsUsed.forEach((tool) => {
              if (tool != null && tool !== "") {
                toolsSet.add(tool);
              }
            });
          }
        });

        const tools = Array.from(toolsSet).sort();

        filters.designTypes = designTypes;
        filters.clientTypes = clientTypes;
        filters.tools = tools;
        break;
      }

      case "CHUP_CHINH_ANH": {
        // Extract unique photography types from products
        const photographyTypes = [
          ...new Set(
            products
              .map((product) => product.photographyType)
              .filter((type) => type != null && type !== "")
          ),
        ].sort();

        // Extract unique equipment IDs from products
        const equipmentIdsSet = new Set<string>();
        products.forEach((product) => {
          if (product.equipmentIds && Array.isArray(product.equipmentIds)) {
            product.equipmentIds.forEach((id) => {
              if (id != null) {
                equipmentIdsSet.add(id.toString());
              }
            });
          }
        });

        const validEquipmentIds = Array.from(equipmentIdsSet).map(
          (id) => new mongoose.Types.ObjectId(id)
        );

        const equipment = await Equipment.find({
          _id: { $in: validEquipmentIds },
        }).select("name _id");

        filters.photographyTypes = photographyTypes;
        filters.equipment = equipment;
        break;
      }
    }

    return NextResponse.json(filters, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch filters",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
