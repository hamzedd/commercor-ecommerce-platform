import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import type { GuardedApiResponse } from '@/src/utils/types/api.type';
import { PaymentInitializationService } from '../services/payment-initialization.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly initialization: PaymentInitializationService,
  ) {}

  @Post(':id/initialize')
  @UseGuards(AuthGuard)
  async initialize(@Param('id') id: string, @Req() req: GuardedApiResponse) {
    return this.initialization.initialize(id, req.user.id);
  }

  @Get(':id/status')
  @UseGuards(AuthGuard)
  async CheckPaymentStatus(
    @Param('id') id: string,
    @Req() req: GuardedApiResponse,
  ) {
    return this.paymentsService.checkPaymentStatus(id, req.user.id);
  }
}
