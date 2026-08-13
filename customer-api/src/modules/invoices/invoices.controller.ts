import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import type { GuardedApiResponse } from '@/src/utils/types/api.type';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(AuthGuard)
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}
  @Get() list(@Req() request: GuardedApiResponse) {
    return this.invoices.list(request.user.id);
  }
  @Get(':id') get(@Req() request: GuardedApiResponse, @Param('id') id: string) {
    return this.invoices.get(request.user.id, id);
  }
  @Get(':id/pdf') async pdf(
    @Req() request: GuardedApiResponse,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const invoice = await this.invoices.get(request.user.id, id);
    const pdf = createSafePdf(await this.invoices.pdf(request.user.id, id));
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    );
    response.send(pdf);
  }
}
const createSafePdf = (pdf: Buffer) => pdf;
