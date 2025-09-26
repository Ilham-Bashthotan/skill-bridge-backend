import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    MentorModule,
    StudentModule,
    AdminModule,
  ],
})
export class AppModule {}
