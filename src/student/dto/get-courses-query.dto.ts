import { IsOptional, IsInt, Min, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCoursesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
