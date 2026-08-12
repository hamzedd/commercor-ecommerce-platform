import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import type { GuardedApiResponse } from '@/src/utils/types/api.type';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id/status')
  @UseGuards(AuthGuard)
  async CheckPaymentStatus(@Param('id') id: string, @Req() req:GuardedApiResponse) {
    return this.paymentsService.checkPaymentStatus(id,req.user.id);
  }
}
