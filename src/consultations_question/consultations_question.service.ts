import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { ConsultationQuestionValidation } from './consultations_question.validation';
import { CreateConsultationQuestionDto } from './dto/create-consultation-question.dto';
import { UpdateConsultationQuestionDto } from './dto/update-consultation-question.dto';
import { GetConsultationQuestionsQueryDto } from './dto/get-consultation-questions-query.dto';
import type { ConsultationQuestionResponseModel } from '../model/consultation-question-response.model';

@Injectable()
export class ConsultationsQuestionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getAllQuestions(
    query: GetConsultationQuestionsQueryDto,
    userRole: string,
    userId?: number,
  ) {
    const validatedQuery = this.validationService.validate(
      ConsultationQuestionValidation.GET_QUERY,
      query,
    );

    const { student_id, page, limit, sort, order } = validatedQuery;

    // Build where clause based on role and filters
    const whereClause: {
      studentId?: number;
    } = {};

    // If regular user (student), only show their own questions
    if (userRole === 'student') {
      whereClause.studentId = userId;
    } else if (student_id) {
      // Admin/mentor can filter by student_id
      whereClause.studentId = student_id;
    }

    // Get total count
    const total = await this.prismaService.consultationQuestion.count({
      where: whereClause,
    });

    // Get questions
    const questions = await this.prismaService.consultationQuestion.findMany({
      where: whereClause,
      select: {
        id: true,
        studentId: true,
        title: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        [sort === 'created_at' ? 'createdAt' : sort]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform response
    const transformedQuestions: ConsultationQuestionResponseModel[] =
      questions.map((question) => ({
        id: question.id,
        student_id: question.studentId,
        title: question.title,
        message: question.message,
        student: question.student,
        answers_count: question.answers.length,
        created_at: question.createdAt,
        updated_at: question.updatedAt,
      }));

    return {
      questions: transformedQuestions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getQuestionById(
    questionId: number,
    userRole: string,
    userId?: number,
  ): Promise<ConsultationQuestionResponseModel> {
    const question = await this.prismaService.consultationQuestion.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        studentId: true,
        title: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          select: {
            id: true,
            mentorId: true,
            message: true,
            createdAt: true,
            mentor: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Consultation question not found');
    }

    // Check authorization - students can only see their own questions
    if (userRole === 'student' && question.studentId !== userId) {
      throw new ForbiddenException(
        'You can only view your own consultation questions',
      );
    }

    return {
      id: question.id,
      student_id: question.studentId,
      title: question.title,
      message: question.message,
      student: question.student,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        mentor_id: answer.mentorId,
        message: answer.message,
        user: answer.mentor,
        created_at: answer.createdAt,
      })),
      answers_count: question.answers.length,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    };
  }

  async createQuestion(
    studentId: number,
    createQuestionDto: CreateConsultationQuestionDto,
  ) {
    const validatedData = this.validationService.validate(
      ConsultationQuestionValidation.CREATE,
      createQuestionDto,
    );

    const question = await this.prismaService.consultationQuestion.create({
      data: {
        studentId,
        title: validatedData.title,
        message: validatedData.message,
      },
      select: {
        id: true,
        studentId: true,
        title: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Consultation question created successfully',
      question: {
        id: question.id,
        student_id: question.studentId,
        title: question.title,
        message: question.message,
        created_at: question.createdAt,
        updated_at: question.updatedAt,
      },
    };
  }

  async updateQuestion(
    userId: number,
    questionId: number,
    updateQuestionDto: UpdateConsultationQuestionDto,
    userRole: string,
  ) {
    const validatedData = this.validationService.validate(
      ConsultationQuestionValidation.UPDATE,
      updateQuestionDto,
    );

    // Check if question exists
    const existingQuestion =
      await this.prismaService.consultationQuestion.findUnique({
        where: { id: questionId },
      });

    if (!existingQuestion) {
      throw new NotFoundException('Consultation question not found');
    }

    // Check authorization - only the student who created it can update
    if (userRole === 'student' && existingQuestion.studentId !== userId) {
      throw new ForbiddenException(
        'You can only update your own consultation questions',
      );
    }

    const updatedQuestion =
      await this.prismaService.consultationQuestion.update({
        where: { id: questionId },
        data: {
          title: validatedData.title,
          message: validatedData.message,
        },
        select: {
          id: true,
          studentId: true,
          title: true,
          message: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return {
      message: 'Consultation question updated successfully',
      question: {
        id: updatedQuestion.id,
        student_id: updatedQuestion.studentId,
        title: updatedQuestion.title,
        message: updatedQuestion.message,
        created_at: updatedQuestion.createdAt,
        updated_at: updatedQuestion.updatedAt,
      },
    };
  }

  async deleteQuestion(userId: number, questionId: number, userRole: string) {
    // Check if question exists
    const existingQuestion =
      await this.prismaService.consultationQuestion.findUnique({
        where: { id: questionId },
      });

    if (!existingQuestion) {
      throw new NotFoundException('Consultation question not found');
    }

    // Check authorization - student can delete their own, admin can delete any
    if (userRole === 'student' && existingQuestion.studentId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own consultation questions',
      );
    }

    await this.prismaService.consultationQuestion.delete({
      where: { id: questionId },
    });

    return {
      message: 'Consultation question deleted successfully',
    };
  }

  async getMyQuestions(
    studentId: number,
    query: { page?: number; limit?: number },
  ) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    // Get total count
    const total = await this.prismaService.consultationQuestion.count({
      where: { studentId },
    });

    // Get questions with latest answer info
    const questions = await this.prismaService.consultationQuestion.findMany({
      where: { studentId },
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        answers: {
          select: {
            id: true,
            createdAt: true,
            mentor: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform response
    const transformedQuestions = questions.map((question) => ({
      id: question.id,
      title: question.title,
      message: question.message,
      answers_count: question.answers.length,
      latest_answer: question.answers[0]
        ? {
            created_at: question.answers[0].createdAt,
            user: {
              name: question.answers[0].mentor.name,
            },
          }
        : undefined,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    }));

    return {
      questions: transformedQuestions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getUnansweredQuestions(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    // Get total count of unanswered questions
    const total = await this.prismaService.consultationQuestion.count({
      where: {
        answers: {
          none: {},
        },
      },
    });

    // Get unanswered questions
    const questions = await this.prismaService.consultationQuestion.findMany({
      where: {
        answers: {
          none: {},
        },
      },
      select: {
        id: true,
        studentId: true,
        title: true,
        message: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        answers: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform response
    const transformedQuestions = questions.map((question) => ({
      id: question.id,
      student: {
        id: question.student.id,
        name: question.student.name,
      },
      title: question.title,
      message: question.message,
      answers_count: question.answers.length,
      created_at: question.createdAt,
    }));

    return {
      questions: transformedQuestions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getStatistics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalQuestions, questionsThisMonth, questionsThisYear] =
      await Promise.all([
        this.prismaService.consultationQuestion.count(),
        this.prismaService.consultationQuestion.count({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
        }),
        this.prismaService.consultationQuestion.count({
          where: {
            createdAt: {
              gte: startOfYear,
            },
          },
        }),
      ]);

    return {
      total_questions: totalQuestions,
      questions_this_month: questionsThisMonth,
      questions_this_year: questionsThisYear,
    };
  }
}
