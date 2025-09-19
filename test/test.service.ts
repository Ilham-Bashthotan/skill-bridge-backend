import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
  }

  async createUser() {
    const hashedPassword = await bcrypt.hash('test123', 10);
    return this.prismaService.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'student',
      },
    });
  }

  async getUser() {
    return this.prismaService.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });
  }

  async cleanDatabase() {
    // Clean all test data
    await this.deleteUser();
  }
}
