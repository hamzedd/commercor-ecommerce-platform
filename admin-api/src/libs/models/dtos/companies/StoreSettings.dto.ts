import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { SUPPORTED_STORE_LOCALES } from '@/src/utils/enums/StoreSettingsEnums';

const optionalText = () =>
  Transform(({ value }) => (value === '' ? undefined : value));
const booleanValue = () =>
  Transform(({ value }) => value === true || value === 'true');

export class StoreSettingsDto {
  @IsString() @IsNotEmpty() @Length(2, 120) storeName: string;
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  @optionalText()
  contactEmail?: string;
  @IsOptional() @IsString() @MaxLength(40) @optionalText() phone?: string;
  @IsOptional() @IsString() @MaxLength(500) @optionalText() address?: string;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  @optionalText()
  facebookUrl?: string;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  @optionalText()
  instagramUrl?: string;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  @optionalText()
  twitterUrl?: string;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  @optionalText()
  linkedinUrl?: string;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  @optionalText()
  youtubeUrl?: string;
  @IsOptional() @Matches(/^#[0-9A-Fa-f]{6}$/) primaryColor?: string;
  @IsOptional() @Matches(/^#[0-9A-Fa-f]{6}$/) accentColor?: string;
  @IsOptional() @Matches(/^[A-Z]{3}$/) currencyCode?: string;
  @IsOptional() @IsIn(SUPPORTED_STORE_LOCALES) defaultLocale?: string;
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @optionalText()
  homeMetaTitle?: string;
  @IsOptional()
  @IsString()
  @MaxLength(320)
  @optionalText()
  homeMetaDescription?: string;
  @IsOptional() @IsBoolean() @booleanValue() removeLogo?: boolean;
  @IsOptional() @IsBoolean() @booleanValue() removeFavicon?: boolean;
  @IsOptional() @IsBoolean() @booleanValue() removeOpenGraphImage?: boolean;
}
