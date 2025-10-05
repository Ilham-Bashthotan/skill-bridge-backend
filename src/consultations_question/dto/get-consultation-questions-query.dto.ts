import { IsOptional, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetConsultationQuestionsQueryDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  student_id?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value as string))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = 'created_at';

  @IsOptional()
  @IsString()
  order?: string = 'desc';
}
