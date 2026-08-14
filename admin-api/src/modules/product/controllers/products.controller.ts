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
  UseGuards,
} from '@nestjs/common';
import { ProductDto } from '@/src/libs/models/dtos/products/Product.dto';
import { ProductsService } from '@/src/modules/product/services/products.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesValidationPipe } from '@/src/libs/pipes/images-validation.pipe';
import { ProductVariantsService } from '../services/product-variants.service';
import { VariantDto, VariantOptionDto } from '../dtos/variant.dto';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';

@Controller('products')
@Role(UserRoleEnum.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly variants: ProductVariantsService) {}
  @Get(':id/variants') getVariants(@Param('id') id:string){return this.variants.list(id)}
  @Post(':id/variant-options') addVariantOption(@Param('id')id:string,@Body()data:VariantOptionDto){return this.variants.addOption(id,data)}
  @Post(':id/variants') createVariant(@Param('id')id:string,@Body()data:VariantDto){return this.variants.create(id,data)}
  @Put(':id/variants/:variantId') updateVariant(@Param('id')id:string,@Param('variantId')variantId:string,@Body()data:VariantDto){return this.variants.update(id,variantId,data)}
  @Delete(':id/variants/:variantId') deleteVariant(@Param('id')id:string,@Param('variantId')variantId:string){return this.variants.remove(id,variantId)}

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
