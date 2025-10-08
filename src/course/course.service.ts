import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCoursesQueryDto } from './dto/get-courses-query.dto';
import { AssignMentorDto } from './dto/assign-mentor.dto';
import { GetStudentsQueryDto } from './dto/get-students-query.dto';
import { JwtPayload } from '../common/types';
import { Role } from '../common/roles.enum';

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = await this.prismaService.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
      },
    });

    return course;
  }

  async findAll(query: GetCoursesQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const courses = await this.prismaService.course.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prismaService.course.count();

    return {
      data: courses,
      paging: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const updatedCourse = await this.prismaService.course.update({
      where: { id },
      data: {
        ...(updateCourseDto.title && { title: updateCourseDto.title }),
        ...(updateCourseDto.description && {
          description: updateCourseDto.description,
        }),
      },
    });

    return updatedCourse;
  }

  async remove(id: number) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.prismaService.course.delete({
      where: { id },
    });
  }

  async assignMentor(id: number, assignMentorDto: AssignMentorDto) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      id: 1,
      course_id: id,
      mentor_id: assignMentorDto.mentor_id,
      message: 'Mentor assigned successfully',
    };
  }

  async removeMentor(id: number, mentorId: number) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return { message: `Mentor ${mentorId} removed from course ${id}` };
  }

  async enroll(id: number, user: JwtPayload) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      id: 1,
      course_id: id,
      student_id: user.sub,
      message: 'Successfully enrolled',
    };
  }

  async unenroll(id: number, user: JwtPayload) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      message: 'Successfully unenrolled',
      student_id: user.sub,
    };
  }

  async getStudents(id: number, query: GetStudentsQueryDto, user: JwtPayload) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is mentor of this course (for mentor role)
    if (user.role === Role.MENTOR) {
      // Add mentor authorization logic here if needed
    }

    const page = query.page || 1;
    const limit = query.limit || 10;

    return {
      data: [],
      paging: {
        page,
        limit,
        total: 0,
        total_pages: 0,
      },
    };
  }
}
