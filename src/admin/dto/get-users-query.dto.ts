import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';

export class GetUsersQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
