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
  Request,
  HttpCode,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { UpdateMentorStatusDto } from './dto/update-mentor-status.dto';
import type { AuthenticatedRequest } from '../model/request.model';

@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Request() req: AuthenticatedRequest) {
    return this.mentorService.getDashboard(req.user!.id);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.mentorService.getProfile(req.user!.id);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateData: UpdateMentorProfileDto,
  ) {
    return this.mentorService.updateProfile(req.user!.id, updateData);
  }

  @Get('courses/assigned')
  @HttpCode(HttpStatus.OK)
  async getAssignedCourses(@Request() req: AuthenticatedRequest) {
    return this.mentorService.getAssignedCourses(req.user!.id);
  }

  @Get('courses/:courseId')
  @HttpCode(HttpStatus.OK)
  async getCourseDetails(
    @Request() req: AuthenticatedRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.mentorService.getCourseDetails(req.user!.id, courseId);
  }

  @Get('courses/:courseId/students')
  @HttpCode(HttpStatus.OK)
  async getCourseStudents(
    @Request() req: AuthenticatedRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.mentorService.getCourseStudents(req.user!.id, courseId);
  }

  @Get('courses/:courseId/materials')
  @HttpCode(HttpStatus.OK)
  async getCourseMaterials(
    @Request() req: AuthenticatedRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.mentorService.getCourseMaterials(req.user!.id, courseId);
  }

  @Post('courses/:courseId/materials')
  @HttpCode(HttpStatus.CREATED)
  async createCourseMaterial(
    @Request() req: AuthenticatedRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createData: CreateMaterialDto,
  ) {
    return this.mentorService.createCourseMaterial(
      req.user!.id,
      courseId,
      createData,
    );
  }

  @Put('courses/:courseId/materials/:materialId')
  @HttpCode(HttpStatus.OK)
  async updateCourseMaterial(
    @Request() req: AuthenticatedRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('materialId', ParseIntPipe) materialId: number,
    @Body() updateData: UpdateMaterialDto,
  ) {
    return this.mentorService.updateCourseMaterial(
      req.user!.id,
      courseId,
      materialId,
      updateData,
    );
  }

  @Delete('courses/:courseId/materials/:materialId')
  @HttpCode(HttpStatus.OK)
  async deleteCourseMaterial(
    @Request() req: AuthenticatedRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('materialId', ParseIntPipe) materialId: number,
  ) {
    return this.mentorService.deleteCourseMaterial(
      req.user!.id,
      courseId,
      materialId,
    );
  }

  @Get('students/:studentId/progress')
  @HttpCode(HttpStatus.OK)
  async getStudentProgress(
    @Request() req: AuthenticatedRequest,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.mentorService.getStudentProgress(req.user!.id, studentId);
  }

  @Put('status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Request() req: AuthenticatedRequest,
    @Body() updateData: UpdateMentorStatusDto,
  ) {
    return this.mentorService.updateStatus(req.user!.id, updateData);
  }
}
