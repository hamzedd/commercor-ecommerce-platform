import { Body, Controller, Get, Put, Param } from '@nestjs/common';
import { OrderDto } from '@/src/libs/models/dtos/orders/Order.dto';
import { OrdersService } from '../services/orders.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
