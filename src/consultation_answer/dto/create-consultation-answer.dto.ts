import { IsNotEmpty, IsString, IsNumber, MinLength } from 'class-validator';

export class CreateConsultationAnswerDto {
  @IsNotEmpty()
  @IsNumber()
  consultations_question_id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  message: string;
}
