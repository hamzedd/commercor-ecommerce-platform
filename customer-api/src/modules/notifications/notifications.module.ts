import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationOutboxEntity } from '@/src/libs/models/entities/notification/NotificationOutbox.entity';
import { ConfiguredEmailProvider, EmailProvider } from './email.provider';
import { NotificationService } from './notification.service';
import { OutboxWorker } from './outbox.worker';
@Module({
  imports: [TypeOrmModule.forFeature([NotificationOutboxEntity])],
  providers: [
    NotificationService,
    OutboxWorker,
    ConfiguredEmailProvider,
    { provide: EmailProvider, useExisting: ConfiguredEmailProvider },
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
