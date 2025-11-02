import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/api-key-guard';
import cloudinary, { extractPublicIdFromUrl } from '@/lib/cloudinary';

export const runtime = 'nodejs';

// POST /api/upload
export async function POST(request: NextRequest) {
  try {
    requireApiKey(request);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.match(/\/(jpg|jpeg|png|gif|webp)$/) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed!' },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using base64 or buffer
    try {
      // Verify Cloudinary config
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json(
          { error: 'Cloudinary configuration is missing. Please check your environment variables.' },
          { status: 500 }
        );
      }

      const base64String = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64String}`;

      // Simplified upload options to avoid signature issues
      const uploadOptions: any = {
        resource_type: 'image',
        folder: 'portfolio-studio',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        quality: 'auto',
        fetch_format: 'auto',
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
        message: 'File uploaded successfully',
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
    } catch (uploadError: any) {
      console.error('Cloudinary upload error:', {
        message: uploadError.message,
        http_code: uploadError.http_code,
        name: uploadError.name,
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        hasUploadPreset: !!process.env.CLOUDINARY_UPLOAD_PRESET,
        error: uploadError,
      });

      // Handle specific Cloudinary error codes
      if (uploadError.http_code === 401) {
        const isInvalidSignature = uploadError.message?.includes('Invalid Signature');
        return NextResponse.json(
          { 
            error: 'Authentication failed. Please check your Cloudinary credentials.',
            details: uploadError.message,
            hint: isInvalidSignature 
              ? 'Invalid Signature error usually indicates incorrect CLOUDINARY_API_SECRET. Please verify your API secret in the Cloudinary dashboard.'
              : 'Please verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your environment variables.'
          },
          { status: 401 }
        );
      }

      if (uploadError.http_code === 400) {
        return NextResponse.json(
          { 
            error: 'Invalid upload request',
            details: uploadError.message 
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Upload failed',
          details: uploadError.message || 'Unknown error occurred'
        },
        { status: uploadError.http_code || 500 }
      );
    }
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
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
        { error: 'URL or publicId is required' },
        { status: 400 }
      );
    }

    let idToDelete: string | undefined = publicId;

    if (!idToDelete && url) {
      const extractedId = extractPublicIdFromUrl(url);
      idToDelete = extractedId || undefined;
    }

    if (!idToDelete) {
      return NextResponse.json(
        { error: 'Could not extract public ID from URL' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(idToDelete);

    return NextResponse.json({
      success: result.result === 'ok',
      message:
        result.result === 'ok'
          ? 'File deleted successfully'
          : 'File not found or could not be deleted',
      result: result.result,
    });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

