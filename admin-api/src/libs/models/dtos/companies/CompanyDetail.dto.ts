import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDetailDto {
  @ApiProperty({ description: 'Key of the company detail', type: String })
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'Value of the company detail',
    type: String,
    required: false,
  })
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file for the brand',
    required: false,
  })
  image: Express.Multer.File;
}
