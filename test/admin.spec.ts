import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AdminService } from '../src/admin/admin.service';
import { PrismaService } from '../src/common/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('AdminService', () => {
  let service: AdminService;

  const mockPrismaService = {
    user: {
      count: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    course: {
      count: jest.fn(),
    },
    job: {
      count: jest.fn(),
    },
    forumQuestion: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);

    jest.clearAllMocks();
  });

  describe('GET /admins/dashboard', () => {
    it('should return dashboard statistics', async () => {
      mockPrismaService.user.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(60)
        .mockResolvedValueOnce(25)
        .mockResolvedValueOnce(15);

      mockPrismaService.course.count.mockResolvedValue(50);
      mockPrismaService.job.count.mockResolvedValue(30);
      mockPrismaService.forumQuestion.count.mockResolvedValue(200);

      const result = await service.getDashboard();

      expect(result).toEqual({
        users_count: 100,
        students_count: 60,
        mentors_count: 25,
        admins_count: 15,
        courses_count: 50,
        jobs_count: 30,
        forum_questions: 200,
      });
    });
  });

  describe('GET /admins/profile', () => {
    it('should return admin profile', async () => {
      const mockAdmin = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1234567890',
        role: Role.admin,
        bio: 'Admin bio',
        experience: 'Admin experience',
        emailVerified: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.getProfile(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Admin User');
      expect(result.email).toBe('admin@example.com');
    });

    it('should throw NotFoundException when admin not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('PUT /admins/profile', () => {
    it('should update admin profile successfully', async () => {
      const existingAdmin = {
        id: 1,
        name: 'Old Admin Name',
        phone: '+1234567890',
        bio: 'Old bio',
        experience: 'Old experience',
        role: Role.admin,
        emailVerified: true,
      };

      const updatedAdmin = {
        id: 1,
        name: 'Updated Admin Name',
        phone: '+1234567891',
        bio: 'Updated bio',
        experience: 'Updated experience',
        role: Role.admin,
        emailVerified: true,
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingAdmin);
      mockPrismaService.user.update.mockResolvedValue(updatedAdmin);

      const updateDto = {
        name: 'Updated Admin Name',
        phone: '+1234567891',
        bio: 'Updated bio',
        experience: 'Updated experience',
      };

      const result = await service.updateProfile(1, updateDto);

      expect(result.message).toBe('Profile updated successfully');
      expect(result.user.name).toBe('Updated Admin Name');
      expect(result.user.bio).toBe('Updated bio');
    });

    it('should throw NotFoundException when admin not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const updateDto = {
        name: 'Updated Admin Name',
        phone: '+1234567891',
      };

      await expect(service.updateProfile(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('GET /admins/users', () => {
    it('should return users list with pagination', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          role: Role.student,
          emailVerified: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      mockPrismaService.user.count.mockResolvedValue(50);
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const query = { page: 1, limit: 10 };
      const result = await service.getUsers(query);

      expect(result.users).toHaveLength(1);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total_pages).toBe(5);
    });
  });

  describe('GET /admins/users/:userId', () => {
    it('should return user details', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: Role.student,
        bio: null,
        experience: null,
        emailVerified: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /admins/users/:userId', () => {
    it('should delete user successfully', async () => {
      const existingUser = {
        id: 1,
        role: Role.student,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.delete.mockResolvedValue(existingUser);

      const result = await service.deleteUser(1);

      expect(result.message).toBe('User deleted successfully');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST /admins/create-admin', () => {
    it('should create a new admin successfully', async () => {
      const createAdminDto = {
        name: 'New Admin',
        email: 'newadmin@example.com',
        phone: '+1234567890',
        password: 'password123',
      };

      const createdAdmin = {
        id: 1,
        name: 'New Admin',
        email: 'newadmin@example.com',
        password: 'hashedPassword',
        phone: '+1234567890',
        role: Role.admin,
        bio: null,
        experience: null,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(createdAdmin);

      const result = await service.createAdmin(createAdminDto);

      expect(result.message).toBe('Admin created successfully');
      expect(result.user.role).toBe(Role.admin);
      expect(result.user.id).toBe(1);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createAdminDto = {
        name: 'New Admin',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.createAdmin(createAdminDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('POST /admins/create-mentor', () => {
    it('should create a new mentor successfully', async () => {
      const createMentorDto = {
        name: 'New Mentor',
        email: 'newmentor@example.com',
        phone: '+1234567890',
        password: 'password123',
        bio: 'Experienced developer',
        experience: '5 years',
      };

      const createdMentor = {
        id: 2,
        name: 'New Mentor',
        email: 'newmentor@example.com',
        password: 'hashedPassword',
        phone: '+1234567890',
        role: Role.mentor,
        bio: 'Experienced developer',
        experience: '5 years',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(createdMentor);

      const result = await service.createMentor(createMentorDto);

      expect(result.message).toBe('Mentor created successfully');
      expect(result.user.role).toBe(Role.mentor);
      expect(result.user.id).toBe(2);
      expect(result.user.bio).toBe('Experienced developer');
    });

    it('should throw ConflictException when email already exists', async () => {
      const createMentorDto = {
        name: 'New Mentor',
        email: 'existing@example.com',
        password: 'password123',
        bio: 'Experienced developer',
        experience: '5 years',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.createMentor(createMentorDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
