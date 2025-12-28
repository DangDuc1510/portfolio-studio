import mongoose, { Schema, Model, Document } from "mongoose";

export type PageType = "QUAY_DUNG" | "THIET_KE" | "CHUP_CHINH_ANH";

export interface IPageSettings extends Document {
  pageType: PageType;
  title: string;
  description: string;
  backgroundImage?: string;
  featuredProductIds: mongoose.Types.ObjectId[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PageSettingsSchema = new Schema<IPageSettings>(
  {
    pageType: {
      type: String,
      enum: ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"],
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    backgroundImage: String,
    featuredProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    seoTitle: String,
    seoDescription: String,
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: false,
  }
);

// Delete the model if it exists to ensure we use the latest schema
if (mongoose.models.PageSettings) {
  delete mongoose.models.PageSettings;
}

const PageSettings: Model<IPageSettings> = mongoose.model<IPageSettings>(
  "PageSettings",
  PageSettingsSchema
);

export default PageSettings;

