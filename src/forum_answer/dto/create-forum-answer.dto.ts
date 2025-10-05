import { IsNotEmpty, IsString, IsInt, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateForumAnswerDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  question_id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message: 'Answer message must be at least 10 characters long',
  })
  message: string;
}
