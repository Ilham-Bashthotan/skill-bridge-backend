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
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { GetCoursesQueryDto } from './dto/get-courses-query.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { Auth } from '../common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Auth() user: User) {
    try {
      return await this.studentService.getDashboard(user.id);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Auth() user: User) {
    try {
      return await this.studentService.getProfile(user.id);
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
    @Auth() user: User,
    @Body() updateData: UpdateStudentProfileDto,
  ) {
    try {
      return await this.studentService.updateProfile(user.id, updateData);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('courses')
  @HttpCode(HttpStatus.OK)
  async getCourses(@Auth() user: User, @Query() query: GetCoursesQueryDto) {
    try {
      return await this.studentService.getCourses(user.id, query);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('courses/enrolled')
  @HttpCode(HttpStatus.OK)
  async getEnrolledCourses(@Auth() user: User) {
    try {
      return await this.studentService.getEnrolledCourses(user.id);
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
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    try {
      return await this.studentService.enrollInCourse(user.id, courseId);
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
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    try {
      return await this.studentService.getCourseDetails(user.id, courseId);
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
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    try {
      return await this.studentService.getCourseMaterials(user.id, courseId);
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
    @Auth() user: User,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('materialId', ParseIntPipe) materialId: number,
    @Body() updateData: UpdateProgressDto,
  ) {
    try {
      return await this.studentService.updateMaterialProgress(
        user.id,
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
  async getCertificates(@Auth() user: User) {
    try {
      return await this.studentService.getCertificates(user.id);
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
    @Auth() user: User,
    @Param('certificateId', ParseIntPipe) certificateId: number,
  ) {
    try {
      return await this.studentService.getCertificateById(
        user.id,
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
