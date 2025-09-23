import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [CommonModule, UserModule, MentorModule, StudentModule],
})
export class AppModule {}
