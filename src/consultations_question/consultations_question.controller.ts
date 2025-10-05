import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ConsultationsQuestionService } from './consultations_question.service';
import { CreateConsultationQuestionDto } from './dto/create-consultation-question.dto';
import { UpdateConsultationQuestionDto } from './dto/update-consultation-question.dto';
import { GetConsultationQuestionsQueryDto } from './dto/get-consultation-questions-query.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Auth } from '../common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('consultations/questions')
@UseGuards(JwtAuthGuard)
export class ConsultationsQuestionController {
  constructor(
    private readonly consultationQuestionService: ConsultationsQuestionService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllQuestions(
    @Auth() user: User,
    @Query() query: GetConsultationQuestionsQueryDto,
  ) {
    try {
      return await this.consultationQuestionService.getAllQuestions(
        query,
        user.role,
        user.id,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('my-questions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.student)
  async getMyQuestions(
    @Auth() user: User,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    try {
      return await this.consultationQuestionService.getMyQuestions(user.id, {
        page,
        limit,
      });
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('unanswered')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.mentor, Role.admin)
  async getUnansweredQuestions(
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    try {
      return await this.consultationQuestionService.getUnansweredQuestions({
        page,
        limit,
      });
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  async getStatistics() {
    try {
      return await this.consultationQuestionService.getStatistics();
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get(':questionId')
  @HttpCode(HttpStatus.OK)
  async getQuestionById(
    @Auth() user: User,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    try {
      return await this.consultationQuestionService.getQuestionById(
        questionId,
        user.role,
        user.id,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(Role.student)
  async createQuestion(
    @Auth() user: User,
    @Body() createQuestionDto: CreateConsultationQuestionDto,
  ) {
    try {
      return await this.consultationQuestionService.createQuestion(
        user.id,
        createQuestionDto,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Put(':questionId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.student)
  async updateQuestion(
    @Auth() user: User,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() updateQuestionDto: UpdateConsultationQuestionDto,
  ) {
    try {
      return await this.consultationQuestionService.updateQuestion(
        user.id,
        questionId,
        updateQuestionDto,
        user.role,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Delete(':questionId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.student, Role.admin)
  async deleteQuestion(
    @Auth() user: User,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    try {
      return await this.consultationQuestionService.deleteQuestion(
        user.id,
        questionId,
        user.role,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }
}
