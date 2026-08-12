import {Transform,Type} from 'class-transformer'; import {IsBoolean,IsDate,IsEnum,IsInt,IsNotEmpty,IsNumber,IsOptional,IsString,MaxLength,Min} from 'class-validator'; import {CouponType} from '@/src/libs/models/entities/coupon/Coupon.entity';
export class CouponDto {
 @IsString() @IsNotEmpty() @MaxLength(100) @Transform(({value})=>value?.trim().toUpperCase()) code:string;
 @IsString() @IsNotEmpty() @MaxLength(200) name:string; @IsOptional() @IsString() description?:string|null;
 @IsEnum(CouponType) type:CouponType; @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0.01) value:number;
 @IsBoolean() enabled:boolean; @IsOptional() @Type(()=>Date) @IsDate() startsAt?:Date|null; @IsOptional() @Type(()=>Date) @IsDate() expiresAt?:Date|null;
 @IsOptional() @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) minimumOrderAmount?:number|null; @IsOptional() @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) maximumDiscountAmount?:number|null;
 @IsOptional() @Type(()=>Number) @IsInt() @Min(1) usageLimit?:number|null; @IsOptional() @Type(()=>Number) @IsInt() @Min(1) usageLimitPerCustomer?:number|null;
}
