import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';
export class AddCartItemDto {
  @IsUUID() productId: string;
  @IsOptional() @IsUUID() variantId?: string | null;
  @IsInt() @Min(1) quantity: number;
}
export class UpdateCartItemDto { @IsInt() @Min(1) quantity: number; }
