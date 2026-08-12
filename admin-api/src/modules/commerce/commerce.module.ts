import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { CommerceSettingsEntity } from '@/src/libs/models/entities/commerce/CommerceSettings.entity';
import { CommerceCountryRuleEntity } from '@/src/libs/models/entities/commerce/CommerceCountryRule.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { CommerceController } from './commerce.controller';
import { CommerceService } from './commerce.service';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([
      CommerceSettingsEntity,
      CommerceCountryRuleEntity,
      UserEntity,
    ]),
  ],
  controllers: [CommerceController],
  providers: [CommerceService, AuthGuard, RoleGuard],
})
export class CommerceModule {}
