import { ApiProperty } from '@nestjs/swagger';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';

export class GetFileDto {
  @ApiProperty({
    required: true,
    description: 'The name of the file to retrieve',
  })
  name: string;

  @ApiProperty({
    enum: CommercorMinioBucketEnums,
    required: true,
    description: 'The bucket to upload the file to',
  })
  bucketName?: CommercorMinioBucketEnums;
}
