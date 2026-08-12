import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from '@/src/libs/models/dtos/orders/CreateOrderItem.dto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { AddressEntity } from '@/src/libs/models/entities/customer/Address.entity';

export class CreateOrderDto {
  @ApiProperty({ type: () => [CreateOrderItemDto] })
  @Transform(
    ({ value }): any => {
      let v: any = value;
      if (typeof v === 'string') {
        try {
          v = JSON.parse(v);
        } catch {
          return v;
        }
      }
      return Array.isArray(v) ? plainToInstance(CreateOrderItemDto, v) : v;
    },
    { toClassOnly: true },
  )
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1, { message: 'At least one item is required.' })
  items: CreateOrderItemDto[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUUID()
  addressId: AddressEntity['id'];

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  usePoints?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  useCashback?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value)
  couponCode?: string;
}
