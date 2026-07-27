import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({ description: 'Total payment amount', type: Number, example: 100 })
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ description: 'Amount refunded', type: Number, example: 20 })
  @IsNotEmpty()
  refundedAmount: number;

  @ApiProperty({ description: 'Payment status', type: String, example: 'completed' })
  @IsNotEmpty()
  status: string;
}
