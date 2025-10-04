import {
  IsOptional,
  IsString,
  IsInt,
  IsIn,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetForumQuestionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  student_id?: number;

  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'title', 'answers_count'])
  sort?: string = 'created_at';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: string = 'desc';
}

export class GetMyQuestionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['answered', 'unanswered'])
  status?: string;
}

export class SearchForumQuestionsDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  student_id?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  has_answers?: boolean;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
