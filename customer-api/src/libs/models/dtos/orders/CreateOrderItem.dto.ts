import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

export class CreateOrderItemDto {
  @ApiProperty({ type: String })
  @IsUUID()
  productId: ProductEntity['id'];

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  quantity: number;
}
