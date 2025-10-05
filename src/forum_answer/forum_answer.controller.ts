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
import { ForumAnswerService } from './forum_answer.service';
import { CreateForumAnswerDto } from './dto/create-forum-answer.dto';
import { UpdateForumAnswerDto } from './dto/update-forum-answer.dto';
import { GetForumAnswersQueryDto } from './dto/get-forum-answers-query.dto';
import { SearchForumAnswersQueryDto } from './dto/search-forum-answers-query.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Auth } from '../common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('forum/answers')
@UseGuards(JwtAuthGuard)
export class ForumAnswerController {
  constructor(private readonly forumAnswerService: ForumAnswerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAnswers(@Query() query: GetForumAnswersQueryDto) {
    try {
      return await this.forumAnswerService.getAllAnswers(query);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchAnswers(@Query() query: SearchForumAnswersQueryDto) {
    try {
      return await this.forumAnswerService.searchAnswers(query);
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
      return await this.forumAnswerService.getStatistics();
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get(':answerId')
  @HttpCode(HttpStatus.OK)
  async getAnswerById(@Param('answerId', ParseIntPipe) answerId: number) {
    try {
      return await this.forumAnswerService.getAnswerById(answerId);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAnswer(
    @Auth() user: User,
    @Body() createAnswerDto: CreateForumAnswerDto,
  ) {
    try {
      return await this.forumAnswerService.createAnswer(
        user.id,
        createAnswerDto,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Put(':answerId')
  @HttpCode(HttpStatus.OK)
  async updateAnswer(
    @Auth() user: User,
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body() updateAnswerDto: UpdateForumAnswerDto,
  ) {
    try {
      return await this.forumAnswerService.updateAnswer(
        user.id,
        answerId,
        updateAnswerDto,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Delete(':answerId')
  @HttpCode(HttpStatus.OK)
  async deleteAnswer(
    @Auth() user: User,
    @Param('answerId', ParseIntPipe) answerId: number,
  ) {
    try {
      return await this.forumAnswerService.deleteAnswer(user.id, answerId);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }
}
