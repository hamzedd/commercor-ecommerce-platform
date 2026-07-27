import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { BrandTranslationDto } from '@/src/libs/models/dtos/brands/BrandTranslation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BrandDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  rank: number;

  @ApiProperty({ type: () => [BrandTranslationDto] })
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
      return Array.isArray(v) ? plainToInstance(BrandTranslationDto, v) : v;
    },
    { toClassOnly: true },
  )
  @ValidateNested({ each: true })
  @Type(() => BrandTranslationDto)
  @ArrayMinSize(1, { message: 'At least one translation is required.' })
  translations: BrandTranslationDto[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file for the brand',
  })
  image: Express.Multer.File;
}
