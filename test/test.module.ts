import { Module } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { TestService } from './test.service';

@Module({
  providers: [TestService, PrismaService],
  exports: [TestService],
})
export class TestModule {}
