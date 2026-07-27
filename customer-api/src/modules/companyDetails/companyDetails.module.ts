import { Module } from '@nestjs/common';
import { CompanyDetailsService } from './services/companyDetails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { CompanyDetailsController } from '@/src/modules/companyDetails/controllers/companyDetails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDetailEntity])],
  controllers: [CompanyDetailsController],
  providers: [CompanyDetailsService],
})
export class CompanyDetailsModule {}
