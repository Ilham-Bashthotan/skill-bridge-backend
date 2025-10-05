import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { ConsultationAnswerValidation } from './consultation_answer.validation';
import { CreateConsultationAnswerDto } from './dto/create-consultation-answer.dto';
import { UpdateConsultationAnswerDto } from './dto/update-consultation-answer.dto';
import { GetConsultationAnswersQueryDto } from './dto/get-consultation-answers-query.dto';
import { SearchConsultationAnswersDto } from './dto/search-consultation-answers.dto';
import type { ConsultationAnswerResponseModel } from '../model/consultation-answer-response.model';
import type {
  ValidatedGetAnswersQuery,
  ValidatedCreateAnswer,
  ValidatedUpdateAnswer,
  ValidatedSearchQuery,
} from '../common/types';

@Injectable()
export class ConsultationAnswerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getAllAnswers(
    query: GetConsultationAnswersQueryDto,
    userRole: string,
    userId?: number,
  ) {
    const validatedQuery = this.validationService.validate(
      ConsultationAnswerValidation.GET_QUERY,
      query,
    ) as ValidatedGetAnswersQuery;

    const {
      consultations_question_id,
      mentor_id,
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'desc',
    } = validatedQuery;

    // Build where clause based on role and filters
    const whereClause: {
      consultationsQuestionId?: number | { in: number[] };
      mentorId?: number;
    } = {};

    if (consultations_question_id) {
      whereClause.consultationsQuestionId = consultations_question_id;
    }

    if (mentor_id) {
      whereClause.mentorId = mentor_id;
    }

    // For students, they can only see answers to their own questions
    if (userRole === 'student') {
      const studentQuestions =
        await this.prismaService.consultationQuestion.findMany({
          where: { studentId: userId },
          select: { id: true },
        });

      if (studentQuestions.length === 0) {
        return {
          answers: [],
          pagination: {
            page,
            limit,
            total: 0,
            total_pages: 0,
          },
        };
      }

      whereClause.consultationsQuestionId = {
        in: studentQuestions.map((q) => q.id),
      };
    }

    // Get total count
    const total = await this.prismaService.consultationAnswer.count({
      where: whereClause,
    });

    // Get answers
    const answers = await this.prismaService.consultationAnswer.findMany({
      where: whereClause,
      select: {
        id: true,
        consultationsQuestionId: true,
        mentorId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        mentor: {
          select: {
            id: true,
            name: true,
            role: true,
            bio: true,
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
                id: true,
                name: true,
              },
            },
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
    const transformedAnswers: ConsultationAnswerResponseModel[] = answers.map(
      (answer) => ({
        id: answer.id,
        consultations_question_id: answer.consultationsQuestionId,
        mentor_id: answer.mentorId,
        message: answer.message,
        mentor: answer.mentor,
        consultation_question: answer.question,
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

  async getAnswerById(
    answerId: number,
    userRole: string,
    userId: number,
  ): Promise<ConsultationAnswerResponseModel> {
    const answer = await this.prismaService.consultationAnswer.findUnique({
      where: { id: answerId },
      select: {
        id: true,
        consultationsQuestionId: true,
        mentorId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            experience: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
            message: true,
            studentId: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!answer) {
      throw new NotFoundException('Consultation answer not found');
    }

    // Check access permissions
    if (userRole === 'student') {
      // Students can only see answers to their own questions
      if (answer.question?.studentId !== userId) {
        throw new ForbiddenException(
          'You can only view answers to your own questions',
        );
      }
    } else if (userRole === 'mentor') {
      // Mentors can see all answers, but let's include this for completeness
      // No additional restrictions for mentors
    }
    // Admins can see all answers

    return {
      id: answer.id,
      consultations_question_id: answer.consultationsQuestionId,
      mentor_id: answer.mentorId,
      message: answer.message,
      mentor: answer.mentor,
      consultation_question: answer.question,
      created_at: answer.createdAt,
      updated_at: answer.updatedAt,
    };
  }

  async createAnswer(mentorId: number, data: CreateConsultationAnswerDto) {
    const validatedData = this.validationService.validate(
      ConsultationAnswerValidation.CREATE,
      data,
    ) as ValidatedCreateAnswer;

    // Check if consultation question exists
    const question = await this.prismaService.consultationQuestion.findUnique({
      where: { id: validatedData.consultations_question_id },
    });

    if (!question) {
      throw new NotFoundException('Consultation question not found');
    }

    // Create the answer
    const answer = await this.prismaService.consultationAnswer.create({
      data: {
        consultationsQuestionId: validatedData.consultations_question_id,
        mentorId,
        message: validatedData.message,
      },
      select: {
        id: true,
        consultationsQuestionId: true,
        mentorId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Consultation answer created successfully',
      answer: {
        id: answer.id,
        consultations_question_id: answer.consultationsQuestionId,
        mentor_id: answer.mentorId,
        message: answer.message,
        created_at: answer.createdAt,
        updated_at: answer.updatedAt,
      },
    };
  }

  async updateAnswer(
    mentorId: number,
    answerId: number,
    data: UpdateConsultationAnswerDto,
    userRole: string,
  ) {
    const validatedData = this.validationService.validate(
      ConsultationAnswerValidation.UPDATE,
      data,
    ) as ValidatedUpdateAnswer;

    // Check if answer exists
    const existingAnswer =
      await this.prismaService.consultationAnswer.findUnique({
        where: { id: answerId },
      });

    if (!existingAnswer) {
      throw new NotFoundException('Consultation answer not found');
    }

    // Check permission - only answer owner or admin can update
    if (userRole !== 'admin' && existingAnswer.mentorId !== mentorId) {
      throw new ForbiddenException('You can only update your own answers');
    }

    // Update the answer
    const updatedAnswer = await this.prismaService.consultationAnswer.update({
      where: { id: answerId },
      data: validatedData,
      select: {
        id: true,
        consultationsQuestionId: true,
        mentorId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Consultation answer updated successfully',
      answer: {
        id: updatedAnswer.id,
        consultations_question_id: updatedAnswer.consultationsQuestionId,
        mentor_id: updatedAnswer.mentorId,
        message: updatedAnswer.message,
        created_at: updatedAnswer.createdAt,
        updated_at: updatedAnswer.updatedAt,
      },
    };
  }

  async deleteAnswer(mentorId: number, answerId: number, userRole: string) {
    // Check if answer exists
    const existingAnswer =
      await this.prismaService.consultationAnswer.findUnique({
        where: { id: answerId },
      });

    if (!existingAnswer) {
      throw new NotFoundException('Consultation answer not found');
    }

    // Check permission - only answer owner or admin can delete
    if (userRole !== 'admin' && existingAnswer.mentorId !== mentorId) {
      throw new ForbiddenException('You can only delete your own answers');
    }

    // Delete the answer
    await this.prismaService.consultationAnswer.delete({
      where: { id: answerId },
    });

    return {
      message: 'Consultation answer deleted successfully',
    };
  }

  async getStatistics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalAnswers, answersThisMonth, answersThisYear] = await Promise.all(
      [
        this.prismaService.consultationAnswer.count(),
        this.prismaService.consultationAnswer.count({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
        }),
        this.prismaService.consultationAnswer.count({
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

  async searchAnswers(
    query: SearchConsultationAnswersDto,
    userRole: string,
    userId?: number,
  ) {
    const validatedQuery = this.validationService.validate(
      ConsultationAnswerValidation.SEARCH,
      query,
    ) as ValidatedSearchQuery;

    const {
      q,
      consultations_question_id,
      mentor_id,
      page = 1,
      limit = 10,
    } = validatedQuery;

    // Build where clause with proper typing
    const whereClause: {
      message: {
        contains: string;
        mode: 'insensitive';
      };
      consultationsQuestionId?: number | { in: number[] };
      mentorId?: number;
    } = {
      message: {
        contains: q,
        mode: 'insensitive',
      },
    };

    if (consultations_question_id) {
      whereClause.consultationsQuestionId = consultations_question_id;
    }

    if (mentor_id) {
      whereClause.mentorId = mentor_id;
    }

    // For students, only show answers to their own questions
    if (userRole === 'student') {
      const studentQuestions =
        await this.prismaService.consultationQuestion.findMany({
          where: { studentId: userId },
          select: { id: true },
        });

      if (studentQuestions.length === 0) {
        return {
          answers: [],
          search_metadata: {
            query: q,
            total_results: 0,
            search_time_ms: 0,
          },
          pagination: {
            page,
            limit,
            total: 0,
            total_pages: 0,
          },
        };
      }

      whereClause.consultationsQuestionId = {
        in: studentQuestions.map((question) => question.id),
      };
    }

    const startTime = Date.now();

    // Get total count
    const total = await this.prismaService.consultationAnswer.count({
      where: whereClause,
    });

    // Get search results
    const answers = await this.prismaService.consultationAnswer.findMany({
      where: whereClause,
      select: {
        id: true,
        consultationsQuestionId: true,
        message: true,
        createdAt: true,
        mentor: {
          select: {
            name: true,
            role: true,
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

    // Transform response with relevance score (simplified)
    const transformedAnswers = answers.map((answer) => ({
      id: answer.id,
      consultations_question_id: answer.consultationsQuestionId,
      message: answer.message,
      mentor: answer.mentor,
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

  private calculateRelevanceScore(message: string, query: string): number {
    // Simple relevance scoring based on term frequency
    const messageLower = message.toLowerCase();
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(' ').filter((term) => term.length > 0);

    let score = 0;
    for (const term of queryTerms) {
      const matches = (messageLower.match(new RegExp(term, 'g')) || []).length;
      score += matches;
    }

    // Normalize score (0-1 range)
    const maxPossibleScore = queryTerms.length * 3; // Assume max 3 occurrences per term
    return Math.min(score / maxPossibleScore, 1);
  }
}
