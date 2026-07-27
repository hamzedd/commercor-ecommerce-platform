import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@/src/modules/auth/services/auth.service';
import { LoginDto } from '@/src/libs/models/dtos/auth/Login.dto';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    description: 'Data for Sign In',
    type: LoginDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  SignIn(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiOperation({
    summary: 'Get Profile Data',
    description: 'Reads Bearer token in header to get user profile',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  GetProfile(@Request() req: any) {
    return req.user;
  }
}
