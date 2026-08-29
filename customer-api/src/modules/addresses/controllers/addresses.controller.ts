import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressesService } from '../services/addresses.service';
import { AddressDto } from '@/src/libs/models/dtos/customers/Address.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import type { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
}

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: AddressDto })
  @Post()
  createAddress(@Req() request: AuthRequest, @Body() dto: AddressDto) {
    return this.addressService.createAddress(request.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAllAddresses(@Req() request: AuthRequest) {
    return this.addressService.findAllAddresses(request.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('detail/:id')
  findOneAddress(@Req() request: AuthRequest, @Param('id') id: string) {
    return this.addressService.findOneAddress(id, request.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: AddressDto })
  @Put(':id')
  updateAddress(
    @Req() request: AuthRequest,
    @Param('id') id: string,
    @Body() dto: Partial<AddressDto>,
  ) {
    return this.addressService.updateAddress(id, request.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  removeAddress(@Req() request: AuthRequest, @Param('id') id: string) {
    return this.addressService.removeAddress(id, request.user.id);
  }
}
