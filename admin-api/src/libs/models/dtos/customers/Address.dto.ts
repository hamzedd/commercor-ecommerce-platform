import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ description: 'Country of the address', type: String, example: 'Georgia' })
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'City ID or code', type: Number, example: 1 })
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Street name', type: String, example: 'Freedom Street' })
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Detailed address info (building, apartment, etc.)', type: String, example: 'Building 5, Apt 12' })
  @IsNotEmpty()
  detail: string;

  @ApiProperty({ description: 'Phone number associated with the address', type: String, example: '+995 555 123 456' })
  @IsNotEmpty()
  phoneNumber: string;
}
