import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentRefundDto {
  @ApiProperty({ description: 'Amount to be refunded', type: Number, example: 20 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  refundedAmount: number;
}
