import { CustomerDto } from '@/src/libs/models/dtos/customers/Customer.dto';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { hashString } from '@/src/utils/functions/hashFunctions';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { EditCustomerProfileDto } from '@/src/libs/models/dtos/customers/EditCustomerProfile.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async registerCustomer(data: CustomerDto) {
    const customerExist = await this.customerRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });

    if (customerExist) {
      throw new ConflictException(
        `Customer with email: ${data.email} or username: ${data.username} already exists`,
      );
    }

    const customer = this.customerRepository.create({
      ...data,
      password: await hashString(data.password),
    });
    await this.customerRepository.save(customer);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Customer registered successfully',
    };
  }
  async editCustomer({
    customer,
    data,
  }: {
    customer: CustomerEntity;
    data: EditCustomerProfileDto;
  }): Promise<HttpStatus> {
    const customerExists = await this.customerRepository.findOneBy([
      { username: data.username, id: Not(customer.id) },
      { email: data.email, id: Not(customer.id) },
    ]);

    if (customerExists?.username === data.username) {
      throw new BadRequestException('Username already exists');
    }

    if (customerExists?.email === data.email) {
      throw new BadRequestException('Email already exists');
    }

    const updatedCustomer = this.customerRepository.create({
      ...customer,
      ...data,
    });
    await this.customerRepository.save(updatedCustomer);
    return HttpStatus.OK;
  }
}
