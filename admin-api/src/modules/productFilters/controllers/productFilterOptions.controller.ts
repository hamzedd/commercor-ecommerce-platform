import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductFilterOptionsService } from '../services/productFilterOptions.service';
import { ApiBody } from '@nestjs/swagger';
import { ProductFilterOptionDto } from '@/src/libs/models/dtos/productsFilter/ProductFilterOption.dto';

@Controller('products/filters')
export class ProductFilterOptionsController {
  constructor(
    private readonly productFilterOptionsService: ProductFilterOptionsService,
  ) {}

  @ApiBody({
    description: 'Data for creating a new product filter option',
    type: ProductFilterOptionDto,
  })
  @Post('options')
  async CreateProductFilterOption(@Body() data: ProductFilterOptionDto) {
    return this.productFilterOptionsService.createProductFilterOption(data);
  }

  @Get(':filterId/options')
  async GetProductFilterOptionsByFilterId(@Param('filterId') filterId: string) {
    return this.productFilterOptionsService.getProductFilterOptionsByFilterId(
      filterId,
    );
  }

  @Delete('options/:id')
  async DeleteProductFilterOption(@Param('id') id: string) {
    return this.productFilterOptionsService.deleteProductFilterOption(id);
  }

  @ApiBody({
    description: 'Data for updating product filter option',
    type: ProductFilterOptionDto,
  })
  @Put('options/:id')
  async UpdateProductFilterOption(
    @Param('id') id: string,
    @Body() data: ProductFilterOptionDto,
  ) {
    return this.productFilterOptionsService.updateProductFilterOption(id, data);
  }
}
