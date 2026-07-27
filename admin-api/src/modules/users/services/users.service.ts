import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { DeleteResult, Not, Repository } from 'typeorm';
import { CreateUserDto } from '@/src/libs/models/dtos/users/CreateUser.dto';
import { hashString } from '@/src/utils/functions/hashFunctions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(data: CreateUserDto): Promise<HttpStatus> {
    const user = this.userRepository.create({
      ...data,
      password: await hashString(data.password),
    });
    const userExists = await this.userRepository.findOneBy([
      { username: data.username },
      { email: data.email },
    ]);

    if (userExists?.username === data.username) {
      throw new BadRequestException('Username already exists');
    }

    if (userExists?.email === data.email) {
      throw new BadRequestException('Email already exists');
    }

    await this.userRepository.save(user);
    return HttpStatus.CREATED;
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role'],
    });
  }

  async getUser(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role'],
    });
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return this.userRepository.softDelete(id);
  }

  async editUser(id: string, data: CreateUserDto): Promise<HttpStatus> {
    const user = this.userRepository.create({
      id,
      ...data,
      password: await hashString(data.password),
    });
    const userExists = await this.userRepository.findOneBy([
      { username: data.username, id: Not(id) },
      { email: data.email, id: Not(id) },
    ]);

    if (userExists?.username === data.username) {
      throw new BadRequestException('Username already exists');
    }

    if (userExists?.email === data.email) {
      throw new BadRequestException('Email already exists');
    }
    await this.userRepository.save(user);
    return HttpStatus.OK;
  }
}
