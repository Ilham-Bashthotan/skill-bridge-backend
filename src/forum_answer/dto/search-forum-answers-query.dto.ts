import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchForumAnswersQueryDto {
  @IsNotEmpty()
  @IsString()
  q: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  question_id?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  user_id?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  limit?: number = 10;
}
