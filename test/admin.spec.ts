import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
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

  describe('getDashboard', () => {
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

  describe('getProfile', () => {
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

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        phone: '+1234567890',
        role: Role.student,
      };

      const createdUser = {
        id: 1,
        name: 'New User',
        email: 'newuser@example.com',
        password: 'hashedPassword',
        phone: '+1234567890',
        role: Role.student,
        bio: null,
        experience: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.createUser(createUserDto);

      expect(result.message).toBe('User created successfully');
      expect(result.user.id).toBe(1);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        role: Role.student,
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const existingUser = {
        id: 1,
        role: Role.student,
        emailVerified: false,
      };

      const updatedUser = {
        id: 1,
        role: Role.mentor,
        emailVerified: true,
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUserRole(1, { role: Role.mentor });

      expect(result.message).toBe('User role updated successfully');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserRole(999, { role: Role.mentor }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
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
});
