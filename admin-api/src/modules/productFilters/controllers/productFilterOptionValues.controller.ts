import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ProductFilterOptionValueDto } from '@/src/libs/models/dtos/productsFilter/ProductFilterOptionValue.dto';
import { ProductFilterOptionValuesService } from '@/src/modules/productFilters/services/productFilterOptionValues.service';

@Controller('products/filter-values')
export class ProductFilterOptionValuesController {
  constructor(
    private readonly productFilterOptionValuesService: ProductFilterOptionValuesService,
  ) {}

  @ApiBody({
    description: 'Data for Assigning a product filter option to a Product',
    type: ProductFilterOptionValueDto,
  })
  @Put()
  async AssignProductFilterValue(@Body() data: ProductFilterOptionValueDto) {
    return this.productFilterOptionValuesService.assignProductFilterValue(data);
  }

  @Delete(':id')
  async DeleteProductFilterOption(@Param('id') id: string) {
    return this.productFilterOptionValuesService.deleteProductFilterValue(id);
  }
}
