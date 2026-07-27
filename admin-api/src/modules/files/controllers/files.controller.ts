import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from '@/src/modules/files/services/files.service';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(readonly service: FilesService) {}

  // @Get('buckets')
  // bucketsList() {
  //   return this.service.bucketsList();
  // }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: UploadFileDto })
  // uploadFile(@UploadedFile('file') file: Express.Multer.File) {
  //   return this.service.uploadFile({
  //     file,
  //   });
  // }

  @Get(':bucketName/:name')
  async getFile(
    @Param('bucketName') bucketName: CommercorMinioBucketEnums,
    @Param('name') name: string,
    @Res() res: Response,
  ) {
    const stream = await this.service.getFile({
      name,
      bucketName,
    });
    res.setHeader('Content-Disposition', `inline; filename="${name}"`);
    stream.pipe(res);
  }
}
