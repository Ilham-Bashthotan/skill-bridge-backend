import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { UpdateMentorStatusDto } from './dto/update-mentor-status.dto';
import { Auth } from '../common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Auth() user: User) {
    return this.mentorService.getDashboard(user.id);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Auth() user: User) {
    return this.mentorService.getProfile(user.id);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Auth() user: User,
    @Body() updateData: UpdateMentorProfileDto,
  ) {
    return this.mentorService.updateProfile(user.id, updateData);
  }

  @Get('courses/assigned')
  @HttpCode(HttpStatus.OK)
  async getAssignedCourses(@Auth() user: User) {
    return this.mentorService.getAssignedCourses(user.id);
  }

  @Get('courses/:courseId')
  @HttpCode(HttpStatus.OK)
  async getCourseDetails(
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.mentorService.getCourseDetails(user.id, courseId);
  }

  @Get('courses/:courseId/students')
  @HttpCode(HttpStatus.OK)
  async getCourseStudents(
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.mentorService.getCourseStudents(user.id, courseId);
  }

  @Get('courses/:courseId/materials')
  @HttpCode(HttpStatus.OK)
  async getCourseMaterials(
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.mentorService.getCourseMaterials(user.id, courseId);
  }

  @Post('courses/:courseId/materials')
  @HttpCode(HttpStatus.CREATED)
  async createCourseMaterial(
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createData: CreateMaterialDto,
  ) {
    return this.mentorService.createCourseMaterial(
      user.id,
      courseId,
      createData,
    );
  }

  @Put('courses/:courseId/materials/:materialId')
  @HttpCode(HttpStatus.OK)
  async updateCourseMaterial(
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('materialId', ParseIntPipe) materialId: number,
    @Body() updateData: UpdateMaterialDto,
  ) {
    return this.mentorService.updateCourseMaterial(
      user.id,
      courseId,
      materialId,
      updateData,
    );
  }

  @Delete('courses/:courseId/materials/:materialId')
  @HttpCode(HttpStatus.OK)
  async deleteCourseMaterial(
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('materialId', ParseIntPipe) materialId: number,
  ) {
    return this.mentorService.deleteCourseMaterial(
      user.id,
      courseId,
      materialId,
    );
  }

  @Get('students/:studentId/progress')
  @HttpCode(HttpStatus.OK)
  async getStudentProgress(
    @Auth() user: User,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.mentorService.getStudentProgress(user.id, studentId);
  }

  @Put('status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Auth() user: User,
    @Body() updateData: UpdateMentorStatusDto,
  ) {
    return this.mentorService.updateStatus(user.id, updateData);
  }
}
