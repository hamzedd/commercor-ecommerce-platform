import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({ description: 'Customer first name', type: String, example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Customer last name', type: String, example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Username for login', type: String, example: 'john_doe' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Customer email', type: String, example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ description: 'Password for login', type: String, example: 'StrongP@ssw0rd' })
  @IsNotEmpty()
  password: string;
}
