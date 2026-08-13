import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query, Req,
} from '@nestjs/common';
import { CustomerDto } from '@/src/libs/models/dtos/customers/Customer.dto';
import { CustomersService } from '../services/customers.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import {CustomerCrmService}from'../services/customer-crm.service';import{NoteDto,TagDto,UpdateCrmDto}from'../crm.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService,private readonly crm:CustomerCrmService) {}

  @ApiBody({
    description: 'Data for creating a new cusotomer',
    type: CustomerDto,
  })
  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  createCustomer(@Body() data: CustomerDto) {
    return this.customersService.createCustomer(data);
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getCustomers(@Query()query:any) {
    return this.crm.list(query);
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.crm.detail(id);
  }

  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Put(':id/crm')updateCrm(@Param('id')id:string,@Body()d:UpdateCrmDto){return this.crm.updateCrm(id,d.status)}
  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Get(':id/timeline')timeline(@Param('id')id:string){return this.crm.timeline(id)}
  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Post(':id/tags/:tagId')assignTag(@Param('id')id:string,@Param('tagId')tagId:string){return this.crm.assignTag(id,tagId)}
  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Delete(':id/tags/:tagId')removeTag(@Param('id')id:string,@Param('tagId')tagId:string){return this.crm.removeTag(id,tagId)}
  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Get(':id/notes')notes(@Param('id')id:string){return this.crm.notes(id)}
  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Post(':id/notes')createNote(@Param('id')id:string,@Req()r:any,@Body()d:NoteDto){return this.crm.createNote(id,r.user.id,d.note)}
  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Put(':id/notes/:noteId')updateNote(@Param('id')id:string,@Param('noteId')noteId:string,@Body()d:NoteDto){return this.crm.updateNote(id,noteId,d.note)}
  @ApiBearerAuth()@Role(UserRoleEnum.ADMIN)@UseGuards(AuthGuard,RoleGuard)@Delete(':id/notes/:noteId')deleteNote(@Param('id')id:string,@Param('noteId')noteId:string){return this.crm.deleteNote(id,noteId)}

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
