import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { GetCoursesQueryDto } from './dto/get-courses-query.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboard(studentId: number) {
    // Check if student exists
    const student = await this.prismaService.user.findUnique({
      where: { id: studentId, role: 'student' },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get enrolled courses - courses where student has progress
    const enrolledCourses = await this.prismaService.courseProgress.findMany({
      where: { studentId },
      select: {
        courseMaterial: {
          select: { courseId: true },
        },
      },
      distinct: ['courseMaterialId'],
    });

    const uniqueCourseIds = [
      ...new Set(enrolledCourses.map((cp) => cp.courseMaterial.courseId)),
    ];

    // Count completed courses
    let completedCoursesCount = 0;
    for (const courseId of uniqueCourseIds) {
      const totalMaterials = await this.prismaService.courseMaterial.count({
        where: { courseId },
      });

      const completedMaterials = await this.prismaService.courseProgress.count({
        where: {
          studentId,
          completed: true,
          courseMaterial: { courseId },
        },
      });

      if (totalMaterials > 0 && completedMaterials === totalMaterials) {
        completedCoursesCount++;
      }
    }

    // Get certificates earned count
    const certificatesEarnedCount = await this.prismaService.certificate.count({
      where: { studentId },
    });

    // Get active consultations count (questions without answers)
    const activeConsultationsCount =
      await this.prismaService.consultationQuestion.count({
        where: {
          studentId,
          answers: {
            none: {},
          },
        },
      });

    // Get forum questions asked count
    const forumQuestionsAskedCount =
      await this.prismaService.forumQuestion.count({
        where: { studentId },
      });

    return {
      enrolled_courses: uniqueCourseIds.length,
      completed_courses: completedCoursesCount,
      certificates_earned: certificatesEarnedCount,
      active_consultations: activeConsultationsCount,
      forum_questions_asked: forumQuestionsAskedCount,
    };
  }

  async getCourses(studentId: number, query: GetCoursesQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: { title?: { contains: string; mode: 'insensitive' } } =
      {};
    if (search && search.trim()) {
      whereClause.title = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    // Get total count
    const total = await this.prismaService.course.count({
      where: whereClause,
    });

    // Get courses
    const courses = await this.prismaService.course.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Check enrollment status for each course
    const coursesWithEnrollment = await Promise.all(
      courses.map(async (course) => {
        const hasProgress = await this.prismaService.courseProgress.findFirst({
          where: {
            studentId,
            courseMaterial: { courseId: course.id },
          },
        });

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          is_enrolled: Boolean(hasProgress),
          created_at: course.createdAt,
          updated_at: course.updatedAt,
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      courses: coursesWithEnrollment,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    };
  }

  async getEnrolledCourses(studentId: number) {
    // Get courses where student has progress
    const enrolledCourses = await this.prismaService.courseProgress.findMany({
      where: {
        studentId,
        courseMaterial: {
          courseId: { not: undefined },
        },
      },
      select: {
        courseMaterial: {
          select: {
            courseId: true,
            course: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
        createdAt: true,
      },
      distinct: ['courseMaterialId'],
    });

    // Group by course and get earliest enrollment
    const courseMap = new Map<
      number,
      {
        id: number;
        title: string;
        description: string;
        enrolled_at: Date;
      }
    >();

    enrolledCourses.forEach((progress) => {
      const courseId = progress.courseMaterial.courseId;
      const course = progress.courseMaterial.course;

      if (
        !courseMap.has(courseId) ||
        progress.createdAt <
          (courseMap.get(courseId)?.enrolled_at ?? new Date())
      ) {
        courseMap.set(courseId, {
          id: course.id,
          title: course.title,
          description: course.description,
          enrolled_at: progress.createdAt,
        });
      }
    });

    // Check completion status for each course
    const coursesWithCompletion = await Promise.all(
      Array.from(courseMap.values()).map(async (course) => {
        const totalMaterials = await this.prismaService.courseMaterial.count({
          where: { courseId: course.id },
        });

        const completedMaterials =
          await this.prismaService.courseProgress.count({
            where: {
              studentId,
              completed: true,
              courseMaterial: { courseId: course.id },
            },
          });

        return {
          ...course,
          is_completed:
            totalMaterials > 0 && completedMaterials === totalMaterials,
        };
      }),
    );

    return {
      courses: coursesWithCompletion,
    };
  }

  async enrollInCourse(studentId: number, courseId: number) {
    // Check if course exists
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if already enrolled
    const existingProgress = await this.prismaService.courseProgress.findFirst({
      where: {
        studentId,
        courseMaterial: { courseId },
      },
    });

    if (existingProgress) {
      throw new BadRequestException('Already enrolled in this course');
    }

    // Get course materials
    const materials = await this.prismaService.courseMaterial.findMany({
      where: { courseId },
      select: { id: true },
    });

    if (materials.length === 0) {
      throw new BadRequestException('Course has no materials available');
    }

    // Create progress records for all materials
    const enrollmentDate = new Date();
    await this.prismaService.courseProgress.createMany({
      data: materials.map((material) => ({
        studentId,
        courseMaterialId: material.id,
        completed: false,
        createdAt: enrollmentDate,
        updatedAt: enrollmentDate,
      })),
    });

    return {
      message: 'Successfully enrolled in course',
      enrollment: {
        course_id: courseId,
        user_id: studentId,
        enrolled_at: enrollmentDate,
      },
    };
  }

  async getCourseDetails(studentId: number, courseId: number) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if enrolled
    const hasProgress = await this.prismaService.courseProgress.findFirst({
      where: {
        studentId,
        courseMaterial: { courseId },
      },
    });

    const isEnrolled = Boolean(hasProgress);

    // Get materials count
    const materialsCount = await this.prismaService.courseMaterial.count({
      where: { courseId },
    });

    // Get completed materials count
    const completedMaterials = await this.prismaService.courseProgress.count({
      where: {
        studentId,
        completed: true,
        courseMaterial: { courseId },
      },
    });

    const isCompleted =
      materialsCount > 0 && completedMaterials === materialsCount;

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      is_enrolled: isEnrolled,
      is_completed: isCompleted,
      materials_count: materialsCount,
      completed_materials: completedMaterials,
    };
  }

  async getCourseMaterials(studentId: number, courseId: number) {
    // Check if course exists
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found or not enrolled');
    }

    // Check if enrolled
    const hasProgress = await this.prismaService.courseProgress.findFirst({
      where: {
        studentId,
        courseMaterial: { courseId },
      },
    });

    if (!hasProgress) {
      throw new NotFoundException('Course not found or not enrolled');
    }

    // Get materials with progress
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

    // Get progress for each material
    const materialsWithProgress = await Promise.all(
      materials.map(async (material) => {
        const progress = await this.prismaService.courseProgress.findFirst({
          where: {
            studentId,
            courseMaterialId: material.id,
          },
          select: { completed: true },
        });

        return {
          id: material.id,
          title: material.title,
          is_completed: progress?.completed || false,
          created_at: material.createdAt,
          updated_at: material.updatedAt,
        };
      }),
    );

    return {
      materials: materialsWithProgress,
    };
  }

  async updateMaterialProgress(
    studentId: number,
    courseId: number,
    materialId: number,
    updateData: UpdateProgressDto,
  ) {
    // Check if material exists in the course
    const material = await this.prismaService.courseMaterial.findFirst({
      where: { id: materialId, courseId },
    });

    if (!material) {
      throw new NotFoundException('Material not found in this course');
    }

    // Check if student has progress record
    const progress = await this.prismaService.courseProgress.findFirst({
      where: {
        studentId,
        courseMaterialId: materialId,
      },
    });

    if (!progress) {
      throw new NotFoundException('Progress record not found');
    }

    // Update progress
    const updatedProgress = await this.prismaService.courseProgress.update({
      where: { id: progress.id },
      data: {
        completed: updateData.completed,
        updatedAt: new Date(),
      },
      select: {
        courseMaterialId: true,
        completed: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Progress updated successfully',
      progress: {
        material_id: updatedProgress.courseMaterialId,
        completed: updatedProgress.completed,
        updated_at: updatedProgress.updatedAt,
      },
    };
  }

  async getCertificates(studentId: number) {
    const certificates = await this.prismaService.certificate.findMany({
      where: { studentId },
      select: {
        id: true,
        certificateUrl: true,
        createdAt: true,
        updatedAt: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      certificates: certificates.map((cert) => ({
        id: cert.id,
        course: {
          id: cert.course.id,
          title: cert.course.title,
        },
        certificate_url: cert.certificateUrl,
        created_at: cert.createdAt,
        updated_at: cert.updatedAt,
      })),
    };
  }

  async getCertificateById(studentId: number, certificateId: number) {
    const certificate = await this.prismaService.certificate.findFirst({
      where: { id: certificateId, studentId },
      select: {
        id: true,
        certificateUrl: true,
        createdAt: true,
        updatedAt: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return {
      id: certificate.id,
      course: {
        id: certificate.course.id,
        title: certificate.course.title,
      },
      certificate_url: certificate.certificateUrl,
      created_at: certificate.createdAt,
      updated_at: certificate.updatedAt,
    };
  }
}
