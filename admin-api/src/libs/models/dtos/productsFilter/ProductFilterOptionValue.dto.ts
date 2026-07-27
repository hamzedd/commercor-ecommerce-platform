import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductFilterOptionValueDto {
  @ApiProperty({
    description: 'Product Filter ID',
    type: 'string',
  })
  @IsNotEmpty()
  @IsUUID()
  productFilterId: string;

  @ApiProperty({
    description: 'Product Filter Option ID',
    type: 'string',
  })
  @IsNotEmpty()
  @IsUUID()
  productFilterOptionId: string;

  @ApiProperty({
    description: 'Product ID',
    type: 'string',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
