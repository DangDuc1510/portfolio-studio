/**
 * Extracts public ID from Cloudinary URL
 * @param url - Cloudinary URL (e.g., https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg)
 * @returns Public ID or null if extraction fails
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const regex = /\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
