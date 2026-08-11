import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { DashboardService } from '@/src/modules/dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
