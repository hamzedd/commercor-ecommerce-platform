import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { BrandDto } from '@/src/libs/models/dtos/brands/Brand.dto';
import { BrandsService } from '@/src/modules/brands/services/brands.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesValidationPipe } from '@/src/libs/pipes/images-validation.pipe';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for creating a new brand',
    type: BrandDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  createBrand(
    @UploadedFile(new ImagesValidationPipe())
    image: Express.Multer.File,
    @Body() data: BrandDto,
  ) {
    return this.brandsService.createBrand({ ...data, image });
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getBrands() {
    return this.brandsService.getBrands();
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  getBrand(@Param('id') id: string) {
    return this.brandsService.getBrand(id);
  }

  @ApiBody({
    description: 'Data for deleting a brand by ID',
    type: BrandDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteBrand(@Param('id') id: string) {
    return this.brandsService.deleteBrand(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for updating a brand by ID',
    type: BrandDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.STOCK_MANAGER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  updateBrand(
    @UploadedFile(new ImagesValidationPipe())
    image: Express.Multer.File,
    @Param('id') id: string,
    @Body() data: BrandDto,
  ) {
    return this.brandsService.updateBrand(id, { ...data, image });
  }
}
