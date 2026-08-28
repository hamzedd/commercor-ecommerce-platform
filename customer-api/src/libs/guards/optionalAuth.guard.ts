import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { Repository } from 'typeorm';

/**
 * Like AuthGuard, but never rejects the request - it just attaches
 * `request.user` when a valid bearer token is present. Used by endpoints
 * that must work for guests but personalize when a customer is logged in.
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(CustomerEntity)
    private usersRepository: Repository<CustomerEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: CustomerEntity }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return true;
    }
    try {
      const payload: { id: string; username: string } =
        await this.jwtService.verifyAsync(token, {
          secret: JWT_SECRET,
        });

      request.user =
        (await this.usersRepository.findOne({
          where: {
            id: payload.id,
          },
          select: ['firstName', 'lastName', 'username', 'email', 'id'],
        })) ?? undefined;
    } catch {
      // Invalid or expired token - proceed as a guest instead of rejecting.
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
