import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
export class AdjustInventoryDto {
  @IsUUID() productId: string;
  @IsOptional() @IsUUID() variantId?: string | null;
  @Type(() => Number) @IsInt() adjustment: number;
  @IsOptional() @IsString() @MaxLength(1000) reason?: string;
}
export class SetInventoryDto {
  @IsUUID() productId: string;
  @IsOptional() @IsUUID() variantId?: string | null;
  @Type(() => Number) @IsInt() @Min(0) stock: number;
  @IsString() @MaxLength(1000) reason: string;
}
