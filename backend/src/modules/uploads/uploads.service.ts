import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import 'multer';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

@Injectable()
export class UploadsService {
  ensureUploadDir(): string {
    const uploadPath = join(process.cwd(), 'uploads', 'images');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    return uploadPath;
  }

  handleFileUpload(file: Express.Multer.File): UploadResult {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const relativeUrl = `/uploads/images/${file.filename}`;
    return {
      url: relativeUrl,
      filename: file.filename,
      size: file.size,
    };
  }
}
