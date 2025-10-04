import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateForumQuestionDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(2000)
  message?: string;
}
