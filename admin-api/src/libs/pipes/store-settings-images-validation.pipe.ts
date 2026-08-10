import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StoreSettingsImagesValidationPipe implements PipeTransform {
  transform(files: Record<string, Express.Multer.File[]> | undefined) {
    const images = Object.values(files || {}).flat();
    const allowed = new Set([
      'image/webp',
      'image/png',
      'image/jpg',
      'image/jpeg',
    ]);
    for (const file of images) {
      if (!allowed.has(file.mimetype))
        throw new BadRequestException(
          `Invalid image type: ${file.originalname}`,
        );
      if (file.size > 5 * 1024 * 1024)
        throw new BadRequestException(
          `Image is too large: ${file.originalname}`,
        );
    }
    return files || {};
  }
}
