import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductFilterTranslationDto } from '@/src/libs/models/dtos/productsFilter/ProductFilterTranslation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductFilterTypeEnum } from '@/src/utils/enums/ProductFilterEnums';

export class ProductFilterDto {
  @ApiProperty({ type: [String], format: 'uuid' })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds: string[];

  @ApiProperty({
    default: ProductFilterTypeEnum.String,
    enum: ProductFilterTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(ProductFilterTypeEnum)
  type: ProductFilterTypeEnum;

  @ApiProperty({
    type: [ProductFilterTranslationDto],
    default: [
      {
        lang: 'GE',
        name: 'Sample Filter',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductFilterTranslationDto)
  translations: ProductFilterTranslationDto[];
}
