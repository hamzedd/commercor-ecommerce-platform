import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '@/src/libs/models/dtos/auth/Login.dto';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { AuthService } from '../services/auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '@/src/libs/models/dtos/auth/PasswordReset.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login customer and get JWT token' })
  @ApiBody({
    description: 'Customer login credentials',
    type: LoginDto,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @HttpCode(HttpStatus.OK) @Post('forgot-password') forgot(
    @Body() data: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(data.email);
  }
  @HttpCode(HttpStatus.OK) @Post('reset-password') reset(
    @Body() data: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(data.token, data.password);
  }

  @ApiOperation({
    summary: 'Get Profile Data',
    description: 'Reads Bearer token in header to get user profile',
  })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(AuthGuard)
  GetProfile(@Request() req: any) {
    return req.user;
  }
}
