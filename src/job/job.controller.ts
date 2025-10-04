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
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { SearchJobsQueryDto } from './dto/search-jobs-query.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Auth } from '../common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // Public endpoints (no authentication required)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllJobs(@Query() query: GetJobsQueryDto) {
    try {
      return await this.jobService.getAllJobs(query);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchJobs(@Query() query: SearchJobsQueryDto) {
    try {
      return await this.jobService.searchJobs(query);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('companies')
  @HttpCode(HttpStatus.OK)
  async getCompanies() {
    try {
      return await this.jobService.getCompanies();
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('locations')
  @HttpCode(HttpStatus.OK)
  async getLocations() {
    try {
      return await this.jobService.getLocations();
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async getJobStatistics(@Auth() user: User) {
    try {
      return await this.jobService.getJobStatistics(user.id);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get(':jobId')
  @HttpCode(HttpStatus.OK)
  async getJobById(@Param('jobId', ParseIntPipe) jobId: number) {
    try {
      return await this.jobService.getJobById(jobId);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  // Admin-only endpoints
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async createJob(@Auth() user: User, @Body() createJobDto: CreateJobDto) {
    try {
      return await this.jobService.createJob(user.id, createJobDto);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Put(':jobId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async updateJob(
    @Auth() user: User,
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    try {
      return await this.jobService.updateJob(user.id, jobId, updateJobDto);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Delete(':jobId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async deleteJob(
    @Auth() user: User,
    @Param('jobId', ParseIntPipe) jobId: number,
  ) {
    try {
      return await this.jobService.deleteJob(user.id, jobId);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  @Get('admin/my-posts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async getAdminJobs(@Auth() user: User, @Query() query: GetJobsQueryDto) {
    try {
      return await this.jobService.getAdminJobs(user.id, query);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred' };
    }
  }
}
