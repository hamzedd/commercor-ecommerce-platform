import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CompanyDetailDto } from '@/src/libs/models/dtos/companies/CompanyDetail.dto';
import { CompaniesService } from '@/src/modules/companies/services/companies.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesValidationPipe } from '@/src/libs/pipes/images-validation.pipe';
import { StoreSettingsDto } from '@/src/libs/models/dtos/companies/StoreSettings.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @ApiBody({
    description: 'Data for creating a new company',
    type: CompanyDetailDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  createCompany(
    @UploadedFile(new ImagesValidationPipe())
    image: Express.Multer.File,
    @Body() data: CompanyDetailDto,
  ) {
    return this.companiesService.createCompany({ ...data, image });
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getCompanyDetails() {
    return this.companiesService.getCompanyDetails();
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  getCompanyDetail(@Param('id') id: string) {
    return this.companiesService.getCompanyDetail(id);
  }

  @ApiBody({
    description: 'Data for deleting a company by ID',
    type: CompanyDetailDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteCompany(@Param('id') id: string) {
    return this.companiesService.deleteCompany(id);
  }

  @ApiBody({
    description: 'Data for updating a company by ID',
    type: CompanyDetailDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  updateCompany(
    @UploadedFile(new ImagesValidationPipe())
    image: Express.Multer.File,
    @Param('id') id: string,
    @Body() data: CompanyDetailDto,
  ) {
    return this.companiesService.updateCompany({
      id,
      data: {
        ...data,
        image,
      },
    });
  }
}

@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getStoreSettings() {
    return this.companiesService.getStoreSettings();
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Put()
  updateStoreSettings(@Body() data: StoreSettingsDto) {
    return this.companiesService.updateStoreSettings(data);
  }
}
