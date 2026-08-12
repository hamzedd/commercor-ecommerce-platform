import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/src/libs/guards/auth.guard'; import { RoleGuard } from '@/src/libs/guards/role.guard'; import { Role } from '@/src/libs/decorators/roles.decorator'; import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { LoyaltySettingsDto } from '@/src/libs/models/dtos/rewards/LoyaltySettings.dto'; import { RewardsService } from './rewards.service';
@Controller('loyalty-settings') @Role(UserRoleEnum.ADMIN) @UseGuards(AuthGuard, RoleGuard)
export class RewardsController { constructor(private readonly service: RewardsService) {} @Get() get() { return this.service.getSettings(); } @Put() put(@Body() data: LoyaltySettingsDto) { return this.service.updateSettings(data); } }
