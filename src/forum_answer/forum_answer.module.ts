import { Module } from '@nestjs/common';
import { ForumAnswerController } from './forum_answer.controller';
import { ForumAnswerService } from './forum_answer.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ForumAnswerController],
  providers: [ForumAnswerService],
  exports: [ForumAnswerService],
})
export class ForumAnswerModule {}
