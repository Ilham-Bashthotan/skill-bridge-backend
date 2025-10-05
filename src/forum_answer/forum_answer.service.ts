import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { ForumAnswerValidation } from './forum_answer.validation';
import { CreateForumAnswerDto } from './dto/create-forum-answer.dto';
import { UpdateForumAnswerDto } from './dto/update-forum-answer.dto';
import { GetForumAnswersQueryDto } from './dto/get-forum-answers-query.dto';
import { SearchForumAnswersQueryDto } from './dto/search-forum-answers-query.dto';
import type { ForumAnswerResponseModel } from '../model/forum-answer-response.model';

@Injectable()
export class ForumAnswerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getAllAnswers(query: GetForumAnswersQueryDto) {
    const validatedQuery = this.validationService.validate(
      ForumAnswerValidation.GET_QUERY,
      query,
    );

    const { question_id, user_id, page, limit, sort, order } = validatedQuery;

    // Build where clause
    const whereClause: {
      questionId?: number;
      userId?: number;
    } = {};
    if (question_id) {
      whereClause.questionId = question_id;
    }
    if (user_id) {
      whereClause.userId = user_id;
    }

    // Get total count
    const total = await this.prismaService.forumAnswer.count({
      where: whereClause,
    });

    // Get answers
    const answers = await this.prismaService.forumAnswer.findMany({
      where: whereClause,
      select: {
        id: true,
        questionId: true,
        userId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
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
    const transformedAnswers: ForumAnswerResponseModel[] = answers.map(
      (answer) => ({
        id: answer.id,
        question_id: answer.questionId,
        user_id: answer.userId,
        message: answer.message,
        user: answer.user,
        question: answer.question,
        created_at: answer.createdAt,
        updated_at: answer.updatedAt,
      }),
    );

    return {
      answers: transformedAnswers,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getAnswerById(answerId: number): Promise<ForumAnswerResponseModel> {
    const answer = await this.prismaService.forumAnswer.findUnique({
      where: { id: answerId },
      select: {
        id: true,
        questionId: true,
        userId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            experience: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
            message: true,
            student: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return {
      id: answer.id,
      question_id: answer.questionId,
      user_id: answer.userId,
      message: answer.message,
      user: {
        id: answer.user.id,
        name: answer.user.name,
        email: answer.user.email,
        role: answer.user.role,
        expertise: answer.user.experience || undefined,
      },
      question: {
        id: answer.question.id,
        title: answer.question.title,
        message: answer.question.message,
        student: {
          name: answer.question.student.name,
        },
      },
      created_at: answer.createdAt,
      updated_at: answer.updatedAt,
    };
  }

  async createAnswer(userId: number, createAnswerDto: CreateForumAnswerDto) {
    const validatedData = this.validationService.validate(
      ForumAnswerValidation.CREATE,
      createAnswerDto,
    );

    // Check if question exists
    const question = await this.prismaService.forumQuestion.findUnique({
      where: { id: validatedData.question_id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const answer = await this.prismaService.forumAnswer.create({
      data: {
        questionId: validatedData.question_id,
        userId: userId,
        message: validatedData.message,
      },
      select: {
        id: true,
        questionId: true,
        userId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Answer created successfully',
      answer: {
        id: answer.id,
        question_id: answer.questionId,
        user_id: answer.userId,
        message: answer.message,
        created_at: answer.createdAt,
        updated_at: answer.updatedAt,
      },
    };
  }

  async updateAnswer(
    userId: number,
    answerId: number,
    updateAnswerDto: UpdateForumAnswerDto,
  ) {
    const validatedData = this.validationService.validate(
      ForumAnswerValidation.UPDATE,
      updateAnswerDto,
    );

    // Check if answer exists and user owns it
    const existingAnswer = await this.prismaService.forumAnswer.findUnique({
      where: { id: answerId },
    });

    if (!existingAnswer) {
      throw new NotFoundException('Answer not found');
    }

    if (existingAnswer.userId !== userId) {
      throw new ForbiddenException('You can only update your own answers');
    }

    const updatedAnswer = await this.prismaService.forumAnswer.update({
      where: { id: answerId },
      data: {
        message: validatedData.message,
      },
      select: {
        id: true,
        questionId: true,
        userId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Answer updated successfully',
      answer: {
        id: updatedAnswer.id,
        question_id: updatedAnswer.questionId,
        user_id: updatedAnswer.userId,
        message: updatedAnswer.message,
        created_at: updatedAnswer.createdAt,
        updated_at: updatedAnswer.updatedAt,
      },
    };
  }

  async deleteAnswer(userId: number, answerId: number) {
    // Check if answer exists and user owns it
    const existingAnswer = await this.prismaService.forumAnswer.findUnique({
      where: { id: answerId },
    });

    if (!existingAnswer) {
      throw new NotFoundException('Answer not found');
    }

    if (existingAnswer.userId !== userId) {
      throw new ForbiddenException('You can only delete your own answers');
    }

    await this.prismaService.forumAnswer.delete({
      where: { id: answerId },
    });

    return {
      message: 'Answer deleted successfully',
    };
  }

  async searchAnswers(query: SearchForumAnswersQueryDto) {
    try {
      const validatedQuery = this.validationService.validate(
        ForumAnswerValidation.SEARCH,
        query,
      );

      if (!validatedQuery.q) {
        throw new BadRequestException('Search query is required');
      }
    } catch {
      throw new BadRequestException('Search query is required');
    }

    const validatedQuery = this.validationService.validate(
      ForumAnswerValidation.SEARCH,
      query,
    );

    const { q, question_id, user_id, page, limit } = validatedQuery;
    const startTime = Date.now();

    // Build where clause
    const whereClause: {
      message: { contains: string; mode: 'insensitive' };
      questionId?: number;
      userId?: number;
    } = {
      message: {
        contains: q,
        mode: 'insensitive',
      },
    };

    if (question_id) {
      whereClause.questionId = question_id;
    }
    if (user_id) {
      whereClause.userId = user_id;
    }

    // Get total count
    const total = await this.prismaService.forumAnswer.count({
      where: whereClause,
    });

    // Get answers
    const answers = await this.prismaService.forumAnswer.findMany({
      where: whereClause,
      select: {
        id: true,
        questionId: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            role: true,
          },
        },
        question: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const searchTime = Date.now() - startTime;

    // Transform response with relevance score
    const transformedAnswers = answers.map((answer) => ({
      id: answer.id,
      question_id: answer.questionId,
      message: answer.message,
      user: answer.user,
      question: answer.question,
      relevance_score: this.calculateRelevanceScore(answer.message, q),
      created_at: answer.createdAt,
    }));

    return {
      answers: transformedAnswers,
      search_metadata: {
        query: q,
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

  async getStatistics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalAnswers, answersThisMonth, answersThisYear] = await Promise.all(
      [
        this.prismaService.forumAnswer.count(),
        this.prismaService.forumAnswer.count({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
        }),
        this.prismaService.forumAnswer.count({
          where: {
            createdAt: {
              gte: startOfYear,
            },
          },
        }),
      ],
    );

    return {
      total_answers: totalAnswers,
      answers_this_month: answersThisMonth,
      answers_this_year: answersThisYear,
    };
  }

  private calculateRelevanceScore(message: string, query: string): number {
    const lowerMessage = message.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(' ').filter((word) => word.length > 0);

    let score = 0;
    const totalWords = queryWords.length;

    queryWords.forEach((word) => {
      if (lowerMessage.includes(word)) {
        score += 1;
      }
    });

    return Math.round((score / totalWords) * 100) / 100;
  }
}
