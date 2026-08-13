import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderDto } from '@/src/libs/models/dtos/orders/Order.dto';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { OrderStatusHistoryEntity } from '@/src/libs/models/entities/order/OrderStatusHistory.entity'; import { validNextFulfillmentStatuses } from '../fulfillment-state';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepository: Repository<OrderItemEntity>,
  ) {}

  async getAllOrders(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        address: true,
        customer: true,
      },
    });
  }

  async getOrderById(
    id: string,
  ): Promise<OrderEntity & { orderItems: OrderItemEntity[]; statusHistory: OrderStatusHistoryEntity[]; validNextFulfillmentStatuses: string[] }> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id },
      relations: {
        customer: true,
        address: true,
        payment: true,
      },
    });
    const statusHistory=await this.orderRepository.manager.getRepository(OrderStatusHistoryEntity).find({where:{orderId:id},order:{created_at:'ASC'}});return {
      ...order,
      statusHistory,
      validNextFulfillmentStatuses:validNextFulfillmentStatuses((order.fulfillmentStatus||'pending') as any),
      orderItems: await this.orderItemsRepository.find({
        where: { orderId: order.id },
        relations: {
          product: {
            translations: true,
            images: true,
          },
        },
      }),
    };
  }

  async updateOrder(id: string, data: OrderDto): Promise<{ message: string }> {
    await this.orderRepository.manager.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderEntity);

      const order = await orderRepo.findOneOrFail({
        where: { id },
      });
      const payment=await manager.getRepository(PaymentEntity).findOneBy({id:order.paymentId});
      if(!payment||payment.status!==PaymentStatus.COMPLETED)throw new BadRequestException('Unpaid orders cannot enter fulfillment states');
      Object.assign(order, data);

      await orderRepo.save(order);
    });

    return { message: 'Order updated successfully' };
  }
}
