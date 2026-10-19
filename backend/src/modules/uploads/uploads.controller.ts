import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import 'multer';
import { UploadsService, UploadResult } from './uploads.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

const uploadDirectory = join(process.cwd(), 'uploads', 'images');

const ALLOWED_MIME_EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          _req: Express.Request,
          _file: Express.Multer.File,
          cb: (error: Error | null, destination: string) => void,
        ): void => {
          if (!existsSync(uploadDirectory)) {
            mkdirSync(uploadDirectory, { recursive: true });
          }
          cb(null, uploadDirectory);
        },
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ): void => {
          const mime = file.mimetype.toLowerCase();
          const safeExt = ALLOWED_MIME_EXT_MAP[mime] ?? '.png';
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `img-${uniqueSuffix}${safeExt}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ): void => {
        const mime = file.mimetype.toLowerCase();
        const rawExt = extname(file.originalname).toLowerCase();

        // Strictly disallow SVG and non-standard image types to prevent Stored XSS / RCE
        if (!ALLOWED_MIME_EXT_MAP[mime] || !ALLOWED_EXTENSIONS.has(rawExt)) {
          cb(
            new BadRequestException(
              'Only standard image files (.jpg, .jpeg, .png, .gif, .webp) are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): UploadResult {
    return this.uploadsService.handleFileUpload(file);
  }
}
