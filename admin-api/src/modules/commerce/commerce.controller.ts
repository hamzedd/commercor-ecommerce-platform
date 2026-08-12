import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { CommerceSettingsDto } from '@/src/libs/models/dtos/commerce/CommerceSettings.dto';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { CommerceService } from './commerce.service';

@Controller('commerce-settings')
@ApiBearerAuth()
@Role(UserRoleEnum.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class CommerceController {
  constructor(private readonly service: CommerceService) {}
  @Get() getSettings() { return this.service.getSettings(); }
  @Put() updateSettings(@Body() data: CommerceSettingsDto) { return this.service.updateSettings(data); }
}
