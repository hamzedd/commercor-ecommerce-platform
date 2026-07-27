import { Controller, Get, Query } from '@nestjs/common';
import { BrandsService } from '@/src/modules/brands/services/brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async getBrands(@Query('search') search?: string) {
    return this.brandsService.getBrands(search);
  }
}
