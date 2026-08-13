import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { InventoryService } from './inventory.service';
import { AdjustInventoryDto, SetInventoryDto } from './inventory.dto';
@Controller('inventory')
@Role(UserRoleEnum.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class InventoryController {
  constructor(private inventory: InventoryService) {}
  @Get() list() {
    return this.inventory.list();
  }
  @Get('movements') movements() {
    return this.inventory.movements();
  }
  @Post('adjust') adjust(@Req() r: any, @Body() d: AdjustInventoryDto) {
    return this.inventory.adjust(r.user.id, d);
  }
  @Post('set') set(@Req() r: any, @Body() d: SetInventoryDto) {
    return this.inventory.adjust(r.user.id, d, true);
  }
}
