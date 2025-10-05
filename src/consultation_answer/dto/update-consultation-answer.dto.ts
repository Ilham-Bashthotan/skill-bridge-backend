import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateConsultationAnswerDto {
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  message?: string;
}
