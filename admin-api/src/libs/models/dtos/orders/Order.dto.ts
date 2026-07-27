import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ description: 'Amount of products in the order', type: Number, example: 3 })
  @IsNotEmpty()
  productAmount: number;

  @ApiProperty({ description: 'Delivery cost for the order', type: Number, example: 15 })
  @IsNotEmpty()
  deliveryAmount: number;

  @ApiProperty({ description: 'Status of the order', type: String, example: 'pending' })
  @IsNotEmpty()
  status: string;
}
