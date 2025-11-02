import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  images?: string[];
  category?: string;
  albumId?: mongoose.Types.ObjectId;
  videoUrl?: string;
  thumbnail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    images: [String],
    category: String,
    albumId: { type: Schema.Types.ObjectId, ref: 'Album' },
    videoUrl: String,
    thumbnail: String,
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

