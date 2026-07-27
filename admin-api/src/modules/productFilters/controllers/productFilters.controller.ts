import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ProductFilterDto } from '@/src/libs/models/dtos/productsFilter/ProductFilter.dto';
import { ProductFiltersService } from '@/src/modules/productFilters/services/productFilters.service';

@Controller('products/filters')
export class ProductFiltersController {
  constructor(private readonly productFiltersService: ProductFiltersService) {}

  @ApiBody({
    description: 'Data for creating a new product filter',
    type: ProductFilterDto,
  })
  @Post()
  CreateProductFilter(@Body() data: ProductFilterDto) {
    return this.productFiltersService.createProductFilter(data);
  }

  @Get()
  GetProductFilters() {
    return this.productFiltersService.getProductFilters();
  }

  @Get('with-options')
  GetProductFiltersWithOptions() {
    return this.productFiltersService.getProductFiltersWithOptions();
  }

  @Get('types')
  GetProductFilterTypes() {
    return this.productFiltersService.getProductFilterTypes();
  }

  @Get(':id')
  GetProductFilter(@Param('id') id: string) {
    return this.productFiltersService.getProductFilter(id);
  }

  @ApiBody({
    description: 'Data for updating product filter',
    type: ProductFilterDto,
  })
  @Put(':id')
  UpdateProductFilter(@Param('id') id: string, @Body() data: ProductFilterDto) {
    return this.productFiltersService.updateProductFilter(id, data);
  }

  @Delete(':id')
  DeleteProductFilter(@Param('id') id: string) {
    return this.productFiltersService.deleteProductFilter(id);
  }
}
