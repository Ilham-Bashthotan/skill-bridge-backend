import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCoursesQueryDto } from './dto/get-courses-query.dto';
import { AssignMentorDto } from './dto/assign-mentor.dto';
import { GetStudentsQueryDto } from './dto/get-students-query.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { Auth } from '../common/auth.decorator';
import { WebResponse } from '../model/web.model';
import type { JwtPayload } from '../common/types';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<WebResponse<any>> {
    const result = await this.courseService.create(createCourseDto);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetCoursesQueryDto): Promise<WebResponse<any>> {
    const result = await this.courseService.findAll(query);
    return {
      data: result.data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<any>> {
    const result = await this.courseService.findOne(id);
    return {
      data: result,
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<WebResponse<any>> {
    const result = await this.courseService.update(id, updateCourseDto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<any>> {
    await this.courseService.remove(id);
    return {
      data: true,
    };
  }

  @Post(':id/mentors')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async assignMentor(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignMentorDto: AssignMentorDto,
  ): Promise<WebResponse<any>> {
    const result = await this.courseService.assignMentor(id, assignMentorDto);
    return {
      data: result,
    };
  }

  @Delete(':id/mentors/:mentorId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeMentor(
    @Param('id', ParseIntPipe) id: number,
    @Param('mentorId', ParseIntPipe) mentorId: number,
  ): Promise<WebResponse<any>> {
    await this.courseService.removeMentor(id, mentorId);
    return {
      data: true,
    };
  }

  @Post(':id/enroll')
  @Roles(Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async enroll(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: JwtPayload,
  ): Promise<WebResponse<any>> {
    const result = await this.courseService.enroll(id, user);
    return {
      data: result,
    };
  }

  @Delete(':id/enroll')
  @Roles(Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async unenroll(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: JwtPayload,
  ): Promise<WebResponse<any>> {
    await this.courseService.unenroll(id, user);
    return {
      data: true,
    };
  }

  @Get(':id/students')
  @Roles(Role.ADMIN, Role.MENTOR)
  @HttpCode(HttpStatus.OK)
  async getStudents(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetStudentsQueryDto,
    @Auth() user: JwtPayload,
  ): Promise<WebResponse<any>> {
    const result = await this.courseService.getStudents(id, query, user);
    return {
      data: result.data,
    };
  }
}
