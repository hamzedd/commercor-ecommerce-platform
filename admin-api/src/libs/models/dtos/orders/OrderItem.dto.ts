import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ description: 'ID of the product', type: String, example: 'prod_12345' })
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product in the order', type: Number, example: 2 })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Unit price of the product', type: Number, example: 25.5 })
  @IsNotEmpty()
  unitPrice: number;
}
