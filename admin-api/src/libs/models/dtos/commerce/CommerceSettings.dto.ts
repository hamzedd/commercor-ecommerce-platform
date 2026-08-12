import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsNumber, IsOptional, Matches, Max, Min, ValidateNested } from 'class-validator';

export class CommerceCountryRuleDto {
  @Matches(/^[A-Z]{2}$/) countryCode: string;
  @IsBoolean() shippingEnabled: boolean;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) shippingFee: number | null;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) freeShippingThreshold: number | null;
  @IsBoolean() taxEnabled: boolean;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(100) taxRate: number | null;
}

export class CommerceSettingsDto {
  @IsBoolean() shippingEnabled: boolean;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) defaultShippingFee: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) freeShippingThreshold: number | null;
  @IsBoolean() taxEnabled: boolean;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(100) defaultTaxRate: number;
  @IsBoolean() pricesIncludeTax: boolean;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CommerceCountryRuleDto)
  @ArrayUnique((rule: CommerceCountryRuleDto) => rule.countryCode, { message: 'Country rules must be unique.' })
  countryRules: CommerceCountryRuleDto[];
}
