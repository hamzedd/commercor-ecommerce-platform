import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';

@Injectable()
export class CompanyDetailsService {
  constructor(
    @InjectRepository(CompanyDetailEntity)
    private readonly companyDetailsRepository: Repository<CompanyDetailEntity>,
  ) {}

  getCompanyDetails() {
    return this.companyDetailsRepository.find();
  }

  getCompanyDetailByKey(key: string) {
    return this.companyDetailsRepository.findOneBy({
      key,
    });
  }
}
