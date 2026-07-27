import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImagesValidationPipe implements PipeTransform {
  constructor(
    private readonly maxSize = 5 * 1024 * 1024,
    private readonly allowed = new Set([
      'image/webp',
      'image/png',
      'image/jpg',
      'image/jpeg',
    ]),
  ) {}

  transform(files: Express.Multer.File[]) {
    if (!files?.length) return files;

    for (const f of files) {
      if (!this.allowed.has(f.mimetype)) {
        throw new BadRequestException(`Invalid type: ${f.originalname}`);
      }
      if (f.size > this.maxSize) {
        throw new BadRequestException(`Too large: ${f.originalname}`);
      }
    }
    return files;
  }
}
