import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { MentorService } from '../src/mentor/mentor.service';
import { ErrorFilter } from '../src/common/error.filter';

describe('MentorService', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let mentorService: MentorService;
  let mentorId: number;
  let courseId: number;
  let materialId: number;
  let studentId: number;

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

    logger = app.get('winston');
    testService = app.get(TestService);
    mentorService = app.get(MentorService);

    // Clean database and create test data
    await testService.cleanDatabase();

    // Create mentor
    const mentor = await testService.createMentor();
    mentorId = mentor.id;

    // Create course and assign mentor
    const course = await testService.createCourse();
    courseId = course.id;
    await testService.assignMentorToCourse(mentorId, courseId);

    // Create course material
    const material = await testService.createCourseMaterial(courseId);
    materialId = material.id;

    // Create student
    const student = await testService.createStudent();
    studentId = student.id;

    // Create course progress for student
    await testService.createCourseProgress(studentId, materialId);
  });

  afterEach(async () => {
    await testService.cleanDatabase();
    await app.close();
  });

  describe('GET /mentors/dashboard', () => {
    it('should get mentor dashboard', async () => {
      const result = await mentorService.getDashboard(mentorId);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.assigned_courses).toBeDefined();
      expect(result.total_students).toBeDefined();
      expect(result.active_consultations).toBeDefined();
      expect(result.forum_answers_given).toBeDefined();
      expect(typeof result.assigned_courses).toBe('number');
      expect(typeof result.total_students).toBe('number');
      expect(typeof result.active_consultations).toBe('number');
      expect(typeof result.forum_answers_given).toBe('number');
      expect(result.assigned_courses).toBeGreaterThanOrEqual(1);
    });

    it('should return zero counts for mentor with no assignments', async () => {
      const newMentor = await testService.createMentor('100');
      const result = await mentorService.getDashboard(newMentor.id);

      expect(result.assigned_courses).toBe(0);
      expect(result.total_students).toBe(0);
    });
  });

  describe('GET /mentors/profile', () => {
    it('should get mentor profile', async () => {
      const result = await mentorService.getProfile(mentorId);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.id).toBe(mentorId);
      expect(result.name).toBe('Test Mentor');
      expect(result.email).toBe('mentor@example.com');
      expect(result.role).toBe('mentor');
      expect(result.bio).toBe('Experienced programming mentor');
      expect(result.experience).toBe('5 years');
      expect(result.email_verified).toBeDefined();
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
    });

    it('should throw error for non-existent mentor', async () => {
      await expect(mentorService.getProfile(99999)).rejects.toThrow();
    });

    it('should throw error for user who is not a mentor', async () => {
      await expect(mentorService.getProfile(studentId)).rejects.toThrow();
    });
  });

  describe('PUT /mentors/rofile', () => {
    it('should update mentor profile', async () => {
      const updateData = {
        name: 'Updated Mentor Name',
        bio: 'Updated mentor bio with more experience',
        experience: '7 years',
        phone: '08123456789',
      };

      const result = await mentorService.updateProfile(mentorId, updateData);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.message).toBe('Mentor profile updated successfully');
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(mentorId);
      expect(result.user.bio).toBe(updateData.bio);
      expect(result.user.experience).toBe(updateData.experience);
      expect(result.user.updatedAt).toBeDefined();
    });

    it('should throw error for non-existent mentor', async () => {
      const updateData = {
        bio: 'Updated bio',
        experience: '7 years',
      };

      await expect(
        mentorService.updateProfile(99999, updateData),
      ).rejects.toThrow();
    });
  });

  describe('GET /mentors/courses/assigned', () => {
    it('should get assigned courses', async () => {
      const result = await mentorService.getAssignedCourses(mentorId);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.courses).toBeDefined();
      expect(Array.isArray(result.courses)).toBe(true);
      expect(result.courses.length).toBeGreaterThanOrEqual(1);

      const course = result.courses[0];
      expect(course.id).toBe(courseId);
      expect(course.title).toBe('Test Course');
      expect(course.description).toBe('Test course description');
      expect(course.students_enrolled).toBeDefined();
      expect(course.assigned_at).toBeDefined();
    });

    it('should return empty array for mentor with no assigned courses', async () => {
      const newMentor = await testService.createMentor('200');
      const result = await mentorService.getAssignedCourses(newMentor.id);

      expect(result.courses).toEqual([]);
    });
  });

  describe('GET /mentors/courses/:courseId', () => {
    it('should get course details', async () => {
      const result = await mentorService.getCourseDetails(mentorId, courseId);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.id).toBe(courseId);
      expect(result.title).toBe('Test Course');
      expect(result.description).toBe('Test course description');
      expect(result.students_enrolled).toBeDefined();
      expect(result.materials_count).toBeDefined();
      expect(result.assigned_at).toBeDefined();
    });

    it('should throw error for non-existent or unassigned course', async () => {
      await expect(
        mentorService.getCourseDetails(mentorId, 99999),
      ).rejects.toThrow();
    });

    it('should throw error for course not assigned to mentor', async () => {
      const newMentor = await testService.createMentor('300');
      await expect(
        mentorService.getCourseDetails(newMentor.id, courseId),
      ).rejects.toThrow();
    });
  });

  describe('GET /mentors/courses/:courseId/students', () => {
    it('should get course students', async () => {
      const result = await mentorService.getCourseStudents(mentorId, courseId);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.students).toBeDefined();
      expect(Array.isArray(result.students)).toBe(true);
      expect(result.students.length).toBeGreaterThanOrEqual(1);

      const student = result.students[0];
      expect(student.id).toBe(studentId);
      expect(student.name).toBe('Test Student');
      expect(student.email).toBe('student@example.com');
      expect(student.enrolled_at).toBeDefined();
    });

    it('should throw error for non-existent or unassigned course', async () => {
      await expect(
        mentorService.getCourseStudents(mentorId, 99999),
      ).rejects.toThrow();
    });
  });

  describe('GET /mentors/courses/:courseId/materials', () => {
    it('should get course materials', async () => {
      const result = await mentorService.getCourseMaterials(mentorId, courseId);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.materials).toBeDefined();
      expect(Array.isArray(result.materials)).toBe(true);
      expect(result.materials.length).toBeGreaterThanOrEqual(1);

      const material = result.materials[0];
      expect(material.id).toBe(materialId);
      expect(material.title).toBe('Test Material');
      expect(material.created_at).toBeDefined();
      expect(material.updated_at).toBeDefined();
    });

    it('should throw error for non-existent or unassigned course', async () => {
      await expect(
        mentorService.getCourseMaterials(mentorId, 99999),
      ).rejects.toThrow();
    });
  });

  describe('POST /mentors/courses/:courseId/materials', () => {
    it('should create course material', async () => {
      const materialData = {
        title: 'New Test Material',
        content: 'New test material content for the course',
      };

      const result = await mentorService.createCourseMaterial(
        mentorId,
        courseId,
        materialData,
      );

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.message).toBe('Course material created successfully');
      expect(result.material).toBeDefined();
      expect(result.material.id).toBeDefined();
      expect(result.material.course_id).toBe(courseId);
      expect(result.material.title).toBe(materialData.title);
      expect(result.material.created_at).toBeDefined();
      expect(result.material.updated_at).toBeDefined();
    });

    it('should throw error for non-existent or unassigned course', async () => {
      const materialData = {
        title: 'Test Material',
        content: 'Test content',
      };

      await expect(
        mentorService.createCourseMaterial(mentorId, 99999, materialData),
      ).rejects.toThrow();
    });
  });

  describe('PUT /mentors/courses/:courseId/materials/:materialId', () => {
    it('should update course material', async () => {
      const updateData = {
        title: 'Updated Test Material',
        content: 'Updated test material content',
      };

      const result = await mentorService.updateCourseMaterial(
        mentorId,
        courseId,
        materialId,
        updateData,
      );

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.message).toBe('Course material updated successfully');
      expect(result.material).toBeDefined();
      expect(result.material.id).toBe(materialId);
      expect(result.material.course_id).toBe(courseId);
      expect(result.material.title).toBe(updateData.title);
      expect(result.material.updated_at).toBeDefined();
    });

    it('should throw error for non-existent material', async () => {
      const updateData = {
        title: 'Updated Material',
        content: 'Updated content',
      };

      await expect(
        mentorService.updateCourseMaterial(
          mentorId,
          courseId,
          99999,
          updateData,
        ),
      ).rejects.toThrow();
    });
  });

  describe('DELETE /mentors/courses/:courseId/materials/:materialId', () => {
    it('should throw error when trying to delete material with student progress', async () => {
      await expect(
        mentorService.deleteCourseMaterial(mentorId, courseId, materialId),
      ).rejects.toThrow();
    });

    it('should delete course material without progress', async () => {
      // Create a new material without progress
      const newMaterial = await testService.createCourseMaterial(courseId);

      const result = await mentorService.deleteCourseMaterial(
        mentorId,
        courseId,
        newMaterial.id,
      );

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.message).toBe('Course material deleted successfully');
    });

    it('should throw error for non-existent material', async () => {
      await expect(
        mentorService.deleteCourseMaterial(mentorId, courseId, 99999),
      ).rejects.toThrow();
    });
  });

  describe('GET /mentors/students/:studentId/progress', () => {
    it('should get student progress', async () => {
      const result = await mentorService.getStudentProgress(
        mentorId,
        studentId,
      );

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.student).toBeDefined();
      expect(result.student.id).toBe(studentId);
      expect(result.student.name).toBe('Test Student');
      expect(result.student.email).toBe('student@example.com');
      expect(result.courses_progress).toBeDefined();
      expect(Array.isArray(result.courses_progress)).toBe(true);
    });

    it('should throw error for non-existent student', async () => {
      await expect(
        mentorService.getStudentProgress(mentorId, 99999),
      ).rejects.toThrow();
    });

    it('should throw error for student not in mentor courses', async () => {
      const newStudent = await testService.createStudent('400');
      await expect(
        mentorService.getStudentProgress(mentorId, newStudent.id),
      ).rejects.toThrow();
    });
  });

  describe('PUT /mentors/status', () => {
    it('should update mentor status', async () => {
      const statusData = {
        bio: 'Available for consultations',
        experience: '6 years',
      };

      const result = await mentorService.updateStatus(mentorId, statusData);

      logger.info(result);
      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
    });

    it('should throw error for non-existent mentor', async () => {
      const statusData = {
        bio: 'Available',
      };

      await expect(
        mentorService.updateStatus(99999, statusData),
      ).rejects.toThrow();
    });
  });
});
