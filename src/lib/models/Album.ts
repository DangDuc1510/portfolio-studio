import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAlbum extends Document {
  name: string;
  description?: string;
  coverImage?: string;
  productIds?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const AlbumSchema = new Schema<IAlbum>(
  {
    name: { type: String, required: true },
    description: String,
    coverImage: String,
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const Album: Model<IAlbum> =
  mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);

export default Album;

