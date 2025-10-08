import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  description: string;
}
