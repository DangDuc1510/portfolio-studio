import mongoose, { Schema, Model, Document } from "mongoose";

export type ProductType = "QUAY_DUNG" | "THIET_KE" | "CHUP_CHINH_ANH";

export interface PlatformLink {
  platform: "youtube" | "vimeo" | "drive" | "self_host";
  url: string;
}

export interface IProduct extends Document {
  name: string;
  description?: string;
  images?: string[];
  productType: ProductType;
  albumId?: mongoose.Types.ObjectId;
  videoUrl?: string;
  thumbnail?: string;
  aspectRatio?: string; // Tỉ lệ ảnh dạng "16/9", "4/3", "1/1", v.v.

  // QUAY DỰNG fields
  platformLinks?: PlatformLink[];
  categoryText?: string; // Thể loại (viết dài ~10 dòng)
  location?: string;
  equipmentIds?: mongoose.Types.ObjectId[];

  // THIẾT KẾ fields
  designType?: string; // Branding, UI/UX, Poster...
  clientType?: string; // Cá nhân / Doanh nghiệp
  toolsUsed?: string[]; // Figma, PS, AI...

  // CHỤP - CHỈNH ẢNH fields
  photographyType?: string; // Portrait, Street, Product...

  createdAt?: Date;
  updatedAt?: Date;
}

const PlatformLinkSchema = new Schema(
  {
    platform: {
      type: String,
      enum: ["youtube", "vimeo", "drive", "self_host"],
      required: true,
    },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    images: [String],
    productType: {
      type: String,
      enum: ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"],
      required: true,
    },
    albumId: { type: Schema.Types.ObjectId, ref: "Album" },
    videoUrl: String,
    thumbnail: String,
    aspectRatio: String, // Tỉ lệ ảnh dạng "16/9", "4/3", "1/1", v.v.

    // QUAY DỰNG fields
    platformLinks: [PlatformLinkSchema],
    categoryText: String,
    location: String,
    equipmentIds: [{ type: Schema.Types.ObjectId, ref: "Equipment" }],

    // THIẾT KẾ fields
    designType: String,
    clientType: String,
    toolsUsed: [String],

    // CHỤP - CHỈNH ẢNH fields
    photographyType: String,
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: false,
  }
);

// Delete the model if it exists to ensure we use the latest schema
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
