import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { GetCoursesQueryDto } from './dto/get-courses-query.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

interface RequestWithUser {
  user: { id: number; role: string };
}

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Request() req: RequestWithUser) {
    try {
      return await this.studentService.getDashboard(req.user.id);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: RequestWithUser) {
    try {
      return await this.studentService.getProfile(req.user.id);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateData: UpdateStudentProfileDto,
  ) {
    try {
      return await this.studentService.updateProfile(req.user.id, updateData);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('courses')
  @HttpCode(HttpStatus.OK)
  async getCourses(
    @Request() req: RequestWithUser,
    @Query() query: GetCoursesQueryDto,
  ) {
    try {
      return await this.studentService.getCourses(req.user.id, query);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('courses/enrolled')
  @HttpCode(HttpStatus.OK)
  async getEnrolledCourses(@Request() req: RequestWithUser) {
    try {
      return await this.studentService.getEnrolledCourses(req.user.id);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Post('courses/:courseId/enroll')
  @HttpCode(HttpStatus.OK)
  async enrollInCourse(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    try {
      return await this.studentService.enrollInCourse(req.user.id, courseId);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('courses/:courseId')
  @HttpCode(HttpStatus.OK)
  async getCourseDetails(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    try {
      return await this.studentService.getCourseDetails(req.user.id, courseId);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('courses/:courseId/materials')
  @HttpCode(HttpStatus.OK)
  async getCourseMaterials(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    try {
      return await this.studentService.getCourseMaterials(
        req.user.id,
        courseId,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Put('courses/:courseId/materials/:materialId/progress')
  @HttpCode(HttpStatus.OK)
  async updateMaterialProgress(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('materialId', ParseIntPipe) materialId: number,
    @Body() updateData: UpdateProgressDto,
  ) {
    try {
      return await this.studentService.updateMaterialProgress(
        req.user.id,
        courseId,
        materialId,
        updateData,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('certificates')
  @HttpCode(HttpStatus.OK)
  async getCertificates(@Request() req: RequestWithUser) {
    try {
      return await this.studentService.getCertificates(req.user.id);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('certificates/:certificateId')
  @HttpCode(HttpStatus.OK)
  async getCertificateById(
    @Request() req: RequestWithUser,
    @Param('certificateId', ParseIntPipe) certificateId: number,
  ) {
    try {
      return await this.studentService.getCertificateById(
        req.user.id,
        certificateId,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }
}
