import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductDto } from '@/src/libs/models/dtos/products/Product.dto';
import { ProductsService } from '@/src/modules/product/services/products.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesValidationPipe } from '@/src/libs/pipes/images-validation.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for creating a new product',
    type: ProductDto,
  })
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  createProduct(
    @UploadedFiles(new ImagesValidationPipe())
    images: Express.Multer.File[],
    @Body() data: ProductDto,
  ) {
    return this.productsService.createProduct({ ...data, images });
  }

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for updating a product by ID',
    type: ProductDto,
  })
  @UseInterceptors(FilesInterceptor('images'))
  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() data: ProductDto,
    @UploadedFiles(new ImagesValidationPipe())
    images: Express.Multer.File[],
  ) {
    return this.productsService.updateProduct({
      id,
      data: { ...data, images },
    });
  }

  @ApiBody({
    description: 'Data for deleting a product by ID',
    type: ProductDto,
  })
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Get(':id/filter-values')
  async GetProductFilterValues(@Param('id') id: string) {
    return this.productsService.getProductFilterValues(id);
  }
}
