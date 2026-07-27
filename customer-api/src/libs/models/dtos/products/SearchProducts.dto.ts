import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchProductsDto {
  @ApiProperty({
    description: 'Product Filter Values',
    type: [String],
  })
  @IsOptional()
  productFilterValues: string[];
}
