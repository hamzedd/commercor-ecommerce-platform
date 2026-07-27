import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryDto } from '@/src/libs/models/dtos/categories/Category.dto';
import { CategoriesService } from '@/src/modules/categories/services/categories.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesValidationPipe } from '@/src/libs/pipes/images-validation.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for creating a new category',
    type: CategoryDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  createCategory(
    @UploadedFile(new ImagesValidationPipe())
    image: Express.Multer.File,
    @Body() data: CategoryDto,
  ) {
    return this.categoriesService.createCategory({ ...data, image });
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @ApiBody({
    description: 'Data for deleting a category by ID',
    type: CategoryDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }

  @ApiBody({
    description: 'Data for updating a category by ID',
    type: CategoryDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  updateCategory(
    @UploadedFile(new ImagesValidationPipe())
    image: Express.Multer.File,
    @Param('id') id: string,
    @Body() data: CategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, { ...data, image });
  }
}
