import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id/status')
  async CheckPaymentStatus(@Param('id') id: string) {
    return this.paymentsService.checkPaymentStatus(id);
  }
}
