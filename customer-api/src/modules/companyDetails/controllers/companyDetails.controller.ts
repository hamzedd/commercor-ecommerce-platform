import { Controller, Get, Param } from '@nestjs/common';
import { CompanyDetailsService } from '@/src/modules/companyDetails/services/companyDetails.service';

@Controller('company-details')
export class CompanyDetailsController {
  constructor(private readonly companyDetailsService: CompanyDetailsService) {}

  @Get()
  async GetCompanyDetails() {
    return await this.companyDetailsService.getCompanyDetails();
  }

  @Get(':key')
  async GetCompanyDetailByKey(@Param('key') key: string) {
    return this.companyDetailsService.getCompanyDetailByKey(key);
  }
}
