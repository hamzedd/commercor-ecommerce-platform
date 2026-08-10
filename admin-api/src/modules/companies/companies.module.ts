import { Module } from '@nestjs/common';
import { CompaniesController } from '@/src/modules/companies/controllers/companies.controller';
import { CompaniesService } from './services/companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { StoreSettingsController } from './controllers/storeSettings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDetailEntity, UserEntity])],
  controllers: [CompaniesController, StoreSettingsController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
