import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CountryLangEnum } from '@/src/utils/enums/CountryEnums';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryTranslationDto {
  @ApiProperty({
    enum: CountryLangEnum,
  })
  @IsEnum(CountryLangEnum)
  lang: CountryLangEnum;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  metaTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  metaDescription: string;
}
