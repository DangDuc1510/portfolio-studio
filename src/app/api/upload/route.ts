import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/api-key-guard";
import cloudinary, { extractPublicIdFromUrl } from "@/lib/cloudinary";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_FORMATS,
  CLOUDINARY_FOLDER,
  CLOUDINARY_RESOURCE_TYPE,
  CLOUDINARY_QUALITY,
  CLOUDINARY_FETCH_FORMAT,
  SUCCESS_MESSAGES,
} from "@/constants";

export const runtime = "nodejs";

// POST /api/upload
export async function POST(request: NextRequest) {
  try {
    requireApiKey(request);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NO_FILE_UPLOADED },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Check file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidFormat =
      file.type.startsWith("image/") &&
      (fileExtension
        ? ALLOWED_IMAGE_FORMATS.includes(
            fileExtension as (typeof ALLOWED_IMAGE_FORMATS)[number]
          )
        : false);

    if (!isValidFormat) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_FILE_TYPE },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FILE_SIZE_EXCEEDED },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using base64 or buffer
    try {
      // Verify Cloudinary config
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.CLOUDINARY_CONFIG_MISSING },
          { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        );
      }

      const base64String = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64String}`;

      // Simplified upload options to avoid signature issues
      const uploadOptions: Record<string, unknown> = {
        resource_type: CLOUDINARY_RESOURCE_TYPE,
        folder: CLOUDINARY_FOLDER,
        allowed_formats: ALLOWED_IMAGE_FORMATS,
        quality: CLOUDINARY_QUALITY,
        fetch_format: CLOUDINARY_FETCH_FORMAT,
      };

      // If unsigned upload preset is available, use it to avoid signature issues
      if (process.env.CLOUDINARY_UPLOAD_PRESET) {
        uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
        // Remove signature-requiring params when using unsigned preset
        delete uploadOptions.allowed_formats;
      }

      const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

      return NextResponse.json({
        success: true,
        message: SUCCESS_MESSAGES.FILE_UPLOADED,
        file: {
          publicId: result.public_id,
          url: result.secure_url,
          originalName: file.name,
          mimetype: file.type,
          size: result.bytes,
          width: result.width,
          height: result.height,
          format: result.format,
        },
      });
    } catch (uploadError: unknown) {
      const errorMessage =
        uploadError instanceof Error ? uploadError.message : "Unknown error";
      const httpCode = (uploadError as { http_code?: number })?.http_code;
      const errorName =
        uploadError instanceof Error ? uploadError.name : "Unknown";

      console.error("Cloudinary upload error:", {
        message: errorMessage,
        http_code: httpCode,
        name: errorName,
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        hasUploadPreset: !!process.env.CLOUDINARY_UPLOAD_PRESET,
        error: uploadError,
      });

      // Handle specific Cloudinary error codes
      if (httpCode === HTTP_STATUS.UNAUTHORIZED) {
        const isInvalidSignature = errorMessage.includes("Invalid Signature");
        return NextResponse.json(
          {
            error: ERROR_MESSAGES.CLOUDINARY_AUTH_FAILED,
            details: errorMessage,
            hint: isInvalidSignature
              ? ERROR_MESSAGES.CLOUDINARY_INVALID_SIGNATURE
              : "Please verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your environment variables.",
          },
          { status: HTTP_STATUS.UNAUTHORIZED }
        );
      }

      if (httpCode === HTTP_STATUS.BAD_REQUEST) {
        return NextResponse.json(
          {
            error: ERROR_MESSAGES.CLOUDINARY_INVALID_UPLOAD,
            details: errorMessage,
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      return NextResponse.json(
        {
          error: ERROR_MESSAGES.CLOUDINARY_UPLOAD_FAILED,
          details: errorMessage || "Unknown error occurred",
        },
        { status: httpCode || HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
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

// DELETE /api/upload
export async function DELETE(request: NextRequest) {
  try {
    requireApiKey(request);

    const body = await request.json();
    const { url, publicId } = body;

    if (!url && !publicId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.URL_OR_PUBLIC_ID_REQUIRED },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    let idToDelete: string | undefined = publicId;

    if (!idToDelete && url) {
      const extractedId = extractPublicIdFromUrl(url);
      idToDelete = extractedId || undefined;
    }

    if (!idToDelete) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.COULD_NOT_EXTRACT_PUBLIC_ID },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const result = await cloudinary.uploader.destroy(idToDelete);

    return NextResponse.json({
      success: result.result === "ok",
      message:
        result.result === "ok"
          ? SUCCESS_MESSAGES.FILE_DELETED
          : SUCCESS_MESSAGES.FILE_NOT_FOUND,
      result: result.result,
    });
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
