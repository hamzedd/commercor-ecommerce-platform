import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CapturePayPalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  paypalOrderId: string;
}
