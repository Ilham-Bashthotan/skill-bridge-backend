import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, MaxLength } from 'class-validator';

export class GetCoursesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  @MaxLength(100, { message: 'Search cannot exceed 100 characters' })
  search?: string;
}
