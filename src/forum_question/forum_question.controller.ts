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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ForumQuestionService } from './forum_question.service';
import { CreateForumQuestionDto } from './dto/create-forum-question.dto';
import { UpdateForumQuestionDto } from './dto/update-forum-question.dto';
import {
  GetForumQuestionsQueryDto,
  GetMyQuestionsQueryDto,
  SearchForumQuestionsDto,
} from './dto/get-forum-questions-query.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Auth } from '../common/auth.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import {
  GetForumQuestionsResponse,
  CreateForumQuestionResponse,
  UpdateForumQuestionResponse,
  DeleteForumQuestionResponse,
  SearchForumQuestionsResponse,
  ForumQuestionStatisticsResponse,
} from '../model/forum-question-response.model';

@Controller('forum/questions')
export class ForumQuestionController {
  constructor(private readonly forumQuestionService: ForumQuestionService) {}

  @Get()
  async getAllQuestions(
    @Query(ValidationPipe) query: GetForumQuestionsQueryDto,
  ): Promise<GetForumQuestionsResponse> {
    return this.forumQuestionService.getAllQuestions(query);
  }

  @Get('search')
  async searchQuestions(
    @Query(ValidationPipe) query: SearchForumQuestionsDto,
  ): Promise<SearchForumQuestionsResponse> {
    return this.forumQuestionService.searchQuestions(query);
  }

  @Get('unanswered')
  async getUnansweredQuestions(
    @Query(ValidationPipe) query: GetForumQuestionsQueryDto,
  ): Promise<GetForumQuestionsResponse> {
    return this.forumQuestionService.getUnansweredQuestions(query);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async getStatistics(): Promise<ForumQuestionStatisticsResponse> {
    return this.forumQuestionService.getStatistics();
  }

  @Get('my-questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.student)
  async getMyQuestions(
    @Auth() user: User,
    @Query(ValidationPipe) query: GetMyQuestionsQueryDto,
  ): Promise<GetForumQuestionsResponse> {
    return this.forumQuestionService.getMyQuestions(user.id, query);
  }

  @Get(':questionId')
  async getQuestionById(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.forumQuestionService.getQuestionById(questionId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.student)
  async createQuestion(
    @Auth() user: User,
    @Body(ValidationPipe) createQuestionDto: CreateForumQuestionDto,
  ): Promise<CreateForumQuestionResponse> {
    return this.forumQuestionService.createQuestion(user.id, createQuestionDto);
  }

  @Put(':questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.student)
  async updateQuestion(
    @Auth() user: User,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body(ValidationPipe) updateQuestionDto: UpdateForumQuestionDto,
  ): Promise<UpdateForumQuestionResponse> {
    return this.forumQuestionService.updateQuestion(
      user.id,
      questionId,
      updateQuestionDto,
    );
  }

  @Delete(':questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.student, Role.admin)
  async deleteQuestion(
    @Auth() user: User,
    @Param('questionId', ParseIntPipe) questionId: number,
  ): Promise<DeleteForumQuestionResponse> {
    return this.forumQuestionService.deleteQuestion(
      user.id,
      questionId,
      user.role,
    );
  }
}
