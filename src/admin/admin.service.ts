import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Role } from '@prisma/client';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import {
  AdminDashboardResponse,
  AdminProfileResponse,
  UpdateAdminProfileResponse,
  UserListResponse,
  CreateUserResponse,
  DeleteUserResponse,
} from '../model/admin-response.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(): Promise<AdminDashboardResponse> {
    const [
      usersCount,
      studentsCount,
      mentorsCount,
      adminsCount,
      coursesCount,
      jobsCount,
      forumQuestionsCount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.student } }),
      this.prisma.user.count({ where: { role: Role.mentor } }),
      this.prisma.user.count({ where: { role: Role.admin } }),
      this.prisma.course.count(),
      this.prisma.job.count(),
      this.prisma.forumQuestion.count(),
    ]);

    return {
      users_count: usersCount,
      students_count: studentsCount,
      mentors_count: mentorsCount,
      admins_count: adminsCount,
      courses_count: coursesCount,
      jobs_count: jobsCount,
      forum_questions: forumQuestionsCount,
    };
  }

  async getProfile(adminId: number): Promise<AdminProfileResponse> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id: adminId,
        role: Role.admin,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone ?? undefined,
      role: admin.role,
      bio: admin.bio ?? undefined,
      experience: admin.experience ?? undefined,
      email_verified: admin.emailVerified,
      created_at: admin.createdAt,
      updated_at: admin.updatedAt,
    };
  }

  async updateProfile(
    adminId: number,
    dto: UpdateAdminProfileDto,
  ): Promise<UpdateAdminProfileResponse> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id: adminId,
        role: Role.admin,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const updatedAdmin = await this.prisma.user.update({
      where: { id: adminId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.bio && { bio: dto.bio }),
        ...(dto.experience && { experience: dto.experience }),
      },
    });

    return {
      message: 'Profile updated successfully',
      user: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        phone: updatedAdmin.phone ?? undefined,
        bio: updatedAdmin.bio ?? undefined,
        experience: updatedAdmin.experience ?? undefined,
        updated_at: updatedAdmin.updatedAt,
      },
    };
  }

  async getUsers(query: GetUsersQueryDto): Promise<UserListResponse> {
    const { page = 1, limit = 10, role } = query;

    const skip = (page - 1) * limit;

    const where: { role?: Role } = {};

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        role: user.role,
        email_verified: user.emailVerified,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    };
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
      role: user.role,
      bio: user.bio ?? undefined,
      experience: user.experience ?? undefined,
      email_verified: user.emailVerified,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  async createAdmin(dto: CreateAdminDto): Promise<CreateUserResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const admin = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        role: Role.admin,
        bio: dto.bio,
        experience: dto.experience,
        emailVerified: true, // Admins don't need email verification
      },
    });

    return {
      message: 'Admin created successfully',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone ?? undefined,
        role: admin.role,
        bio: admin.bio ?? undefined,
        experience: admin.experience ?? undefined,
        email_verified: admin.emailVerified,
        created_at: admin.createdAt,
        updated_at: admin.updatedAt,
      },
    };
  }

  async createMentor(dto: CreateMentorDto): Promise<CreateUserResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const mentor = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        role: Role.mentor,
        bio: dto.bio,
        experience: dto.experience,
        emailVerified: true, // Mentors don't need email verification
      },
    });

    return {
      message: 'Mentor created successfully',
      user: {
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        phone: mentor.phone ?? undefined,
        role: mentor.role,
        bio: mentor.bio ?? undefined,
        experience: mentor.experience ?? undefined,
        email_verified: mentor.emailVerified,
        created_at: mentor.createdAt,
        updated_at: mentor.updatedAt,
      },
    };
  }

  async deleteUser(userId: number): Promise<DeleteUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting the last admin
    if (user.role === Role.admin) {
      const adminCount = await this.prisma.user.count({
        where: { role: Role.admin },
      });

      if (adminCount <= 1) {
        throw new BadRequestException('Cannot delete the last admin');
      }
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}
