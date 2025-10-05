import { Module } from '@nestjs/common';
import { ConsultationsQuestionService } from './consultations_question.service';
import { ConsultationsQuestionController } from './consultations_question.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ConsultationsQuestionController],
  providers: [ConsultationsQuestionService],
})
export class ConsultationsQuestionModule {}
