import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CountryLangEnum } from '@/src/utils/enums/CountryEnums';
import { ApiProperty } from '@nestjs/swagger';

export class ProductTranslationDto {
  @ApiProperty({ description: 'Language of the translation', enum: CountryLangEnum })
  @IsEnum(CountryLangEnum)
  lang: CountryLangEnum;

  @ApiProperty({ description: 'Product name in the specified language', type: String, example: ' Product' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product description in the specified language', type: String, example: 'This is product.' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'URL-friendly slug (lowercase, hyphens only)', type: String, example: 'product' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric and may contain hyphens (e.g. "awesome-product")',
  })
  slug: string;

  @ApiProperty({ description: 'Meta title for SEO', type: String, example: 'Buy Product Online' })
  @IsNotEmpty()
  metaTitle: string;

  @ApiProperty({ description: 'Meta description for SEO', type: String, example: 'Purchase product at best price online.' })
  @IsNotEmpty()
  metaDescription: string;
}
