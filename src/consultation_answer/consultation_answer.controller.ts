import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { ConsultationAnswerService } from './consultation_answer.service';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { Auth } from '../common/auth.decorator';
import { CreateConsultationAnswerDto } from './dto/create-consultation-answer.dto';
import { UpdateConsultationAnswerDto } from './dto/update-consultation-answer.dto';
import { GetConsultationAnswersQueryDto } from './dto/get-consultation-answers-query.dto';
import { SearchConsultationAnswersDto } from './dto/search-consultation-answers.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';

@Controller('consultations/answers')
export class ConsultationAnswerController {
  constructor(
    private readonly consultationAnswerService: ConsultationAnswerService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllAnswers(
    @Query() query: GetConsultationAnswersQueryDto,
    @Auth() user: User,
  ) {
    return this.consultationAnswerService.getAllAnswers(
      query,
      user.role,
      user.id,
    );
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getStatistics() {
    return this.consultationAnswerService.getStatistics();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchAnswers(
    @Query() query: SearchConsultationAnswersDto,
    @Auth() user: User,
  ) {
    return this.consultationAnswerService.searchAnswers(
      query,
      user.role,
      user.id,
    );
  }

  @Get(':answerId')
  @UseGuards(JwtAuthGuard)
  async getAnswerById(
    @Param('answerId', ParseIntPipe) answerId: number,
    @Auth() user: User,
  ) {
    return this.consultationAnswerService.getAnswerById(
      answerId,
      user.role,
      user.id,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createAnswer(
    @Body() createAnswerDto: CreateConsultationAnswerDto,
    @Auth() user: User,
  ) {
    return this.consultationAnswerService.createAnswer(
      user.id,
      createAnswerDto,
    );
  }

  @Put(':answerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  async updateAnswer(
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body() updateAnswerDto: UpdateConsultationAnswerDto,
    @Auth() user: User,
  ) {
    return this.consultationAnswerService.updateAnswer(
      user.id,
      answerId,
      updateAnswerDto,
      user.role,
    );
  }

  @Delete(':answerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteAnswer(
    @Param('answerId', ParseIntPipe) answerId: number,
    @Auth() user: User,
  ) {
    return this.consultationAnswerService.deleteAnswer(
      user.id,
      answerId,
      user.role,
    );
  }
}
