import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobValidation } from './job.validation';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [JobService, JobValidation],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
