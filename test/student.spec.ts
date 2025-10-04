import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { StudentService } from '../src/student/student.service';
import { ErrorFilter } from '../src/common/error.filter';

describe('StudentService', () => {
  let app: INestApplication;
  let testService: TestService;
  let studentService: StudentService;
  let studentId: number;
  let courseId: number;
  let materialId: number;
  let mentorId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ErrorFilter());

    // Add validation pipe to test app
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    testService = app.get(TestService);
    studentService = app.get(StudentService);

    // Clean database and create test data
    await testService.cleanDatabase();

    // Create student
    const student = await testService.createStudent('-test');
    studentId = student.id;

    // Create mentor
    const mentor = await testService.createMentor('-test');
    mentorId = mentor.id;

    // Create course and assign mentor
    const course = await testService.createCourse();
    courseId = course.id;
    await testService.assignMentorToCourse(mentorId, courseId);

    // Create course material
    const material = await testService.createCourseMaterial(courseId);
    materialId = material.id;
  });

  afterEach(async () => {
    await testService.cleanDatabase();
    await app.close();
  });

  describe('GET /students/dashboard', () => {
    it('should return dashboard data for student with no activity', async () => {
      const result = await studentService.getDashboard(studentId);

      expect(result).toEqual({
        enrolled_courses: 0,
        completed_courses: 0,
        certificates_earned: 0,
        active_consultations: 0,
        forum_questions_asked: 0,
      });
    });

    it('should return dashboard data for student with activity', async () => {
      // Enroll student in course
      await testService.createCourseProgress(studentId, materialId);

      const result = await studentService.getDashboard(studentId);

      expect(result).toMatchObject({
        enrolled_courses: 1,
        completed_courses: 0,
        certificates_earned: 0,
        active_consultations: 0,
        forum_questions_asked: 0,
      });
    });

    it('should throw error for non-existent student', async () => {
      await expect(studentService.getDashboard(99999)).rejects.toThrow(
        'Student not found',
      );
    });
  });

  // describe('GET /students/profile', () => {
  //   it('should return student profile', async () => {
  //     const result = await studentService.getProfile(studentId);

  //     expect(result).toMatchObject({
  //       id: studentId,
  //       name: 'Test Student',
  //       email: 'student-test@example.com',
  //       role: 'student',
  //       email_verified: false,
  //     });
  //     expect(result).toHaveProperty('created_at');
  //     expect(result).toHaveProperty('updated_at');
  //   });

  //   it('should throw error for non-existent student', async () => {
  //     await expect(studentService.getProfile(99999)).rejects.toThrow(
  //       'Student profile not found',
  //     );
  //   });
  // });

  // describe('PUT /students/profile', () => {
  //   it('should update student profile successfully', async () => {
  //     const updateData = {
  //       name: 'Updated Student',
  //       phone: '08123456789',
  //       bio: 'Updated bio',
  //       experience: 'Updated experience',
  //     };

  //     const result = await studentService.updateProfile(studentId, updateData);

  //     expect(result).toMatchObject({
  //       message: 'Student profile updated successfully',
  //       user: {
  //         id: studentId,
  //         bio: 'Updated bio',
  //         experience: 'Updated experience',
  //       },
  //     });
  //     expect(result.user).toHaveProperty('updatedAt');
  //   });

  //   it('should update student profile with partial data', async () => {
  //     const updateData = {
  //       bio: 'Only bio updated',
  //     };

  //     const result = await studentService.updateProfile(studentId, updateData);

  //     expect(result).toMatchObject({
  //       message: 'Student profile updated successfully',
  //       user: {
  //         id: studentId,
  //         bio: 'Only bio updated',
  //       },
  //     });
  //   });

  //   it('should throw error for non-existent student', async () => {
  //     const updateData = { bio: 'Test bio' };

  //     await expect(
  //       studentService.updateProfile(99999, updateData),
  //     ).rejects.toThrow('Student profile not found');
  //   });
  // });

  describe('GET /students/courses', () => {
    it('should return courses with default pagination', async () => {
      const query = {};
      const result = await studentService.getCourses(studentId, query);

      expect(result).toMatchObject({
        courses: [
          {
            id: courseId,
            title: 'Test Course',
            description: 'Test course description',
            is_enrolled: false,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          total_pages: 1,
        },
      });
    });

    it('should return courses with custom pagination', async () => {
      const query = { page: 1, limit: 5 };
      const result = await studentService.getCourses(studentId, query);

      expect(result.pagination).toMatchObject({
        page: 1,
        limit: 5,
        total: 1,
        total_pages: 1,
      });
    });

    it('should return courses with search filter', async () => {
      const query = { search: 'Test' };
      const result = await studentService.getCourses(studentId, query);

      expect(result.courses).toHaveLength(1);
      expect(result.courses[0].title).toContain('Test');
    });

    it('should return empty result for non-matching search', async () => {
      const query = { search: 'NonExistent' };
      const result = await studentService.getCourses(studentId, query);

      expect(result.courses).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should show enrollment status correctly', async () => {
      // Enroll student in course
      await testService.createCourseProgress(studentId, materialId);

      const query = {};
      const result = await studentService.getCourses(studentId, query);

      expect(result.courses[0].is_enrolled).toBe(true);
    });
  });

  describe('GET /students/courses/enrolled', () => {
    it('should return empty array when no courses enrolled', async () => {
      const result = await studentService.getEnrolledCourses(studentId);

      expect(result).toEqual({
        courses: [],
      });
    });

    it('should return enrolled courses', async () => {
      // Enroll student in course
      await testService.createCourseProgress(studentId, materialId);

      const result = await studentService.getEnrolledCourses(studentId);

      expect(result.courses).toHaveLength(1);
      expect(result.courses[0]).toMatchObject({
        id: courseId,
        title: 'Test Course',
        description: 'Test course description',
        is_completed: false,
      });
      expect(result.courses[0]).toHaveProperty('enrolled_at');
    });
  });

  describe('POST /students/courses/:courseId/enroll', () => {
    it('should enroll student in course successfully', async () => {
      const result = await studentService.enrollInCourse(studentId, courseId);

      expect(result).toMatchObject({
        message: 'Successfully enrolled in course',
        enrollment: {
          course_id: courseId,
          user_id: studentId,
        },
      });
      expect(result.enrollment).toHaveProperty('enrolled_at');
    });

    it('should throw error when course not found', async () => {
      await expect(
        studentService.enrollInCourse(studentId, 99999),
      ).rejects.toThrow('Course not found');
    });

    it('should throw error when already enrolled', async () => {
      // First enrollment
      await studentService.enrollInCourse(studentId, courseId);

      // Second enrollment should fail
      await expect(
        studentService.enrollInCourse(studentId, courseId),
      ).rejects.toThrow('Already enrolled in this course');
    });

    it('should throw error when course has no materials', async () => {
      // Create course without materials
      const emptyCourse = await testService.createCourse();

      await expect(
        studentService.enrollInCourse(studentId, emptyCourse.id),
      ).rejects.toThrow('Course has no materials available');
    });
  });

  describe('GET /students/courses/:courseId', () => {
    it('should return course details for non-enrolled student', async () => {
      const result = await studentService.getCourseDetails(studentId, courseId);

      expect(result).toMatchObject({
        id: courseId,
        title: 'Test Course',
        description: 'Test course description',
        is_enrolled: false,
        is_completed: false,
        materials_count: 1,
        completed_materials: 0,
      });
    });

    it('should return course details for enrolled student', async () => {
      // Enroll student
      await testService.createCourseProgress(studentId, materialId);

      const result = await studentService.getCourseDetails(studentId, courseId);

      expect(result).toMatchObject({
        id: courseId,
        is_enrolled: true,
        is_completed: false,
        materials_count: 1,
        completed_materials: 0,
      });
    });

    it('should throw error for non-existent course', async () => {
      await expect(
        studentService.getCourseDetails(studentId, 99999),
      ).rejects.toThrow('Course not found');
    });
  });

  describe('GET /students/courses/:courseId/materials', () => {
    it('should return materials for enrolled student', async () => {
      // Enroll student
      await testService.createCourseProgress(studentId, materialId);

      const result = await studentService.getCourseMaterials(
        studentId,
        courseId,
      );

      expect(result).toMatchObject({
        materials: [
          {
            id: materialId,
            title: 'Test Material',
            is_completed: false,
          },
        ],
      });
      expect(result.materials[0]).toHaveProperty('created_at');
      expect(result.materials[0]).toHaveProperty('updated_at');
    });

    it('should throw error for non-existent course', async () => {
      await expect(
        studentService.getCourseMaterials(studentId, 99999),
      ).rejects.toThrow('Course not found or not enrolled');
    });

    it('should throw error for non-enrolled student', async () => {
      await expect(
        studentService.getCourseMaterials(studentId, courseId),
      ).rejects.toThrow('Course not found or not enrolled');
    });
  });

  describe('PUT /students/courses/:courseId/materials/:materialId/progress', () => {
    beforeEach(async () => {
      // Enroll student in course
      await testService.createCourseProgress(studentId, materialId);
    });

    it('should update material progress to completed', async () => {
      const updateData = { completed: true };

      const result = await studentService.updateMaterialProgress(
        studentId,
        courseId,
        materialId,
        updateData,
      );

      expect(result).toMatchObject({
        message: 'Progress updated successfully',
        progress: {
          material_id: materialId,
          completed: true,
        },
      });
      expect(result.progress).toHaveProperty('updated_at');
    });

    it('should update material progress to not completed', async () => {
      const updateData = { completed: false };

      const result = await studentService.updateMaterialProgress(
        studentId,
        courseId,
        materialId,
        updateData,
      );

      expect(result).toMatchObject({
        message: 'Progress updated successfully',
        progress: {
          material_id: materialId,
          completed: false,
        },
      });
    });

    it('should throw error for non-existent material', async () => {
      const updateData = { completed: true };

      await expect(
        studentService.updateMaterialProgress(
          studentId,
          courseId,
          99999,
          updateData,
        ),
      ).rejects.toThrow('Material not found in this course');
    });

    it('should throw error for material not in course', async () => {
      // Create another course and material
      const anotherCourse = await testService.createCourse();
      const anotherMaterial = await testService.createCourseMaterial(
        anotherCourse.id,
      );

      const updateData = { completed: true };

      await expect(
        studentService.updateMaterialProgress(
          studentId,
          courseId,
          anotherMaterial.id,
          updateData,
        ),
      ).rejects.toThrow('Material not found in this course');
    });

    it('should throw error for non-enrolled student', async () => {
      // Create another student
      const anotherStudent = await testService.createStudent('-other');

      const updateData = { completed: true };

      await expect(
        studentService.updateMaterialProgress(
          anotherStudent.id,
          courseId,
          materialId,
          updateData,
        ),
      ).rejects.toThrow('Progress record not found');
    });
  });

  describe('GET /students/certificates', () => {
    it('should return empty certificates for student with no certificates', async () => {
      const result = await studentService.getCertificates(studentId);

      expect(result).toEqual({
        certificates: [],
      });
    });
  });

  describe('GET /students/certificates', () => {
    it('should throw error for non-existent certificate', async () => {
      await expect(
        studentService.getCertificateById(studentId, 99999),
      ).rejects.toThrow('Certificate not found');
    });
  });
});
