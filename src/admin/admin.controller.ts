import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { User } from '../common/user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

interface UserPayload {
  id: number;
  email: string;
  role: Role;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard() {
    const data = await this.adminService.getDashboard();
    return {
      statusCode: HttpStatus.OK,
      message: 'Dashboard data retrieved successfully',
      data,
    };
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@User() user: UserPayload) {
    const data = await this.adminService.getProfile(user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data,
    };
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @User() user: UserPayload,
    @Body() dto: UpdateAdminProfileDto,
  ) {
    const data = await this.adminService.updateProfile(user.id, dto);
    return {
      statusCode: HttpStatus.OK,
      ...data,
    };
  }

  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() query: GetUsersQueryDto) {
    const data = await this.adminService.getUsers(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data,
    };
  }

  @Post('admins')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() dto: CreateAdminDto) {
    const data = await this.adminService.createAdmin(dto);
    return {
      statusCode: HttpStatus.CREATED,
      ...data,
    };
  }

  @Post('mentors')
  @HttpCode(HttpStatus.CREATED)
  async createMentor(@Body() dto: CreateMentorDto) {
    const data = await this.adminService.createMentor(dto);
    return {
      statusCode: HttpStatus.CREATED,
      ...data,
    };
  }

  @Put('users/:id/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid user ID',
      };
    }

    const data = await this.adminService.updateUserRole(userId, dto);
    return {
      statusCode: HttpStatus.OK,
      ...data,
    };
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid user ID',
      };
    }

    const data = await this.adminService.deleteUser(userId);
    return {
      statusCode: HttpStatus.OK,
      ...data,
    };
  }
}
