import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CountryLangEnum } from '@/src/utils/enums/CountryEnums';

export class ProductFilterOptionTranslationDto {
  @IsEnum(CountryLangEnum)
  lang: CountryLangEnum;

  @IsNotEmpty()
  name: string;
}
