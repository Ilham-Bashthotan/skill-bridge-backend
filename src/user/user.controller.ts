import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

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

  @Get('users/profile/:id')
  async getProfile(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return await this.userService.getProfile(userId);
  }

  @Put('users/profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = parseInt(id, 10);
    const user = await this.userService.updateProfile(userId, updateProfileDto);
    return {
      message: 'Profile updated successfully',
      user,
    };
  }

  @Put('users/change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = parseInt(id, 10);
    return await this.userService.changePassword(userId, changePasswordDto);
  }

  @Delete('users/account/:id')
  async deleteAccount(
    @Param('id') id: string,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    const userId = parseInt(id, 10);
    return await this.userService.deleteAccount(userId, deleteAccountDto);
  }
}
