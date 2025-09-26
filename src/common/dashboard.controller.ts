import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Auth } from '../common/auth.decorator';
import { StudentService } from '../student/student.service';
import { MentorService } from '../mentor/mentor.service';
import type { User } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly studentService: StudentService,
    private readonly mentorService: MentorService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Auth() user: User) {
    switch (user.role) {
      case 'student': {
        const studentDashboard = await this.studentService.getDashboard(
          user.id,
        );
        return {
          role: 'student',
          data: studentDashboard,
        };
      }

      case 'mentor': {
        const mentorDashboard = await this.mentorService.getDashboard(user.id);
        return {
          role: 'mentor',
          data: mentorDashboard,
        };
      }

      case 'admin': {
        // TODO: Implement admin dashboard when admin service is ready
        return {
          role: 'admin',
          data: {
            total_users: 0,
            total_courses: 0,
            total_mentors: 0,
            pending_approvals: 0,
          },
        };
      }

      default: {
        return {
          role: user.role,
          data: {},
        };
      }
    }
  }
}
