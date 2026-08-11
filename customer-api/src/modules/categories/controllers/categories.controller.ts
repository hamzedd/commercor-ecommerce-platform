import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from '@/src/modules/categories/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  async getCategories(@Query('search') search?: string) {
    return this.categoriesService.getCategories(search);
  }

  @Get(':slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getCategoryBySlug(slug);
  }
}
