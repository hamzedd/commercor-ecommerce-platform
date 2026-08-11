import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerDto } from '@/src/libs/models/dtos/customers/Customer.dto';
import { CustomersService } from '../services/customers.service';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { EditCustomerProfileDto } from '@/src/libs/models/dtos/customers/EditCustomerProfile.dto';
import { type GuardedApiResponse } from '@/src/utils/types/api.type';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiBody({
    description: 'Data for creating a new cusotomer',
    type: CustomerDto,
  })
  @Post()
  registerCustomer(@Body() data: CustomerDto) {
    return this.customersService.registerCustomer(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({
    description: 'Data for editing an existing customer',
    type: EditCustomerProfileDto,
  })
  @Put()
  EditCustomer(
    @Req() req: GuardedApiResponse,
    @Body() data: EditCustomerProfileDto,
  ) {
    if (!req?.user) {
      throw new Error('User not found in request');
    }
    return this.customersService.editCustomer({
      customer: req?.user,
      data,
    });
  }
}
