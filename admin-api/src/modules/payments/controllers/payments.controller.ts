import { Body, Controller, Get, Put, Param } from '@nestjs/common';
import { PaymentRefundDto } from '@/src/libs/models/dtos/payments/PaymentRefund.dto';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Get(':id')
  getPaymentById(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @ApiBody({
    description: 'Data for refunding a payment',
    type: PaymentRefundDto,
  })
  @Put(':id')
  updatePayment(@Param('id') id: string, @Body() data: PaymentRefundDto) {
    return this.paymentsService.refundPayment(id, data);
  }
}
