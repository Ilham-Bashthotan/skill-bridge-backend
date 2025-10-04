import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { SearchJobsQueryDto } from './dto/search-jobs-query.dto';

@Injectable()
export class JobService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllJobs(query: GetJobsQueryDto) {
    const { page = 1, limit = 10, search, location, company } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: Prisma.JobWhereInput = {};

    if (search && search.trim()) {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { company: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (location && location.trim()) {
      whereClause.location = { contains: location.trim(), mode: 'insensitive' };
    }

    if (company && company.trim()) {
      whereClause.company = { contains: company.trim(), mode: 'insensitive' };
    }

    // Get total count
    const total = await this.prismaService.job.count({ where: whereClause });

    // Get jobs
    const jobs = await this.prismaService.job.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        company: true,
        requirements: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        description: job.description,
        company: job.company,
        requirements: job.requirements,
        location: job.location,
        admin: job.admin,
        created_at: job.createdAt,
        updated_at: job.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    };
  }

  async getJobById(jobId: number) {
    const job = await this.prismaService.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        description: true,
        company: true,
        requirements: true,
        location: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      id: job.id,
      title: job.title,
      description: job.description,
      company: job.company,
      requirements: job.requirements,
      location: job.location,
      admin: job.admin,
      created_at: job.createdAt,
    };
  }

  async createJob(adminId: number, createJobDto: CreateJobDto) {
    // Verify admin exists
    const admin = await this.prismaService.user.findUnique({
      where: { id: adminId, role: 'admin' },
    });

    if (!admin) {
      throw new ForbiddenException('Only admins can create jobs');
    }

    const job = await this.prismaService.job.create({
      data: {
        adminId,
        title: createJobDto.title,
        description: createJobDto.description,
        company: createJobDto.company,
        requirements: createJobDto.requirements,
        location: createJobDto.location,
      },
      select: {
        id: true,
        adminId: true,
        title: true,
        description: true,
        company: true,
        requirements: true,
        location: true,
        createdAt: true,
      },
    });

    return {
      message: 'Job created successfully',
      job: {
        id: job.id,
        admin_id: job.adminId,
        title: job.title,
        description: job.description,
        company: job.company,
        requirements: job.requirements,
        location: job.location,
        created_at: job.createdAt,
      },
    };
  }

  async updateJob(adminId: number, jobId: number, updateJobDto: UpdateJobDto) {
    // Check if job exists and belongs to admin
    const existingJob = await this.prismaService.job.findFirst({
      where: { id: jobId, adminId },
    });

    if (!existingJob) {
      throw new NotFoundException('Job not found or unauthorized');
    }

    const job = await this.prismaService.job.update({
      where: { id: jobId },
      data: {
        ...(updateJobDto.title && { title: updateJobDto.title }),
        ...(updateJobDto.description && {
          description: updateJobDto.description,
        }),
        ...(updateJobDto.company && { company: updateJobDto.company }),
        ...(updateJobDto.requirements && {
          requirements: updateJobDto.requirements,
        }),
        ...(updateJobDto.location && { location: updateJobDto.location }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        company: true,
        requirements: true,
        location: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Job updated successfully',
      job: {
        id: job.id,
        title: job.title,
        description: job.description,
        company: job.company,
        requirements: job.requirements,
        location: job.location,
        updated_at: job.updatedAt,
      },
    };
  }

  async deleteJob(adminId: number, jobId: number) {
    // Check if job exists and belongs to admin
    const existingJob = await this.prismaService.job.findFirst({
      where: { id: jobId, adminId },
    });

    if (!existingJob) {
      throw new NotFoundException('Job not found or unauthorized');
    }

    await this.prismaService.job.delete({
      where: { id: jobId },
    });

    return {
      message: 'Job deleted successfully',
    };
  }

  async getAdminJobs(adminId: number, query: GetJobsQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await this.prismaService.job.count({
      where: { adminId },
    });

    // Get jobs
    const jobs = await this.prismaService.job.findMany({
      where: { adminId },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        created_at: job.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    };
  }

  async searchJobs(query: SearchJobsQueryDto) {
    const {
      q,
      location,
      company,
      requirements,
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'desc',
    } = query;

    if (!q && !location && !company && !requirements) {
      throw new BadRequestException('Search query is required');
    }

    const skip = (page - 1) * limit;
    const startTime = Date.now();

    // Build where clause
    const whereClause: Prisma.JobWhereInput = {};

    if (q && q.trim()) {
      whereClause.OR = [
        { title: { contains: q.trim(), mode: 'insensitive' } },
        { description: { contains: q.trim(), mode: 'insensitive' } },
        { company: { contains: q.trim(), mode: 'insensitive' } },
      ];
    }

    if (location && location.trim()) {
      whereClause.location = { contains: location.trim(), mode: 'insensitive' };
    }

    if (company && company.trim()) {
      whereClause.company = { contains: company.trim(), mode: 'insensitive' };
    }

    if (requirements && requirements.trim()) {
      whereClause.requirements = {
        contains: requirements.trim(),
        mode: 'insensitive',
      };
    }

    // Get total count
    const total = await this.prismaService.job.count({ where: whereClause });

    // Build order by
    const orderBy: Prisma.JobOrderByWithRelationInput = {};
    if (sort === 'created_at') orderBy.createdAt = order as Prisma.SortOrder;
    if (sort === 'title') orderBy.title = order as Prisma.SortOrder;
    if (sort === 'company') orderBy.company = order as Prisma.SortOrder;

    // Get jobs
    const jobs = await this.prismaService.job.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        company: true,
        requirements: true,
        location: true,
        createdAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    const searchTime = Date.now() - startTime;

    return {
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        description: job.description,
        company: job.company,
        requirements: job.requirements,
        location: job.location,
        created_at: job.createdAt,
        relevance_score: 0.95, // Mock relevance score
      })),
      search_metadata: {
        query: q || '',
        total_results: total,
        search_time_ms: searchTime,
      },
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getJobStatistics(adminId: number) {
    const currentDate = new Date();
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const currentYear = new Date(currentDate.getFullYear(), 0, 1);

    // Total jobs by admin
    const totalJobs = await this.prismaService.job.count({
      where: { adminId },
    });

    // Jobs this month
    const jobsThisMonth = await this.prismaService.job.count({
      where: {
        adminId,
        createdAt: { gte: currentMonth },
      },
    });

    // Jobs this year
    const jobsThisYear = await this.prismaService.job.count({
      where: {
        adminId,
        createdAt: { gte: currentYear },
      },
    });

    // Top companies (for this admin's jobs)
    const topCompanies = await this.prismaService.job.groupBy({
      by: ['company'],
      where: { adminId },
      _count: { company: true },
      orderBy: { _count: { company: 'desc' } },
      take: 5,
    });

    // Top locations (for this admin's jobs)
    const topLocations = await this.prismaService.job.groupBy({
      by: ['location'],
      where: { adminId },
      _count: { location: true },
      orderBy: { _count: { location: 'desc' } },
      take: 5,
    });

    return {
      total_jobs: totalJobs,
      active_jobs: totalJobs, // Assuming all jobs are active
      jobs_this_month: jobsThisMonth,
      jobs_this_year: jobsThisYear,
      top_companies: topCompanies.map((item) => ({
        company: item.company,
        job_count:
          typeof item._count === 'object' &&
          item._count !== null &&
          'company' in item._count
            ? (item._count as Record<string, number>).company
            : 0,
      })),
      top_locations: topLocations.map((item) => ({
        location: item.location,
        job_count:
          typeof item._count === 'object' &&
          item._count !== null &&
          'location' in item._count
            ? (item._count as Record<string, number>).location
            : 0,
      })),
      monthly_breakdown: [], // Would need more complex query for actual data
    };
  }

  async getCompanies() {
    const companies = await this.prismaService.job.groupBy({
      by: ['company'],
      _count: { company: true },
      orderBy: { _count: { company: 'desc' } },
    });

    const companiesWithLatestJob = await Promise.all(
      companies.map(async (item) => {
        const latestJob = await this.prismaService.job.findFirst({
          where: { company: item.company },
          select: { id: true, title: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        });

        return {
          name: item.company,
          job_count: item._count.company,
          latest_job: latestJob
            ? {
                id: latestJob.id,
                title: latestJob.title,
                created_at: latestJob.createdAt,
              }
            : null,
        };
      }),
    );

    return {
      companies: companiesWithLatestJob,
    };
  }

  async getLocations() {
    const locations = await this.prismaService.job.groupBy({
      by: ['location'],
      _count: { location: true },
      orderBy: { _count: { location: 'desc' } },
    });

    return {
      locations: locations.map((item) => ({
        location: item.location,
        job_count: item._count.location,
      })),
    };
  }
}
