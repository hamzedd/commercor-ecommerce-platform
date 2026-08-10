import {
  Body,
  Controller,
  Get,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from '../services/companies.service';
import { StoreSettingsDto } from '@/src/libs/models/dtos/companies/StoreSettings.dto';
import { StoreSettingsImagesValidationPipe } from '@/src/libs/pipes/store-settings-images-validation.pipe';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';

@ApiBearerAuth()
@Role(UserRoleEnum.ADMIN, UserRoleEnum.COMPANY)
@UseGuards(AuthGuard, RoleGuard)
@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getStoreSettings() {
    return this.companiesService.getStoreSettings();
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'favicon', maxCount: 1 },
      { name: 'openGraphImage', maxCount: 1 },
    ]),
  )
  @Put()
  updateStoreSettings(
    @UploadedFiles(new StoreSettingsImagesValidationPipe())
    files: Record<string, Express.Multer.File[]>,
    @Body() data: StoreSettingsDto,
  ) {
    return this.companiesService.updateStoreSettings(data, files || {});
  }
}
