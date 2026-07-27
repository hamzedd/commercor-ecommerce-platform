import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerDto } from '@/src/libs/models/dtos/customers/Customer.dto';
import { CustomersService } from '../services/customers.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiBody({
    description: 'Data for creating a new cusotomer',
    type: CustomerDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  createCustomer(@Body() data: CustomerDto) {
    return this.customersService.createCustomer(data);
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getCustomers() {
    return this.customersService.getCustomers();
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customersService.getCustomer(id);
  }

  @ApiBody({
    description: 'Data for updating a customer by ID',
    type: CustomerDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id')
  updateCustomer(@Param('id') id: string, @Body() data: CustomerDto) {
    return this.customersService.updateCustomer({ id, data });
  }

  @ApiBody({
    description: 'Data for deleting a customer by ID',
    type: CustomerDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteCustomer(@Param('id') id: string) {
    return this.customersService.deleteCustomer(id);
  }
}
