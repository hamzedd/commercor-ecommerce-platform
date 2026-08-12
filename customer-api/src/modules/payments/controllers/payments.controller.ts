import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import type { GuardedApiResponse } from '@/src/utils/types/api.type';
import { PaymentInitializationService } from '../services/payment-initialization.service';
import { CapturePayPalDto } from '../dtos/capture-paypal.dto';
import { PayPalPaymentService } from '../services/paypal-payment.service';
import { PayPalWebhookService } from '../services/paypal-webhook.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly initialization: PaymentInitializationService,
    private readonly paypal: PayPalPaymentService,
    private readonly paypalWebhooks: PayPalWebhookService,
  ) {}

  @Post('webhooks/paypal')
  async paypalWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    if (!req.rawBody) throw new Error('Raw webhook body is unavailable');
    return this.paypalWebhooks.process({ headers, rawBody: req.rawBody });
  }

  @Post(':id/initialize')
  @UseGuards(AuthGuard)
  async initialize(@Param('id') id: string, @Req() req: GuardedApiResponse) {
    return this.initialization.initialize(id, req.user.id);
  }

  @Post(':id/paypal/capture')
  @UseGuards(AuthGuard)
  async capturePayPal(
    @Param('id') id: string,
    @Body() data: CapturePayPalDto,
    @Req() req: GuardedApiResponse,
  ) {
    return this.paypal.capture(id, req.user.id, data.paypalOrderId);
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
