import { CustomerDto } from '@/src/libs/models/dtos/customers/Customer.dto';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { hashString } from '@/src/utils/functions/hashFunctions';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async createCustomer(data: CustomerDto) {
    const costumerExist = await this.customerRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });

    if (costumerExist) {
      throw new NotFoundException(
        `Customer with email: ${data.email} or username: ${data.username} already exists`,
      );
    }

    const customer = this.customerRepository.create({
      ...data,
      password: await hashString(data.password),
    });
    await this.customerRepository.save(customer);

    return HttpStatus.CREATED;
  }

  async getCustomers() {
    return this.customerRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'username',
        'created_at',
      ],
    });
  }

  async getCustomer(id: string) {
    try {
      return await this.customerRepository.findOneOrFail({
        where: { id },
        select: [
          'id',
          'firstName',
          'lastName',
          'email',
          'username',
          'created_at',
        ],
      });
    } catch {
      throw new NotFoundException(`Customer with ID: ${id} not found`);
    }
  }

  async updateCustomer({ id, data }: { id: string; data: CustomerDto }) {
    try {
      await this.customerRepository.findOneByOrFail({
        id,
      });
    } catch {
      throw new NotFoundException(`Customer with ID: ${id} not found`);
    }

    await this.customerRepository.update(id, {
      ...data,
      password: await hashString(data.password),
    });

    return HttpStatus.OK;
  }

  async deleteCustomer(id: string) {
    try {
      await this.customerRepository.findOneByOrFail({
        id,
      });
    } catch {
      throw new NotFoundException(`Customer with ID: ${id} not found`);
    }

    await this.customerRepository.softDelete(id);

    return HttpStatus.OK;
  }
}
