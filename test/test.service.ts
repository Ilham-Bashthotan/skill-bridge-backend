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

  async createConsultationAnswer(mentorId: number, questionId: number) {
    return this.prismaService.consultationAnswer.create({
      data: {
        mentorId,
        consultationsQuestionId: questionId,
        message: 'Test consultation answer',
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

  async createForumAnswer(userId: number, questionId: number) {
    return this.prismaService.forumAnswer.create({
      data: {
        userId,
        questionId,
        message: 'Test forum answer',
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

  // Helper methods for creating mock data in tests
  static createMockUser(overrides = {}) {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMockStudent(overrides = {}) {
    return TestService.createMockUser({
      role: 'student',
      name: 'Test Student',
      email: 'student@example.com',
      ...overrides,
    });
  }

  static createMockAdmin(overrides = {}) {
    return TestService.createMockUser({
      role: 'admin',
      name: 'Test Admin',
      email: 'admin@example.com',
      bio: 'System administrator',
      experience: '10 years',
      ...overrides,
    });
  }

  static createMockMentor(overrides = {}) {
    return TestService.createMockUser({
      role: 'mentor',
      name: 'Test Mentor',
      email: 'mentor@example.com',
      bio: 'Experienced programming mentor',
      experience: '5 years',
      ...overrides,
    });
  }

  static createMockForumQuestion(overrides = {}) {
    return {
      id: 1,
      studentId: 1,
      title: 'Test Question',
      message: 'Test message',
      createdAt: new Date(),
      updatedAt: new Date(),
      student: TestService.createMockStudent(),
      answers: [],
      _count: { answers: 0 },
      ...overrides,
    };
  }

  static createMockForumQuestions(count = 3) {
    return Array.from({ length: count }, (_, index) =>
      TestService.createMockForumQuestion({
        id: index + 1,
        title: `Test Question ${index + 1}`,
        message: `Test message ${index + 1}`,
      }),
    );
  }

  static createMockPaginationResult(
    data: any[],
    page = 1,
    limit = 10,
    total?: number,
  ) {
    return {
      data,
      pagination: {
        page,
        limit,
        total: total || data.length,
        totalPages: Math.ceil((total || data.length) / limit),
      },
    };
  }

  static createMockSearchResult(data: any[], query = 'test', total?: number) {
    return {
      questions: data,
      search_metadata: {
        query,
        total_results: total || data.length,
        search_time: '0.05s',
      },
      pagination: {
        page: 1,
        limit: 10,
        total: total || data.length,
        totalPages: Math.ceil((total || data.length) / 10),
      },
    };
  }

  static createMockStatistics(overrides = {}) {
    return {
      total_questions: 100,
      answered_questions: 60,
      unanswered_questions: 40,
      questions_this_month: 20,
      questions_this_year: 80,
      most_active_students: [
        {
          student_id: 1,
          student_name: 'Active Student',
          question_count: 5,
        },
      ],
      average_answers_per_question: 1.5,
      ...overrides,
    };
  }

  // Common DTO objects for testing
  static createValidCreateQuestionDto(overrides = {}) {
    return {
      title: 'New Question',
      message: 'New question message',
      ...overrides,
    };
  }

  static createValidUpdateQuestionDto(overrides = {}) {
    return {
      title: 'Updated Title',
      message: 'Updated message',
      ...overrides,
    };
  }

  static createValidSearchQueryDto(overrides = {}) {
    return {
      q: 'test',
      page: 1,
      limit: 10,
      ...overrides,
    };
  }

  // Consultation Answer test helpers
  static createMockConsultationAnswer(overrides = {}) {
    return {
      id: 1,
      consultationsQuestionId: 1,
      mentorId: 1,
      message: 'Test consultation answer',
      createdAt: new Date(),
      updatedAt: new Date(),
      mentor: TestService.createMockMentor(),
      question: {
        id: 1,
        title: 'Test Question',
        message: 'Test question message',
        studentId: 1,
        student: TestService.createMockStudent(),
      },
      ...overrides,
    };
  }

  static createMockConsultationAnswers(count = 3) {
    return Array.from({ length: count }, (_, index) =>
      TestService.createMockConsultationAnswer({
        id: index + 1,
        message: `Test consultation answer ${index + 1}`,
        consultationsQuestionId: index + 1,
      }),
    );
  }

  static createValidCreateAnswerDto(overrides = {}) {
    return {
      consultations_question_id: 1,
      message: 'New consultation answer',
      ...overrides,
    };
  }

  static createValidUpdateAnswerDto(overrides = {}) {
    return {
      message: 'Updated consultation answer',
      ...overrides,
    };
  }

  static createValidGetAnswersQueryDto(overrides = {}) {
    return {
      page: 1,
      limit: 10,
      sort: 'created_at',
      order: 'desc',
      ...overrides,
    };
  }

  static createValidSearchAnswersDto(overrides = {}) {
    return {
      q: 'test',
      page: 1,
      limit: 10,
      ...overrides,
    };
  }

  static createMockAnswerStatistics(overrides = {}) {
    return {
      total_answers: 50,
      answers_this_month: 10,
      answers_this_year: 35,
      ...overrides,
    };
  }

  // Mock service responses
  static createMockServiceResponse(
    data: Record<string, any>,
    message = 'Success',
  ) {
    return {
      message,
      ...data,
    };
  }
}
