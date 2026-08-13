import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { DataSource, Repository } from 'typeorm';
import { LoginDto } from '@/src/libs/models/dtos/auth/Login.dto';
import {
  compareHashString,
  hashString,
} from '@/src/utils/functions/hashFunctions';
import { createHash, randomBytes } from 'crypto';
import { PasswordResetTokenEntity } from '@/src/libs/models/entities/customer/PasswordResetToken.entity';
import { NotificationService } from '@/src/modules/notifications/notification.service';
import {
  DOMAIN_URL,
  PASSWORD_RESET_EXPIRY_MINUTES,
} from '@/src/utils/environmentConstants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private notifications: NotificationService,
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

  async forgotPassword(email: string) {
    const response = {
      message:
        'If an account exists for this email, a password reset link has been sent.',
    };
    await this.dataSource.transaction(async (manager) => {
      const customer = await manager
        .getRepository(CustomerEntity)
        .createQueryBuilder('customer')
        .where('LOWER(customer.email) = LOWER(:email)', { email: email.trim() })
        .getOne();
      if (!customer || customer.deleted_at) return;
      const repo = manager.getRepository(PasswordResetTokenEntity),
        now = new Date();
      await repo
        .createQueryBuilder()
        .update()
        .set({ usedAt: now })
        .where('"customerId" = :customerId AND "usedAt" IS NULL', {
          customerId: customer.id,
        })
        .execute();
      const token = randomBytes(32).toString('base64url');
      const tokenHash = createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(
        now.getTime() + PASSWORD_RESET_EXPIRY_MINUTES * 60_000,
      );
      const record = await repo.save(
        repo.create({
          customerId: customer.id,
          tokenHash,
          expiresAt,
          usedAt: null,
        }),
      );
      const base = (DOMAIN_URL || '').replace(/\/$/, '');
      await this.notifications.queueCustomer(
        manager,
        customer,
        'password_reset',
        `password_reset:${record.id}`,
        {
          resetUrl: `${base}/reset-password?token=${encodeURIComponent(token)}`,
          expiryMinutes: PASSWORD_RESET_EXPIRY_MINUTES,
        },
      );
    });
    return response;
  }

  async resetPassword(token: string, password: string) {
    if (!password.trim())
      throw new BadRequestException('Password cannot be blank');
    const hash = createHash('sha256').update(token).digest('hex');
    return this.dataSource.transaction(async (manager) => {
      const record = await manager
        .getRepository(PasswordResetTokenEntity)
        .findOne({
          where: { tokenHash: hash },
          lock: { mode: 'pessimistic_write' },
        });
      if (!record || record.usedAt || record.expiresAt.getTime() <= Date.now())
        throw new BadRequestException('Invalid or expired reset link');
      const customer = await manager
        .getRepository(CustomerEntity)
        .findOne({
          where: { id: record.customerId },
          lock: { mode: 'pessimistic_write' },
        });
      if (!customer || customer.deleted_at)
        throw new BadRequestException('Invalid or expired reset link');
      customer.password = await hashString(password);
      record.usedAt = new Date();
      await manager.getRepository(CustomerEntity).save(customer);
      await manager.getRepository(PasswordResetTokenEntity).save(record);
      await manager
        .getRepository(PasswordResetTokenEntity)
        .createQueryBuilder()
        .update()
        .set({ usedAt: record.usedAt })
        .where('"customerId"=:customerId AND "usedAt" IS NULL AND id<>:id', {
          customerId: customer.id,
          id: record.id,
        })
        .execute();
      return { message: 'Password reset successful' };
    });
  }
}
