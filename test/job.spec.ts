import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JobService } from '../src/job/job.service';
import { CommonModule } from '../src/common/common.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('JobService', () => {
  let service: JobService;
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, TestModule],
      providers: [JobService],
    }).compile();

    service = module.get<JobService>(JobService);
    testService = module.get<TestService>(TestService);
  });

  afterEach(async () => {
    await testService.cleanDatabase();
  });

  describe('getAllJobs', () => {
    it('should return empty jobs list when no jobs exist', async () => {
      await testService.cleanDatabase();
      const result = await service.getAllJobs({ page: 1, limit: 10 });

      expect(result.jobs).toBeDefined();
      expect(Array.isArray(result.jobs)).toBe(true);
      expect(result.jobs.length).toBe(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should return jobs with pagination', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');
      await testService.createJob(admin.id, '2');

      const result = await service.getAllJobs({ page: 1, limit: 10 });

      expect(result.jobs.length).toBe(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should filter jobs by search query', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, 'Frontend');
      await testService.createJob(admin.id, 'Backend');

      const result = await service.getAllJobs({
        page: 1,
        limit: 10,
        search: 'Frontend',
      });

      expect(result.jobs.length).toBe(1);
      expect(result.jobs[0].title).toContain('Frontend');
    });

    it('should filter jobs by location', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');

      const result = await service.getAllJobs({
        page: 1,
        limit: 10,
        location: 'Test Location',
      });

      expect(result.jobs.length).toBe(1);
      expect(result.jobs[0].location).toContain('Test Location');
    });

    it('should filter jobs by company', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');

      const result = await service.getAllJobs({
        page: 1,
        limit: 10,
        company: 'Test Company',
      });

      expect(result.jobs.length).toBe(1);
      expect(result.jobs[0].company).toContain('Test Company');
    });
  });

  describe('getJobById', () => {
    it('should return job details by id', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      const job = await testService.createJob(admin.id);

      const result = await service.getJobById(job.id);

      expect(result.id).toBe(job.id);
      expect(result.title).toBe('Test Job');
      expect(result.admin).toBeDefined();
      expect(result.admin.name).toBe('Test Admin');
    });

    it('should throw NotFoundException for non-existent job', async () => {
      await expect(service.getJobById(99999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createJob', () => {
    it('should create new job with valid admin', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();

      const jobData = {
        title: 'Software Engineer',
        description: 'We are looking for a skilled software engineer',
        company: 'Tech Company',
        requirements: 'JavaScript, Node.js, React',
        location: 'Jakarta',
      };

      const result = await service.createJob(admin.id, jobData);

      expect(result.message).toBe('Job created successfully');
      expect(result.job).toBeDefined();
      expect(result.job.title).toBe(jobData.title);
      expect(result.job.admin_id).toBe(admin.id);
    });

    it('should throw ForbiddenException for non-admin user', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();

      const jobData = {
        title: 'Software Engineer',
        description: 'We are looking for a skilled software engineer',
        company: 'Tech Company',
        requirements: 'JavaScript, Node.js, React',
        location: 'Jakarta',
      };

      await expect(service.createJob(student.id, jobData)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException for non-existent user', async () => {
      await testService.cleanDatabase();

      const jobData = {
        title: 'Software Engineer',
        description: 'We are looking for a skilled software engineer',
        company: 'Tech Company',
        requirements: 'JavaScript, Node.js, React',
        location: 'Jakarta',
      };

      await expect(service.createJob(99999, jobData)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateJob', () => {
    it('should update job with valid admin and ownership', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      const job = await testService.createJob(admin.id);

      const updateData = {
        title: 'Updated Job Title',
        description: 'Updated job description',
      };

      const result = await service.updateJob(admin.id, job.id, updateData);

      expect(result.message).toBe('Job updated successfully');
      expect(result.job.title).toBe(updateData.title);
      expect(result.job.description).toBe(updateData.description);
    });

    it('should throw NotFoundException for non-existent job', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();

      const updateData = {
        title: 'Updated Job Title',
      };

      await expect(
        service.updateJob(admin.id, 99999, updateData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when admin tries to update job they do not own', async () => {
      await testService.cleanDatabase();
      const admin1 = await testService.createAdmin();
      const admin2 = await testService.createAdmin('2');
      const job = await testService.createJob(admin1.id);

      const updateData = {
        title: 'Updated Job Title',
      };

      await expect(
        service.updateJob(admin2.id, job.id, updateData),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteJob', () => {
    it('should delete job with valid admin and ownership', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      const job = await testService.createJob(admin.id);

      const result = await service.deleteJob(admin.id, job.id);

      expect(result.message).toBe('Job deleted successfully');
    });

    it('should throw NotFoundException for non-existent job', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();

      await expect(service.deleteJob(admin.id, 99999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when admin tries to delete job they do not own', async () => {
      await testService.cleanDatabase();
      const admin1 = await testService.createAdmin();
      const admin2 = await testService.createAdmin('2');
      const job = await testService.createJob(admin1.id);

      await expect(service.deleteJob(admin2.id, job.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAdminJobs', () => {
    it('should return jobs created by specific admin', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');
      await testService.createJob(admin.id, '2');

      const result = await service.getAdminJobs(admin.id, {
        page: 1,
        limit: 10,
      });

      expect(result.jobs.length).toBe(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should return empty list for admin with no jobs', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();

      const result = await service.getAdminJobs(admin.id, {
        page: 1,
        limit: 10,
      });

      expect(result.jobs.length).toBe(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('searchJobs', () => {
    it('should search jobs with query', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, 'Developer');

      const result = await service.searchJobs({
        q: 'Developer',
        page: 1,
        limit: 10,
        sort: 'created_at',
        order: 'desc',
      });

      expect(result.jobs.length).toBe(1);
      expect(result.search_metadata.query).toBe('Developer');
      expect(result.search_metadata.total_results).toBe(1);
      expect(typeof result.search_metadata.search_time_ms).toBe('number');
    });

    it('should search jobs by location', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');

      const result = await service.searchJobs({
        location: 'Test Location',
        page: 1,
        limit: 10,
        sort: 'created_at',
        order: 'desc',
      });

      expect(result.jobs.length).toBe(1);
    });

    it('should throw BadRequestException when no search parameters provided', async () => {
      await expect(
        service.searchJobs({
          page: 1,
          limit: 10,
          sort: 'created_at',
          order: 'desc',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getJobStatistics', () => {
    it('should return job statistics for admin', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');
      await testService.createJob(admin.id, '2');

      const result = await service.getJobStatistics(admin.id);

      expect(result.total_jobs).toBe(2);
      expect(result.active_jobs).toBe(2);
      expect(typeof result.jobs_this_month).toBe('number');
      expect(typeof result.jobs_this_year).toBe('number');
      expect(Array.isArray(result.top_companies)).toBe(true);
      expect(Array.isArray(result.top_locations)).toBe(true);
    });

    it('should return zero statistics for admin with no jobs', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();

      const result = await service.getJobStatistics(admin.id);

      expect(result.total_jobs).toBe(0);
      expect(result.active_jobs).toBe(0);
    });
  });

  describe('getCompanies', () => {
    it('should return list of companies with job counts', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');
      await testService.createJob(admin.id, '2');

      const result = await service.getCompanies();

      expect(result.companies).toBeDefined();
      expect(Array.isArray(result.companies)).toBe(true);
      expect(result.companies.length).toBeGreaterThan(0);
      expect(result.companies[0]).toHaveProperty('name');
      expect(result.companies[0]).toHaveProperty('job_count');
      expect(result.companies[0]).toHaveProperty('latest_job');
    });

    it('should return empty list when no jobs exist', async () => {
      await testService.cleanDatabase();

      const result = await service.getCompanies();

      expect(result.companies).toBeDefined();
      expect(Array.isArray(result.companies)).toBe(true);
      expect(result.companies.length).toBe(0);
    });
  });

  describe('getLocations', () => {
    it('should return list of locations with job counts', async () => {
      await testService.cleanDatabase();
      const admin = await testService.createAdmin();
      await testService.createJob(admin.id, '1');
      await testService.createJob(admin.id, '2');

      const result = await service.getLocations();

      expect(result.locations).toBeDefined();
      expect(Array.isArray(result.locations)).toBe(true);
      expect(result.locations.length).toBeGreaterThan(0);
      expect(result.locations[0]).toHaveProperty('location');
      expect(result.locations[0]).toHaveProperty('job_count');
    });

    it('should return empty list when no jobs exist', async () => {
      await testService.cleanDatabase();

      const result = await service.getLocations();

      expect(result.locations).toBeDefined();
      expect(Array.isArray(result.locations)).toBe(true);
      expect(result.locations.length).toBe(0);
    });
  });
});
