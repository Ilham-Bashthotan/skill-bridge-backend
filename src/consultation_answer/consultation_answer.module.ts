import { Module } from '@nestjs/common';
import { ConsultationAnswerController } from './consultation_answer.controller';
import { ConsultationAnswerService } from './consultation_answer.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ConsultationAnswerController],
  providers: [ConsultationAnswerService],
  exports: [ConsultationAnswerService],
})
export class ConsultationAnswerModule {}
