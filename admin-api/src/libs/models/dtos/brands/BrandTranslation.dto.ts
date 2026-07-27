import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CountryLangEnum } from '@/src/utils/enums/CountryEnums';
import { ApiProperty } from '@nestjs/swagger';

export class BrandTranslationDto {
  @ApiProperty({ enum: CountryLangEnum })
  @IsEnum(CountryLangEnum)
  lang: CountryLangEnum;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: String, description: 'URL-friendly slug (lowercase, hyphens only)' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric and may contain hyphens (e.g. "brand-name")',
  })
  slug: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  metaTitle: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  metaDescription: string;
}
