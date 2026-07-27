import { IsEnum, IsNotEmpty, IsEmail } from 'class-validator';
import { CompanyUserRoleEnum } from '@/src/utils/enums/CompanyEnums';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyUserDto {
  @ApiProperty({ description: 'Username for the company user', type: String })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password for the company user', type: String })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ 
    description: 'Email address of the company user', 
    type: String, 
    example: 'user@example.com' 
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Full name of the company user', type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Role of the company user', 
    enum: CompanyUserRoleEnum 
  })
  @IsEnum(CompanyUserRoleEnum)
  role: CompanyUserRoleEnum;
}
