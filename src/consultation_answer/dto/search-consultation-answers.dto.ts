import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchConsultationAnswersDto {
  @IsString()
  q: string;

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
}
