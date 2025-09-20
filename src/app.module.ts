import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { MentorModule } from './mentor/mentor.module';

@Module({
  imports: [CommonModule, UserModule, MentorModule],
})
export class AppModule {}
