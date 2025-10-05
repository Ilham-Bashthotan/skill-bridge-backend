import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConsultationsQuestionService } from '../src/consultations_question/consultations_question.service';
import { CommonModule } from '../src/common/common.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ConsultationsQuestionService', () => {
  let service: ConsultationsQuestionService;
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, TestModule],
      providers: [ConsultationsQuestionService],
    }).compile();

    service = module.get<ConsultationsQuestionService>(
      ConsultationsQuestionService,
    );
    testService = module.get<TestService>(TestService);
  });

  afterEach(async () => {
    await testService.cleanDatabase();
  });

  describe('GET /consultations/questions', () => {
    it('should return empty questions list when no questions exist', async () => {
      await testService.cleanDatabase();
      const result = await service.getAllQuestions(
        { page: 1, limit: 10 },
        'student',
        1,
      );

      expect(result.questions).toBeDefined();
      expect(Array.isArray(result.questions)).toBe(true);
      expect(result.questions.length).toBe(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should return questions with pagination', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      await testService.createConsultationQuestion(student.id);
      await testService.createConsultationQuestion(student.id);

      const result = await service.getAllQuestions(
        { page: 1, limit: 10 },
        'admin',
      );

      expect(result.questions.length).toBe(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should filter questions by student_id for admin/mentor', async () => {
      await testService.cleanDatabase();
      const student1 = await testService.createStudent();
      const student2 = await testService.createStudent('2');
      await testService.createConsultationQuestion(student1.id);
      await testService.createConsultationQuestion(student2.id);

      const result = await service.getAllQuestions(
        { page: 1, limit: 10, student_id: student1.id },
        'admin',
      );

      expect(result.questions.length).toBe(1);
      expect(result.questions[0].student_id).toBe(student1.id);
    });

    it('should only return own questions for students', async () => {
      await testService.cleanDatabase();
      const student1 = await testService.createStudent();
      const student2 = await testService.createStudent('2');
      await testService.createConsultationQuestion(student1.id);
      await testService.createConsultationQuestion(student2.id);

      const result = await service.getAllQuestions(
        { page: 1, limit: 10 },
        'student',
        student1.id,
      );

      expect(result.questions.length).toBe(1);
      expect(result.questions[0].student_id).toBe(student1.id);
    });
  });

  describe('GET /consultations/questions/:questionId', () => {
    it('should return question details by id for admin', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const question = await testService.createConsultationQuestion(student.id);

      const result = await service.getQuestionById(
        question.id,
        'admin',
        undefined,
      );

      expect(result.id).toBe(question.id);
      expect(result.title).toBe('Test Consultation');
      expect(result.message).toBe('Test consultation message');
      expect(result.student).toBeDefined();
      expect(result.student?.name).toBe('Test Student');
    });

    it('should return question details for question owner', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const question = await testService.createConsultationQuestion(student.id);

      const result = await service.getQuestionById(
        question.id,
        'student',
        student.id,
      );

      expect(result.id).toBe(question.id);
      expect(result.title).toBe('Test Consultation');
      expect(result.student_id).toBe(student.id);
    });

    it('should throw NotFoundException for non-existent question', async () => {
      await expect(
        service.getQuestionById(99999, 'admin', undefined),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when student tries to access other student question', async () => {
      await testService.cleanDatabase();
      const student1 = await testService.createStudent();
      const student2 = await testService.createStudent('2');
      const question = await testService.createConsultationQuestion(
        student1.id,
      );

      await expect(
        service.getQuestionById(question.id, 'student', student2.id),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('POST /consultations/questions', () => {
    it('should create new question with valid student', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();

      const questionData = {
        title: 'Need Help with Programming',
        message: 'I need guidance on learning JavaScript and React.',
      };

      const result = await service.createQuestion(student.id, questionData);

      expect(result.message).toBe('Consultation question created successfully');
      expect(result.question).toBeDefined();
      expect(result.question.title).toBe(questionData.title);
      expect(result.question.message).toBe(questionData.message);
      expect(result.question.student_id).toBe(student.id);
    });

    it('should validate minimum title length', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();

      const questionData = {
        title: 'Hi', // Too short
        message: 'I need guidance on learning JavaScript and React.',
      };

      await expect(
        service.createQuestion(student.id, questionData),
      ).rejects.toThrow();
    });

    it('should validate minimum message length', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();

      const questionData = {
        title: 'Need Help with Programming',
        message: 'Help', // Too short
      };

      await expect(
        service.createQuestion(student.id, questionData),
      ).rejects.toThrow();
    });
  });

  describe('PUT /consultations/questions/:questionId', () => {
    it('should update question with valid student and ownership', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const question = await testService.createConsultationQuestion(student.id);

      const updateData = {
        title: 'Updated Question Title',
        message: 'Updated question message with more details',
      };

      const result = await service.updateQuestion(
        student.id,
        question.id,
        updateData,
        'student',
      );

      expect(result.message).toBe('Consultation question updated successfully');
      expect(result.question.title).toBe(updateData.title);
      expect(result.question.message).toBe(updateData.message);
    });

    it('should allow admin to update any question', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const admin = await testService.createAdmin();
      const question = await testService.createConsultationQuestion(student.id);

      const updateData = {
        title: 'Admin Updated Title',
        message: 'Admin updated message',
      };

      const result = await service.updateQuestion(
        admin.id,
        question.id,
        updateData,
        'admin',
      );

      expect(result.message).toBe('Consultation question updated successfully');
      expect(result.question.title).toBe(updateData.title);
    });

    it('should throw NotFoundException for non-existent question', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();

      const updateData = {
        title: 'Updated Title',
      };

      await expect(
        service.updateQuestion(student.id, 99999, updateData, 'student'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when student tries to update question they do not own', async () => {
      await testService.cleanDatabase();
      const student1 = await testService.createStudent();
      const student2 = await testService.createStudent('2');
      const question = await testService.createConsultationQuestion(
        student1.id,
      );

      const updateData = {
        title: 'Updated Title',
      };

      await expect(
        service.updateQuestion(student2.id, question.id, updateData, 'student'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DELETE /consultations/questions/:questionId', () => {
    it('should delete question with valid student and ownership', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const question = await testService.createConsultationQuestion(student.id);

      const result = await service.deleteQuestion(
        student.id,
        question.id,
        'student',
      );

      expect(result.message).toBe('Consultation question deleted successfully');
    });

    it('should allow admin to delete any question', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const admin = await testService.createAdmin();
      const question = await testService.createConsultationQuestion(student.id);

      const result = await service.deleteQuestion(
        admin.id,
        question.id,
        'admin',
      );

      expect(result.message).toBe('Consultation question deleted successfully');
    });

    it('should throw NotFoundException for non-existent question', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();

      await expect(
        service.deleteQuestion(student.id, 99999, 'student'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when student tries to delete question they do not own', async () => {
      await testService.cleanDatabase();
      const student1 = await testService.createStudent();
      const student2 = await testService.createStudent('2');
      const question = await testService.createConsultationQuestion(
        student1.id,
      );

      await expect(
        service.deleteQuestion(student2.id, question.id, 'student'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('GET /consultations/questions/my-questions', () => {
    it('should return questions created by specific student', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      await testService.createConsultationQuestion(student.id);
      await testService.createConsultationQuestion(student.id);

      const result = await service.getMyQuestions(student.id, {
        page: 1,
        limit: 10,
      });

      expect(result.questions.length).toBe(2);
      expect(result.pagination.total).toBe(2);
      expect(result.questions[0]).toBeDefined();
      expect(result.questions[1]).toBeDefined();
    });

    it('should return empty list for student with no questions', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();

      const result = await service.getMyQuestions(student.id, {
        page: 1,
        limit: 10,
      });

      expect(result.questions.length).toBe(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should include answer count in questions', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createConsultationQuestion(student.id);
      await testService.createConsultationAnswer(mentor.id, question.id);

      const result = await service.getMyQuestions(student.id, {
        page: 1,
        limit: 10,
      });

      expect(result.questions.length).toBe(1);
      expect(result.questions[0].answers_count).toBe(1);
    });
  });

  describe('GET /consultations/questions/unanswered', () => {
    it('should return unanswered questions for mentors/admins', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question1 = await testService.createConsultationQuestion(
        student.id,
      );
      const question2 = await testService.createConsultationQuestion(
        student.id,
      );

      // Answer only one question
      await testService.createConsultationAnswer(mentor.id, question1.id);

      const result = await service.getUnansweredQuestions({
        page: 1,
        limit: 10,
      });

      expect(result.questions.length).toBe(1);
      expect(result.questions[0].id).toBe(question2.id);
      expect(result.questions[0].answers_count).toBe(0);
    });

    it('should return empty list when all questions are answered', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createConsultationQuestion(student.id);
      await testService.createConsultationAnswer(mentor.id, question.id);

      const result = await service.getUnansweredQuestions({
        page: 1,
        limit: 10,
      });

      expect(result.questions.length).toBe(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should include student information in unanswered questions', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      await testService.createConsultationQuestion(student.id);

      const result = await service.getUnansweredQuestions({
        page: 1,
        limit: 10,
      });

      expect(result.questions.length).toBe(1);
      expect(result.questions[0].student).toBeDefined();
      expect(result.questions[0].student?.name).toBe('Test Student');
    });
  });

  describe('GET /consultations/questions/statistics', () => {
    it('should return consultation statistics', async () => {
      await testService.cleanDatabase();
      const student1 = await testService.createStudent();
      const student2 = await testService.createStudent('2');
      const mentor = await testService.createMentor();

      const question1 = await testService.createConsultationQuestion(
        student1.id,
      );
      const question2 = await testService.createConsultationQuestion(
        student2.id,
      );
      await testService.createConsultationQuestion(student1.id);

      // Answer some questions
      await testService.createConsultationAnswer(mentor.id, question1.id);
      await testService.createConsultationAnswer(mentor.id, question2.id);

      const result = await service.getStatistics();

      expect(result.total_questions).toBe(3);
      expect(typeof result.questions_this_month).toBe('number');
      expect(typeof result.questions_this_year).toBe('number');
      expect(result.questions_this_month).toBeGreaterThanOrEqual(0);
      expect(result.questions_this_year).toBeGreaterThanOrEqual(0);
    });

    it('should return zero statistics when no questions exist', async () => {
      await testService.cleanDatabase();

      const result = await service.getStatistics();

      expect(result.total_questions).toBe(0);
      expect(result.questions_this_month).toBe(0);
      expect(result.questions_this_year).toBe(0);
    });

    it('should return proper statistics structure', async () => {
      await testService.cleanDatabase();
      const student1 = await testService.createStudent();
      const student2 = await testService.createStudent('2');

      // Student1 creates more questions
      await testService.createConsultationQuestion(student1.id);
      await testService.createConsultationQuestion(student1.id);
      await testService.createConsultationQuestion(student2.id);

      const result = await service.getStatistics();

      expect(result.total_questions).toBe(3);
      expect(typeof result.questions_this_month).toBe('number');
      expect(typeof result.questions_this_year).toBe('number');
      expect(result.total_questions).toBeGreaterThanOrEqual(
        result.questions_this_month,
      );
      expect(result.total_questions).toBeGreaterThanOrEqual(
        result.questions_this_year,
      );
    });
  });
});
