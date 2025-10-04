import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { Auth } from '../common/auth.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import type { User } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.userService.register(registerUserDto);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a simple token (you should use JWT in production)
    const token = `token_${user.id}_${Date.now()}`;

    // Update user's token in database
    await this.userService.updateToken(user.id, token);

    // Add token to user object for response
    const userWithToken = { ...user, token };

    return {
      token,
      user: userWithToken,
    };
  }

  @Get('users/profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Auth() user: User) {
    return await this.userService.getProfile(user.id);
  }

  @Put('users/profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Auth() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.userService.updateProfile(
      user.id,
      updateProfileDto,
    );
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  @Put('users/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Auth() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(user.id, changePasswordDto);
  }

  @Delete('users/account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @Auth() user: User,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return await this.userService.deleteAccount(user.id, deleteAccountDto);
  }
}
