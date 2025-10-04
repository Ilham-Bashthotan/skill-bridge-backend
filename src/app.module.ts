import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { JobModule } from './job/job.module';
import { ForumQuestionModule } from './forum_question/forum_question.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    MentorModule,
    StudentModule,
    AdminModule,
    JobModule,
    ForumQuestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
