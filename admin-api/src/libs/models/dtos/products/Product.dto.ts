import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsUUID,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { ProductTranslationDto } from '@/src/libs/models/dtos/products/ProductTranslation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'Price of the product',
    type: Number,
    example: 99.99,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Available stock of the product',
    type: Number,
    example: 50,
  })
  @IsNotEmpty()
  stock: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  lowStockThreshold?: number | null;

  @ApiProperty({
    type: () => [ProductTranslationDto],
    description: 'Translations for the product (at least one required)',
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
      return Array.isArray(v) ? plainToInstance(ProductTranslationDto, v) : v;
    },
    { toClassOnly: true },
  )
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @ArrayMinSize(1)
  translations: ProductTranslationDto[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images: Express.Multer.File[];

  @ApiProperty({
    description: 'Brand ID associated with the product',
    example: '00000000-0000-0000-0000-000000000001',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @ApiProperty({
    description: 'Category ID associated with the product',
    example: '00000000-0000-0000-0000-000000000002',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
