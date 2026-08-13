import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

export class CreateOrderItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  variantId?: string;
  @ApiProperty({ type: String })
  @IsUUID()
  productId: ProductEntity['id'];

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  quantity: number;
}
