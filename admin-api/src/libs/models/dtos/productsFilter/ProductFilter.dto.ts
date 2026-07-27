import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductFilterTranslationDto } from '@/src/libs/models/dtos/productsFilter/ProductFilterTranslation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductFilterTypeEnum } from '@/src/utils/enums/ProductFilterEnums';

export class ProductFilterDto {
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
