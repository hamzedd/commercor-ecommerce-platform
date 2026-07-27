import { Global, Module } from '@nestjs/common';
import { FilesController } from '@/src/modules/files/controllers/files.controller';
import { FilesService } from '@/src/modules/files/services/files.service';
import { MinioModule } from '@/src/modules/minio/minio.module';

@Global()
@Module({
  imports: [MinioModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
