import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { CompanyDetailDto } from '@/src/libs/models/dtos/companies/CompanyDetail.dto';
import { FilesService } from '@/src/modules/files/services/files.service';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(CompanyDetailEntity)
    private readonly companyRepository: Repository<CompanyDetailEntity>,
  ) {}

  async createCompany(data: CompanyDetailDto) {
    const uploadedFile = await this.filesService.uploadFile({
      file: data.image,
      bucketName: CommercorMinioBucketEnums.COMMERCOR,
    });

    const company = this.companyRepository.create({
      ...data,
      image: uploadedFile.objectName,
    });

    await this.companyRepository.save(company);

    return HttpStatus.CREATED;
  }

  async getCompanyDetails() {
    try {
      return await this.companyRepository.find();
    } catch {
      throw new NotFoundException(`Company not found`);
    }
  }

  async getCompanyDetail(id: string) {
    try {
      return await this.companyRepository.findOneBy({ id });
    } catch {
      throw new NotFoundException(`Company not found`);
    }
  }

  async updateCompany({ id, data }: { id: string; data: CompanyDetailDto }) {
    const companyDetail = await this.companyRepository.findOneBy({
      id,
    });

    if (!companyDetail) {
      throw new NotFoundException(`Company with ID: ${id} not found`);
    }

    let image: string;

    if (data?.image && companyDetail?.image) {
      this.filesService.deleteFile({
        bucketName: CommercorMinioBucketEnums.COMMERCOR,
        fileName: companyDetail.image,
      });
      image = (
        await this.filesService.uploadFile({
          bucketName: CommercorMinioBucketEnums.COMMERCOR,
          file: data.image,
        })
      ).objectName;
    }

    await this.companyRepository.update(id, {
      ...data,
      image: image || companyDetail?.image,
    });

    return HttpStatus.OK;
  }

  async deleteCompany(id: string) {
    const companyDetail = await this.companyRepository.findOneByOrFail({
      id,
    });

    if (!companyDetail) {
      throw new NotFoundException(`Company Detail with ID: ${id} not found`);
    }

    if (companyDetail?.image) {
      this.filesService.deleteFile({
        bucketName: CommercorMinioBucketEnums.COMMERCOR,
        fileName: companyDetail?.image,
      });
    }

    await this.companyRepository.softDelete(id);

    return HttpStatus.OK;
  }
}
