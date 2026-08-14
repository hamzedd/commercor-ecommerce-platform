import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '@/src/libs/models/dtos/auth/Login.dto';
import { compareHashString } from '@/src/utils/functions/hashFunctions';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '@/src/utils/constants/environmentConstants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const { username, password } = data;

    const userExists = await this.userRepository.findOneBy({ username });

    if (!userExists) {
      throw new BadRequestException('Invalid username or password');
    }

    if (
      (await compareHashString({
        input: password,
        hash: userExists.password,
      })) === false
    ) {
      throw new BadRequestException('Invalid username or password');
    }
    return {
      accessToken: await this.jwtService.signAsync(
        {
          id: userExists.id,
          username: userExists.username,
        },
        {
          secret: JWT_SECRET,
          expiresIn: '1d',
          issuer: 'commercor-admin-api',
          audience: 'commercor-admin-web',
        },
      ),
    };
  }
}
