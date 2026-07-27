import {
  ArrayMinSize,
  IsArray,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CategoryTranslationDto } from '@/src/libs/models/dtos/categories/CategoryTranslation.dto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  @ValidateIf((o: CategoryDto) => !!o?.parentId)
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file for the category',
  })
  image: Express.Multer.File;

  @ApiProperty({
    type: [CategoryTranslationDto],
    default: [
      {
        lang: 'GE',
        name: 'Sample Category',
        description: 'This is a sample category description.',
        slug: 'sample-category',
        metaTitle: 'Sample Category Meta Title',
        metaDescription: 'Sample Category Meta Description',
      },
    ],
  })
  @Transform(
    ({ value }) => {
      let v = value;
      if (typeof v === 'string') {
        try {
          v = JSON.parse(v);
        } catch {
          return v;
        }
      }
      return Array.isArray(v) ? plainToInstance(CategoryTranslationDto, v) : v;
    },
    { toClassOnly: true },
  )
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  @ArrayMinSize(1, { message: 'At least one translation is required.' })
  translations: CategoryTranslationDto[];
}
