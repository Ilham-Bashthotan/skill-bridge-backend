import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(5000)
  description?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  company?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(2000)
  requirements?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  location?: string;
}
