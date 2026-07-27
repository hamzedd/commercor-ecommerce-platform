import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from '@/src/libs/models/dtos/orders/CreateOrder.dto';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import type { GuardedApiResponse } from '@/src/utils/types/api.type';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @ApiBody({
    description: 'Data for creating a new Order',
    type: CreateOrderDto,
  })
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: GuardedApiResponse, @Body() data: CreateOrderDto) {
    return this.ordersService.create(req?.user.id, data);
  }

  @ApiBearerAuth()
  @ApiOperation({
    description: 'get customer orders',
  })
  @UseGuards(AuthGuard)
  @Get()
  GetCustomerOrders(@Req() req: GuardedApiResponse) {
    return this.ordersService.getCustomerOrders(req?.user.id);
  }
}
