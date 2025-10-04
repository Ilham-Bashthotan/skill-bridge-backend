import { Module } from '@nestjs/common';
import { ForumQuestionController } from './forum_question.controller';
import { ForumQuestionService } from './forum_question.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ForumQuestionController],
  providers: [ForumQuestionService],
  exports: [ForumQuestionService],
})
export class ForumQuestionModule {}
