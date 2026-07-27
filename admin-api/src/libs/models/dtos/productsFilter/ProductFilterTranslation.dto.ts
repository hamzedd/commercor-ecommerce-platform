import { IsEnum, IsNotEmpty } from 'class-validator';
import { CountryLangEnum } from '@/src/utils/enums/CountryEnums';
import { ApiProperty } from '@nestjs/swagger';

export class ProductFilterTranslationDto {
  @ApiProperty({ enum: CountryLangEnum })
  @IsEnum(CountryLangEnum)
  lang: CountryLangEnum;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
