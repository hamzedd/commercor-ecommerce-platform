import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';

@Controller('system')
@Role(UserRoleEnum.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class SystemController {
  constructor(private readonly db: DataSource) {}

  @Get('notifications')
  async notifications() {
    const rows: Array<{ status: string; count: number }> = await this.db.query(
      `SELECT status, COUNT(*)::int count FROM notification_outbox GROUP BY status`,
    );
    const oldest: Array<{ oldest: Date | null }> = await this.db.query(
      `SELECT MIN(created_at) oldest FROM notification_outbox WHERE status = 'pending'`,
    );
    const counts = Object.fromEntries(
      rows.map((row) => [row.status, Number(row.count)]),
    );
    return {
      pending: counts.pending || 0,
      processing: 0,
      sent: counts.sent || 0,
      failed: counts.failed || 0,
      oldestPendingAt: oldest[0]?.oldest || null,
    };
  }
}
