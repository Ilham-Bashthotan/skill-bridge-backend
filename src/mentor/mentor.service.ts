import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { UpdateMentorStatusDto } from './dto/update-mentor-status.dto';

@Injectable()
export class MentorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboard(mentorId: number) {
    // Get assigned courses count
    const assignedCoursesCount = await this.prismaService.courseMentor.count({
      where: { mentorId },
    });

    // Get total unique students across all assigned courses
    const courseMentorships = await this.prismaService.courseMentor.findMany({
      where: { mentorId },
      select: { courseId: true },
    });

    const courseIds = courseMentorships.map((cm) => cm.courseId);

    let totalStudents = 0;
    if (courseIds.length > 0) {
      const uniqueStudents = await this.prismaService.courseProgress.groupBy({
        by: ['studentId'],
        where: {
          courseMaterial: {
            courseId: { in: courseIds },
          },
        },
      });
      totalStudents = uniqueStudents.length;
    }

    // Get active consultations count (questions without answers)
    const activeConsultations =
      await this.prismaService.consultationQuestion.count({
        where: {
          answers: {
            none: {},
          },
        },
      });

    // Get forum answers given count by this mentor
    const forumAnswersGiven = await this.prismaService.forumAnswer.count({
      where: { userId: mentorId },
    });

