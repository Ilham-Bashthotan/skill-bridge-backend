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

  async deleteMentor() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'mentor@example.com',
      },
    });
  }

  async createMentor(suffix = '') {
    let email = 'mentor@example.com';
    if (suffix) {
      email = `mentor${suffix}@example.com`;
    }
    const hashedPassword = await bcrypt.hash('mentor123', 10);
    return this.prismaService.user.create({
      data: {
        name: 'Test Mentor',
        email,
        password: hashedPassword,
        role: 'mentor',
        bio: 'Experienced programming mentor',
        experience: '5 years',
      },
    });
  }

  async getMentor() {
    return this.prismaService.user.findUnique({
      where: {
        email: 'mentor@example.com',
      },
    });
  }

  async createCourse() {
    return this.prismaService.course.create({
      data: {
        title: 'Test Course',
        description: 'Test course description',
      },
    });
  }

  async assignMentorToCourse(mentorId: number, courseId: number) {
    return this.prismaService.courseMentor.create({
      data: {
        mentorId,
        courseId,
      },
    });
  }

  async createCourseMaterial(courseId: number) {
    return this.prismaService.courseMaterial.create({
      data: {
        courseId,
        title: 'Test Material',
        content: 'Test material content',
      },
    });
  }

  async createStudent(suffix = '') {
    let email = 'student@example.com';
    if (suffix) {
      email = `student${suffix}@example.com`;
    }
    const hashedPassword = await bcrypt.hash('student123', 10);
    return this.prismaService.user.create({
      data: {
        name: 'Test Student',
        email,
        password: hashedPassword,
        role: 'student',
      },
    });
  }

  async createCourseProgress(studentId: number, courseMaterialId: number) {
    return this.prismaService.courseProgress.create({
      data: {
        studentId,
        courseMaterialId,
        completed: false,
      },
    });
  }

  async createCertificate(studentId: number, courseId: number) {
    return this.prismaService.certificate.create({
      data: {
        studentId,
        courseId,
        certificateUrl: 'https://example.com/cert.pdf',
      },
    });
  }

  async createConsultationQuestion(studentId: number) {
    return this.prismaService.consultationQuestion.create({
      data: {
        studentId,
        title: 'Test Consultation',
        message: 'Test consultation message',
      },
    });
  }

  async createForumQuestion(studentId: number) {
    return this.prismaService.forumQuestion.create({
      data: {
        studentId,
        title: 'Test Forum Question',
        message: 'Test forum question message',
      },
    });
  }

  async createAdmin(suffix = '') {
    let email = 'admin@example.com';
    let name = 'Test Admin';
    if (suffix) {
      email = `admin${suffix}@example.com`;
      name = `Test Admin ${suffix}`;
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        bio: 'System administrator',
        experience: '10 years',
      },
    });
  }

  async getAdmin() {
    return this.prismaService.user.findUnique({
      where: {
        email: 'admin@example.com',
      },
    });
  }

  async deleteAdmin() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'admin@example.com',
      },
    });
  }

  async createJob(adminId: number, suffix = '') {
    return this.prismaService.job.create({
      data: {
        adminId,
        title: `Test Job${suffix ? ` ${suffix}` : ''}`,
        description: `Test job description${suffix ? ` ${suffix}` : ''}`,
        company: `Test Company${suffix ? ` ${suffix}` : ''}`,
        requirements: `Test requirements${suffix ? ` ${suffix}` : ''}`,
        location: `Test Location${suffix ? ` ${suffix}` : ''}`,
      },
    });
  }

  async getJob(adminId: number) {
    return this.prismaService.job.findFirst({
      where: {
        adminId,
        title: 'Test Job',
      },
    });
  }

  async deleteJob(adminId: number) {
    await this.prismaService.job.deleteMany({
      where: {
        adminId,
      },
    });
  }

  async cleanDatabase() {
    try {
      // Clean all test data in correct order to avoid foreign key constraints
      await this.prismaService.consultationAnswer.deleteMany({});
      await this.prismaService.consultationQuestion.deleteMany({});
      await this.prismaService.forumAnswer.deleteMany({});
      await this.prismaService.forumQuestion.deleteMany({});
      await this.prismaService.certificate.deleteMany({});
      await this.prismaService.courseProgress.deleteMany({});
      await this.prismaService.courseMaterial.deleteMany({});
      await this.prismaService.courseMentor.deleteMany({});
      await this.prismaService.course.deleteMany({});
      await this.prismaService.job.deleteMany({});

      // Clean up all test users including those with suffixes
      await this.prismaService.user.deleteMany({
        where: {
          OR: [
            { email: 'mentor@example.com' },
            { email: 'test@example.com' },
            { email: 'student@example.com' },
            { email: 'admin@example.com' },
            { email: { contains: 'mentor' } },
            { email: { contains: 'student' } },
            { email: { contains: 'admin' } },
          ],
        },
      });
    } catch (error) {
      // If cleanup fails, log and continue
      console.warn(
        'Database cleanup failed:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
