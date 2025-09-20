import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateMentorStatusDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  experience?: string;
}