    return {
      assigned_courses: assignedCoursesCount,
      total_students: totalStudents,
      active_consultations: activeConsultations,
      forum_answers_given: forumAnswersGiven,
    };
  }

  async getProfile(mentorId: number) {
    const mentor = await this.prismaService.user.findUnique({
      where: { id: mentorId, role: 'mentor' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        bio: true,
        experience: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor profile not found');
    }

    return {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      phone: mentor.phone,
      role: mentor.role,
      bio: mentor.bio,
      experience: mentor.experience,
      email_verified: mentor.emailVerified,
      created_at: mentor.createdAt,
      updated_at: mentor.updatedAt,
    };
  }

  async updateProfile(mentorId: number, updateData: UpdateMentorProfileDto) {
    // Verify mentor exists
    const mentor = await this.prismaService.user.findUnique({
      where: { id: mentorId, role: 'mentor' },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor profile not found');
    }

    const updatedMentor = await this.prismaService.user.update({
      where: { id: mentorId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        bio: true,
        experience: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Mentor profile updated successfully',
      user: updatedMentor,
    };
  }

  async getAssignedCourses(mentorId: number) {
    const courseMentorships = await this.prismaService.courseMentor.findMany({
      where: { mentorId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    // Get student counts for each course
    const coursesWithCounts = await Promise.all(
      courseMentorships.map(async (cm) => {
        const uniqueStudents = await this.prismaService.courseProgress.groupBy({
          by: ['studentId'],
          where: {
            courseMaterial: {
              courseId: cm.courseId,
            },
          },
        });

        return {
          id: cm.course.id,
          title: cm.course.title,
          description: cm.course.description,
          students_enrolled: uniqueStudents.length,
          assigned_at: cm.createdAt,
        };
      }),
    );

    return {
      courses: coursesWithCounts,
    };
  }

  async getCourseDetails(mentorId: number, courseId: number) {
    const courseMentorship = await this.prismaService.courseMentor.findFirst({
      where: { courseId, mentorId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!courseMentorship) {
      throw new NotFoundException('Course not found or not assigned');
    }

    // Get student count for this course
    const uniqueStudents = await this.prismaService.courseProgress.groupBy({
      by: ['studentId'],
      where: {
        courseMaterial: {
          courseId,
        },
      },
    });

    // Get materials count
    const materialsCount = await this.prismaService.courseMaterial.count({
      where: { courseId },
    });

    return {
      id: courseMentorship.course.id,
      title: courseMentorship.course.title,
      description: courseMentorship.course.description,
      students_enrolled: uniqueStudents.length,
      materials_count: materialsCount,
      assigned_at: courseMentorship.createdAt,
    };
  }

  async getCourseStudents(mentorId: number, courseId: number) {
    // Verify mentor is assigned to course
    const courseMentor = await this.prismaService.courseMentor.findFirst({
      where: { courseId, mentorId },
    });

    if (!courseMentor) {
      throw new NotFoundException('Course not found or not assigned');
    }

    // Get unique students enrolled in this course
    const courseProgressRecords =
      await this.prismaService.courseProgress.findMany({
        where: {
          courseMaterial: {
            courseId,
          },
        },
        select: {
          studentId: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        distinct: ['studentId'],
      });

    return {
      students: courseProgressRecords.map((record) => ({
        id: record.student.id,
        name: record.student.name,
        email: record.student.email,
        enrolled_at: record.createdAt,
      })),
    };
  }

  async getCourseMaterials(mentorId: number, courseId: number) {
    // Verify mentor is assigned to course
    const courseMentor = await this.prismaService.courseMentor.findFirst({
      where: { courseId, mentorId },
    });

    if (!courseMentor) {
      throw new NotFoundException('Course not found or not assigned');
    }

    const materials = await this.prismaService.courseMaterial.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      materials: materials.map((material) => ({
        id: material.id,
        title: material.title,
        created_at: material.createdAt,
        updated_at: material.updatedAt,
      })),
    };
  }

  async createCourseMaterial(
    mentorId: number,
    courseId: number,
    createData: CreateMaterialDto,
  ) {
    // Verify mentor is assigned to course
    const courseMentor = await this.prismaService.courseMentor.findFirst({
      where: { courseId, mentorId },
    });

    if (!courseMentor) {
      throw new NotFoundException('Course not found or not assigned');
    }

    const material = await this.prismaService.courseMaterial.create({
      data: {
        courseId,
        title: createData.title,
        content: createData.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        courseId: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Course material created successfully',
      material: {
        id: material.id,
        course_id: material.courseId,
        title: material.title,
        created_at: material.createdAt,
        updated_at: material.updatedAt,
      },
    };
  }

  async updateCourseMaterial(
    mentorId: number,
    courseId: number,
    materialId: number,
    updateData: UpdateMaterialDto,
  ) {
    // Verify mentor is assigned to course
    const courseMentor = await this.prismaService.courseMentor.findFirst({
      where: { courseId, mentorId },
    });

    if (!courseMentor) {
      throw new NotFoundException('Course not found or not assigned');
    }

    // Verify material exists and belongs to course
    const existingMaterial = await this.prismaService.courseMaterial.findFirst({
      where: { id: materialId, courseId },
    });

    if (!existingMaterial) {
      throw new NotFoundException('Material not found');
    }

    const material = await this.prismaService.courseMaterial.update({
      where: { id: materialId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        courseId: true,
        title: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Course material updated successfully',
      material: {
        id: material.id,
        course_id: material.courseId,
        title: material.title,
        updated_at: material.updatedAt,
      },
    };
  }

  async deleteCourseMaterial(
    mentorId: number,
    courseId: number,
    materialId: number,
  ) {
    // Verify mentor is assigned to course
    const courseMentor = await this.prismaService.courseMentor.findFirst({
      where: { courseId, mentorId },
    });

    if (!courseMentor) {
      throw new NotFoundException('Course not found or not assigned');
    }

    // Verify material exists and belongs to course
    const existingMaterial = await this.prismaService.courseMaterial.findFirst({
      where: { id: materialId, courseId },
    });

    if (!existingMaterial) {
      throw new NotFoundException('Material not found');
    }

    // Check if material has student progress
    const hasProgress = await this.prismaService.courseProgress.findFirst({
      where: {
        courseMaterialId: materialId,
      },
    });

    if (hasProgress) {
      throw new ForbiddenException(
        'Cannot delete material with student progress',
      );
    }

    await this.prismaService.courseMaterial.delete({
      where: { id: materialId },
    });

    return {
      message: 'Course material deleted successfully',
    };
  }

  async getStudentProgress(mentorId: number, studentId: number) {
    // Get student info
    const student = await this.prismaService.user.findUnique({
      where: { id: studentId, role: 'student' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get courses where mentor is assigned
    const mentorCourses = await this.prismaService.courseMentor.findMany({
      where: { mentorId },
      select: { courseId: true },
    });

    const courseIds = mentorCourses.map((cm) => cm.courseId);

    if (courseIds.length === 0) {
      throw new NotFoundException(
        "Student not found or not in mentor's courses",
      );
    }

    // Check if student has any progress in mentor's courses
    const studentProgress = await this.prismaService.courseProgress.findFirst({
      where: {
        studentId,
        courseMaterial: {
          courseId: {
            in: courseIds,
          },
        },
      },
    });

    if (!studentProgress) {
      throw new NotFoundException(
        "Student not found or not in mentor's courses",
      );
    }

    const coursesProgress = await Promise.all(
      courseIds.map(async (courseId) => {
        // Get course info
        const course = await this.prismaService.course.findUnique({
          where: { id: courseId },
          select: { id: true, title: true },
        });

        if (!course) return null;

        // Check if student has any progress in this specific course
        const hasProgressInCourse =
          await this.prismaService.courseProgress.findFirst({
            where: {
              studentId,
              courseMaterial: {
                courseId,
              },
            },
          });

        // Only include courses where student has progress
        if (!hasProgressInCourse) return null;

        // Get total materials for this course
        const totalMaterials = await this.prismaService.courseMaterial.count({
          where: { courseId },
        });

        // Get completed materials for this student in this course
        const completedMaterials =
          await this.prismaService.courseProgress.count({
            where: {
              studentId,
              completed: true,
              courseMaterial: {
                courseId,
              },
            },
          });

        // Get last activity
        const lastActivity = await this.prismaService.courseProgress.findFirst({
          where: {
            studentId,
            courseMaterial: {
              courseId,
            },
          },
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true },
        });

        return {
          course_id: course.id,
          course_title: course.title,
          materials_completed: completedMaterials,
          total_materials: totalMaterials,
          last_activity: lastActivity?.updatedAt || null,
        };
      }),
    );

    const validCoursesProgress = coursesProgress.filter((cp) => cp !== null);

    return {
      student,
      courses_progress: validCoursesProgress,
    };
  }

  async updateStatus(mentorId: number, updateData: UpdateMentorStatusDto) {
    // Verify mentor exists
    const mentor = await this.prismaService.user.findUnique({
      where: { id: mentorId, role: 'mentor' },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor profile not found');
    }

    const updatedMentor = await this.prismaService.user.update({
      where: { id: mentorId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        bio: true,
        experience: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Mentor profile updated successfully',
      user: updatedMentor,
    };
  }
}
