import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentRefundDto {
  @ApiProperty({ description: 'Amount to be refunded', type: Number, example: 20 })
  @IsNotEmpty()
  @IsNumber()
  refundedAmount: number;
}
