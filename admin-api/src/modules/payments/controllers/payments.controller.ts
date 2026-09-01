import { Body, Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { PaymentRefundDto } from '@/src/libs/models/dtos/payments/PaymentRefund.dto';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@/src/libs/guards/auth.guard'; import { RoleGuard } from '@/src/libs/guards/role.guard'; import { Role } from '@/src/libs/decorators/roles.decorator'; import { UserRoleEnum } from '@/src/utils/enums/UserEnums';

@Controller('payments')
@Role(UserRoleEnum.ADMIN)
@UseGuards(AuthGuard,RoleGuard)
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

  @Put(':id/mark-paid')
  markPaid(@Param('id') id: string) {
    return this.paymentsService.markManualPaymentPaid(id);
  }
}
