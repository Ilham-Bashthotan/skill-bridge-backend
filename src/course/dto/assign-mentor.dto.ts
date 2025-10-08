import { IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignMentorDto {
  @IsNotEmpty({ message: 'Mentor ID is required' })
  @Type(() => Number)
  @IsInt({ message: 'Mentor ID must be a number' })
  @Min(1, { message: 'Mentor ID must be at least 1' })
  mentor_id: number;
}
