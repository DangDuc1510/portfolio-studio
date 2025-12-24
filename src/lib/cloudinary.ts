import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Re-export utility function from utils for backward compatibility
export { extractPublicIdFromUrl } from "@/utils/cloudinary";

export default cloudinary;

