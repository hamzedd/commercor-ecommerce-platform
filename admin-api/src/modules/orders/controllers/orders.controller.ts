import { Body, Controller, Get, Put, Param, UseGuards, Req } from '@nestjs/common';
import { OrderDto } from '@/src/libs/models/dtos/orders/Order.dto';
import { OrdersService } from '../services/orders.service';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@/src/libs/guards/auth.guard'; import { RoleGuard } from '@/src/libs/guards/role.guard'; import { Role } from '@/src/libs/decorators/roles.decorator'; import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { FulfillmentService } from '../services/fulfillment.service'; import { FulfillmentDto } from '../dtos/Fulfillment.dto';

@Controller('orders')
@Role(UserRoleEnum.ADMIN,UserRoleEnum.SALES)
@UseGuards(AuthGuard,RoleGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,private readonly fulfillment:FulfillmentService) {}
  @Put(':id/fulfillment') updateFulfillment(@Param('id')id:string,@Req()req:any,@Body()d:FulfillmentDto){return this.fulfillment.transition(id,req.user.id,d)}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @ApiBody({
    description: 'Data for updating a order',
    type: OrderDto,
  })
  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() data: OrderDto) {
    return this.ordersService.updateOrder(id, data);
  }
}
