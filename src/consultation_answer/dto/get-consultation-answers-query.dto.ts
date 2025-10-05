import {
  IsOptional,
  IsNumber,
  IsString,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetConsultationAnswersQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  consultations_question_id?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  mentor_id?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : 1))
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : 10))
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['created_at'])
  sort?: string = 'created_at';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: string = 'desc';
}
