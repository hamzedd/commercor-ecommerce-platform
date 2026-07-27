import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '@/src/libs/models/dtos/auth/Login.dto';
import { compareHashString } from '@/src/utils/functions/hashFunctions';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const { username, password } = data;
    const customerExists = await this.customerRepository.findOneBy({
      username,
    });

    if (!customerExists || customerExists.deleted_at) {
      throw new BadRequestException('Invalid username or password');
    }

    if (
      !(await compareHashString({
        input: password,
        hash: customerExists.password,
      }))
    ) {
      throw new BadRequestException('Invalid username or password');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        id: customerExists.id,
        username: customerExists.username,
      }),
    };
  }
}
