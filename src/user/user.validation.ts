import { z, ZodType } from 'zod';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

export class UserValidation {
  static readonly REGISTER: ZodType<RegisterUserDto> = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().min(1).max(255),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6).max(100),
  });

  static readonly LOGIN: ZodType<LoginUserDto> = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE_PROFILE: ZodType<UpdateProfileDto> = z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(10).max(15).optional(),
    bio: z.string().max(500).optional(),
    experience: z.string().max(1000).optional(),
  });

  static readonly CHANGE_PASSWORD: ZodType<ChangePasswordDto> = z.object({
    current_password: z.string().min(1).max(100),
    new_password: z.string().min(6).max(100),
  });

  static readonly DELETE_ACCOUNT: ZodType<DeleteAccountDto> = z.object({
    password: z.string().min(1).max(100),
  });
}
