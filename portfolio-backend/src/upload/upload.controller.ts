import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        // Accept images only
        if (
          file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/) ||
          file.mimetype.startsWith('image/')
        ) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        'No file uploaded',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.uploadService.uploadFile(file);

      return {
        success: true,
        message: 'File uploaded successfully',
        file: {
          publicId: result.public_id,
          url: result.secure_url,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: result.bytes,
          width: result.width,
          height: result.height,
          format: result.format,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @UseGuards(ApiKeyGuard)
  async deleteFile(@Body('url') url: string, @Body('publicId') publicId?: string) {
    if (!url && !publicId) {
      throw new HttpException(
        'URL or publicId is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      let idToDelete: string | undefined = publicId;
      
      // Extract public_id from URL if not provided
      if (!idToDelete && url) {
        const extractedId = this.uploadService.extractPublicIdFromUrl(url);
        idToDelete = extractedId || undefined;
      }

      if (!idToDelete) {
        throw new HttpException(
          'Could not extract public ID from URL',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.uploadService.deleteFile(idToDelete);

      return {
        success: result.result === 'ok',
        message:
          result.result === 'ok'
            ? 'File deleted successfully'
            : 'File not found or could not be deleted',
        result: result.result,
      };
    } catch (error) {
      throw new HttpException(
        `Delete failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
