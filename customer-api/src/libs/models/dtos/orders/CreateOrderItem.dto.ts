import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

export class CreateOrderItemDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  productId: ProductEntity['id'];

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  quantity: number;
}
