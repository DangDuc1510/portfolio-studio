import mongoose from "mongoose";
import Product from "@/lib/models/Product";
import Album from "@/lib/models/Album";
import { validateObjectId } from "./utils";

/**
 * Syncs productIds array in Album model based on products with matching albumId
 */
export async function syncAlbumProductIds(albumId: string): Promise<void> {
  validateObjectId(albumId, "Album");
  const products = await Product.find({
    albumId: new mongoose.Types.ObjectId(albumId),
  }).exec();
  const productIds = products.map((p: { _id: unknown }) => p._id);
  await Album.findByIdAndUpdate(albumId, { productIds }, { new: true }).exec();
}
