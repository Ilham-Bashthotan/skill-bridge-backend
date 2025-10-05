import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateForumAnswerDto {
  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'Answer message must be at least 10 characters long',
  })
  message?: string;
}
