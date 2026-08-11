import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from '@/src/libs/models/entities/customer/Address.entity';
import { AddressDto } from '@/src/libs/models/dtos/customers/Address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>,
  ) {}

  async createAddress(customerId: string, dto: AddressDto) {
    const address = this.addressRepo.create({ ...dto, customerId });
    return this.addressRepo.save(address);
  }

  async findAllAddresses(customerId: string) {
    return this.addressRepo.find({ where: { customerId } });
  }

  async findOneAddress(id: string) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async updateAddress(id: string, dto: Partial<AddressDto>) {
    const address = await this.findOneAddress(id);
    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  async removeAddress(id: string) {
    const address = await this.findOneAddress(id);
    return this.addressRepo.softDelete({ id: address.id });
  }
}
