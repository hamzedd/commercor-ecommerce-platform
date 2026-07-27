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
import { UsersService } from '@/src/modules/users/services/users.service';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { CreateUserDto } from '@/src/libs/models/dtos/users/CreateUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  CreateUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  GetUsers() {
    return this.usersService.getUsers();
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  GetUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  DeleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @ApiBearerAuth()
  @Role(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id')
  EditUser(@Param('id') id: string, @Body() data: CreateUserDto) {
    return this.usersService.editUser(id, data);
  }
}
