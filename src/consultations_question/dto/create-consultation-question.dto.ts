import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateConsultationQuestionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'Title must not exceed 150 characters',
  })
  @MinLength(5, {
    message: 'Title must be at least 5 characters long',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20, {
    message: 'Message must be at least 20 characters long',
  })
  @MaxLength(5000, {
    message: 'Message must not exceed 5000 characters',
  })
  message: string;
}
