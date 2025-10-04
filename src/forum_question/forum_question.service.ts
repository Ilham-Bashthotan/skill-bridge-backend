import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { CreateForumQuestionDto } from './dto/create-forum-question.dto';
import { UpdateForumQuestionDto } from './dto/update-forum-question.dto';
import {
  GetForumQuestionsQueryDto,
  GetMyQuestionsQueryDto,
  SearchForumQuestionsDto,
} from './dto/get-forum-questions-query.dto';
import {
  GetForumQuestionsResponse,
  CreateForumQuestionResponse,
  UpdateForumQuestionResponse,
  DeleteForumQuestionResponse,
  SearchForumQuestionsResponse,
  ForumQuestionStatisticsResponse,
} from '../model/forum-question-response.model';
import { Role, Prisma } from '@prisma/client';
import { ForumQuestionValidation } from './forum_question.validation';

@Injectable()
export class ForumQuestionService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getAllQuestions(
    query: GetForumQuestionsQueryDto,
  ): Promise<GetForumQuestionsResponse> {
    const {
      page = 1,
      limit = 10,
      search,
      student_id,
      sort = 'created_at',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ForumQuestionWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (student_id) {
      where.studentId = student_id;
    }

    const orderBy: Prisma.ForumQuestionOrderByWithRelationInput = {};
    if (sort === 'answers_count') {
      orderBy.answers = { _count: order as Prisma.SortOrder };
    } else if (sort === 'created_at') {
      orderBy.createdAt = order as Prisma.SortOrder;
    } else {
      orderBy[sort as keyof Prisma.ForumQuestionOrderByWithRelationInput] =
        order as Prisma.SortOrder;
    }

    const [questions, total] = await Promise.all([
      this.prisma.forumQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
          answers: {
            select: {
              id: true,
              createdAt: true,
              user: {
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
          _count: {
            select: {
              answers: true,
            },
          },
        },
      }),
      this.prisma.forumQuestion.count({ where }),
    ]);

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      student_id: question.studentId,
      title: question.title,
      message: question.message,
      student: question.student,
      answers_count: question._count.answers,
      latest_answer: question.answers[0]
        ? {
            id: question.answers[0].id,
            created_at: question.answers[0].createdAt,
            user: question.answers[0].user,
          }
        : undefined,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    }));

    return {
      questions: formattedQuestions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getQuestionById(questionId: number) {
    const question = await this.prisma.forumQuestion.findUnique({
      where: { id: questionId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            user: {
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
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return {
      id: question.id,
      student_id: question.studentId,
      title: question.title,
      message: question.message,
      student: question.student,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        user_id: answer.userId,
        message: answer.message,
        user: {
          id: answer.user.id,
          name: answer.user.name,
          role: answer.user.role,
        },
        created_at: answer.createdAt,
      })),
      answers_count: question._count.answers,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    };
  }

  async createQuestion(
    studentId: number,
    data: CreateForumQuestionDto,
  ): Promise<CreateForumQuestionResponse> {
    // Validate input data with Zod schema
    const validatedData = this.validationService.validate(
      ForumQuestionValidation.CREATE,
      data,
    );

    // Verify user is a student
    const user = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        role: Role.student,
      },
    });

    if (!user) {
      throw new ForbiddenException('Only students can create forum questions');
    }

    const question = await this.prisma.forumQuestion.create({
      data: {
        studentId: studentId,
        title: validatedData.title,
        message: validatedData.message,
      },
    });

    return {
      message: 'Question created successfully',
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
    data: UpdateForumQuestionDto,
  ): Promise<UpdateForumQuestionResponse> {
    // Validate input data with Zod schema
    const validatedData = this.validationService.validate(
      ForumQuestionValidation.UPDATE,
      data,
    );

    const question = await this.prisma.forumQuestion.findFirst({
      where: {
        id: questionId,
        studentId: userId,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found or unauthorized');
    }

    const updatedQuestion = await this.prisma.forumQuestion.update({
      where: { id: questionId },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.message && { message: validatedData.message }),
      },
    });

    return {
      message: 'Question updated successfully',
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

  async deleteQuestion(
    userId: number,
    questionId: number,
    userRole: Role,
  ): Promise<DeleteForumQuestionResponse> {
    const whereCondition: Prisma.ForumQuestionWhereInput = { id: questionId };

    // Students can only delete their own questions, admins can delete any
    if (userRole !== Role.admin) {
      whereCondition.studentId = userId;
    }

    const question = await this.prisma.forumQuestion.findFirst({
      where: whereCondition,
    });

    if (!question) {
      throw new NotFoundException('Question not found or unauthorized');
    }

    await this.prisma.forumQuestion.delete({
      where: { id: questionId },
    });

    return {
      message: 'Question deleted successfully',
    };
  }

  async getMyQuestions(
    studentId: number,
    query: GetMyQuestionsQueryDto,
  ): Promise<GetForumQuestionsResponse> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ForumQuestionWhereInput = { studentId: studentId };

    if (status === 'answered') {
      where.answers = {
        some: {},
      };
    } else if (status === 'unanswered') {
      where.answers = {
        none: {},
      };
    }

    const [questions, total] = await Promise.all([
      this.prisma.forumQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          answers: {
            select: {
              id: true,
              createdAt: true,
              user: {
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
          _count: {
            select: {
              answers: true,
            },
          },
        },
      }),
      this.prisma.forumQuestion.count({ where }),
    ]);

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      student_id: question.studentId,
      title: question.title,
      message: question.message,
      student: {
        id: studentId,
        name: '', // Will be filled from user context
      },
      answers_count: question._count.answers,
      latest_answer: question.answers[0]
        ? {
            id: question.answers[0].id,
            created_at: question.answers[0].createdAt,
            user: question.answers[0].user,
          }
        : undefined,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    }));

    return {
      questions: formattedQuestions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async searchQuestions(
    query: SearchForumQuestionsDto,
  ): Promise<SearchForumQuestionsResponse> {
    const {
      q,
      student_id,
      has_answers,
      date_from,
      date_to,
      page = 1,
      limit = 10,
    } = query;
    const skip = (page - 1) * limit;

    if (
      !q &&
      !student_id &&
      has_answers === undefined &&
      !date_from &&
      !date_to
    ) {
      throw new BadRequestException('Search query is required');
    }

    const startTime = Date.now();
    const where: Prisma.ForumQuestionWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (student_id) {
      where.studentId = student_id;
    }

    if (has_answers === true) {
      where.answers = { some: {} };
    } else if (has_answers === false) {
      where.answers = { none: {} };
    }

    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) where.createdAt.gte = new Date(date_from);
      if (date_to) where.createdAt.lte = new Date(date_to);
    }

    const [questions, total] = await Promise.all([
      this.prisma.forumQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              answers: true,
            },
          },
        },
      }),
      this.prisma.forumQuestion.count({ where }),
    ]);

    const searchTime = Date.now() - startTime;

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      student_id: question.studentId,
      title: question.title,
      message: question.message,
      student: question.student,
      answers_count: question._count.answers,
      relevance_score: 0.92, // Mock relevance score
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    }));

    return {
      questions: formattedQuestions,
      search_metadata: {
        query: q || '',
        total_results: total,
        search_time_ms: searchTime,
      },
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getUnansweredQuestions(
    query: GetForumQuestionsQueryDto,
  ): Promise<GetForumQuestionsResponse> {
    const { page = 1, limit = 10, sort = 'created_at', order = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where = {
      answers: {
        none: {},
      },
    };

    const orderBy: Prisma.ForumQuestionOrderByWithRelationInput = {};
    if (sort === 'created_at') {
      orderBy.createdAt = order as Prisma.SortOrder;
    } else {
      orderBy[sort as keyof Prisma.ForumQuestionOrderByWithRelationInput] =
        order as Prisma.SortOrder;
    }

    const [questions, total] = await Promise.all([
      this.prisma.forumQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              answers: true,
            },
          },
        },
      }),
      this.prisma.forumQuestion.count({ where }),
    ]);

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      student_id: question.studentId,
      title: question.title,
      message: question.message,
      student: question.student,
      answers_count: 0,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    }));

    return {
      questions: formattedQuestions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getStatistics(): Promise<ForumQuestionStatisticsResponse> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // First get the basic counts
    const totalQuestions = await this.prisma.forumQuestion.count();
    const answeredQuestions = await this.prisma.forumQuestion.count({
      where: {
        answers: {
          some: {},
        },
      },
    });
    const questionsThisMonth = await this.prisma.forumQuestion.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
    const questionsThisYear = await this.prisma.forumQuestion.count({
      where: {
        createdAt: {
          gte: startOfYear,
        },
      },
    });

    // Get most active students
    const mostActiveStudents = await this.prisma.user.findMany({
      where: {
        role: Role.student,
        forumQuestions: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            forumQuestions: true,
          },
        },
      },
      orderBy: {
        forumQuestions: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    // Calculate average answers
    const totalAnswers = await this.prisma.forumAnswer.count();
    const averageAnswers =
      totalQuestions > 0 ? totalAnswers / totalQuestions : 0;

    const unansweredQuestions = totalQuestions - answeredQuestions;

    return {
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
      unanswered_questions: unansweredQuestions,
      questions_this_month: questionsThisMonth,
      questions_this_year: questionsThisYear,
      average_answers_per_question: Math.round(averageAnswers * 10) / 10,
      most_active_students: mostActiveStudents.map((student) => ({
        student_id: student.id,
        student_name: student.name,
        questions_count: student._count.forumQuestions,
      })),
      popular_topics: [
        { topic: 'react', question_count: 28 },
        { topic: 'javascript', question_count: 35 },
      ], // Mock data - would need text analysis for real implementation
      monthly_breakdown: [
        {
          month: now.toISOString().substring(0, 7),
          questions: questionsThisMonth,
          answers: 0, // Would need additional query
        },
      ],
    };
  }
}
