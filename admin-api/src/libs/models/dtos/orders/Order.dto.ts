import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ description: 'Fulfillment status', enum: ['processing','shipped','delivered'] })
  @IsIn(['processing','shipped','delivered'])
  status: string;
}
