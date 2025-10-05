/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { Server } from 'http';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { ErrorFilter } from '../src/common/error.filter';
import { User, ConsultationQuestion, ConsultationAnswer } from '@prisma/client';

describe('ConsultationAnswerController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let studentToken: string;
  let mentorToken: string;
  let adminToken: string;
  let student: User;
  let mentor: User;
  let consultationQuestion: ConsultationQuestion;

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

    // Clean database and create test users
    await testService.cleanDatabase();

    // Create test users
    student = await testService.createStudent();
    mentor = await testService.createMentor();
    await testService.createAdmin();

    // Create consultation question for testing
    consultationQuestion = await testService.createConsultationQuestion(
      student.id,
    );

    // Login to get tokens
    const studentLogin = await request(app.getHttpServer() as Server)
      .post('/auth/login')
      .send({
        email: 'student@example.com',
        password: 'student123',
      });
    studentToken = (studentLogin.body as { token: string }).token;

    const mentorLogin = await request(app.getHttpServer() as Server)
      .post('/auth/login')
      .send({
        email: 'mentor@example.com',
        password: 'mentor123',
      });
    mentorToken = (mentorLogin.body as { token: string }).token;

    const adminLogin = await request(app.getHttpServer() as Server)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });
    adminToken = (adminLogin.body as { token: string }).token;
  });

  afterEach(async () => {
    await testService.cleanDatabase();
    await app.close();
  });

  describe('GET /consultations/answers', () => {
    beforeEach(async () => {
      await testService.createConsultationAnswer(
        mentor.id,
        consultationQuestion.id,
      );
    });

    it('should return consultation answers for authenticated student (own questions only)', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({
          page: 1,
          limit: 10,
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect((response.body as any).answers).toBeDefined();
      expect(Array.isArray((response.body as any).answers)).toBe(true);
      expect((response.body as any).pagination).toBeDefined();
      expect((response.body as any).pagination.page).toBe(1);
      expect((response.body as any).pagination.limit).toBe(10);
    });

    it('should return consultation answers for authenticated mentor', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers')
        .set('Authorization', `Bearer ${mentorToken}`)
        .query({
          page: 1,
          limit: 10,
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.answers).toBeDefined();
      expect(Array.isArray(response.body.answers)).toBe(true);
    });

    it('should return consultation answers for authenticated admin', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          page: 1,
          limit: 10,
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.answers).toBeDefined();
      expect(Array.isArray(response.body.answers)).toBe(true);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app.getHttpServer() as Server).get(
        '/consultations/answers',
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should filter answers by consultation question id', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers')
        .set('Authorization', `Bearer ${mentorToken}`)
        .query({
          consultations_question_id: consultationQuestion.id,
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.answers).toBeDefined();
    });

    it('should filter answers by mentor id', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          mentor_id: mentor.id,
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.answers).toBeDefined();
    });
  });

  describe('GET /consultations/answers/statistics', () => {
    beforeEach(async () => {
      await testService.createConsultationAnswer(
        mentor.id,
        consultationQuestion.id,
      );
    });

    it('should return statistics for admin', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.total_answers).toBeDefined();
      expect(response.body.answers_this_month).toBeDefined();
      expect(response.body.answers_this_year).toBeDefined();
      expect(typeof response.body.total_answers).toBe('number');
    });

    it('should return 403 for student access', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/statistics')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 403 for mentor access', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/statistics')
        .set('Authorization', `Bearer ${mentorToken}`);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app.getHttpServer() as Server).get(
        '/consultations/answers/statistics',
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /consultations/answers/search', () => {
    beforeEach(async () => {
      await testService.createConsultationAnswer(
        mentor.id,
        consultationQuestion.id,
      );
    });

    it('should search answers for authenticated student', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/search')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({
          q: 'test',
          page: 1,
          limit: 10,
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.answers).toBeDefined();
      expect(response.body.search_metadata).toBeDefined();
      expect(response.body.search_metadata.query).toBe('test');
      expect(response.body.pagination).toBeDefined();
    });

    it('should search answers for authenticated mentor', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/search')
        .set('Authorization', `Bearer ${mentorToken}`)
        .query({
          q: 'consultation',
          page: 1,
          limit: 5,
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.answers).toBeDefined();
      expect(response.body.search_metadata.query).toBe('consultation');
    });

    it('should return 400 for missing search query', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/search')
        .set('Authorization', `Bearer ${mentorToken}`)
        .query({
          page: 1,
          limit: 10,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/search')
        .query({
          q: 'test',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /consultations/answers/:answerId', () => {
    let consultationAnswer: ConsultationAnswer;

    beforeEach(async () => {
      consultationAnswer = await testService.createConsultationAnswer(
        mentor.id,
        consultationQuestion.id,
      );
    });

    it('should return answer by id for student (own question)', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.id).toBe(consultationAnswer.id);
      expect(response.body.message).toBeDefined();
      expect(response.body.mentor).toBeDefined();
      expect(response.body.consultation_question).toBeDefined();
    });

    it('should return answer by id for mentor', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${mentorToken}`);

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.id).toBe(consultationAnswer.id);
    });

    it('should return answer by id for admin', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.id).toBe(consultationAnswer.id);
    });

    it('should return 404 for non-existent answer', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/999')
        .set('Authorization', `Bearer ${mentorToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 403 for student accessing other student's question answer", async () => {
      // Create another student and question
      const anotherStudent = await testService.createStudent('2');
      const anotherQuestion = await testService.createConsultationQuestion(
        anotherStudent.id,
      );
      const anotherAnswer = await testService.createConsultationAnswer(
        mentor.id,
        anotherQuestion.id,
      );

      const response = await request(app.getHttpServer() as Server)
        .get(`/consultations/answers/${anotherAnswer.id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app.getHttpServer() as Server).get(
        `/consultations/answers/${consultationAnswer.id}`,
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for invalid answer id format', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/consultations/answers/invalid')
        .set('Authorization', `Bearer ${mentorToken}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /consultations/answers', () => {
    it('should create answer for mentor', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/consultations/answers')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          consultations_question_id: consultationQuestion.id,
          message: 'This is a helpful answer to your question.',
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.CREATED);

      expect(response.body.message).toBe(
        'Consultation answer created successfully',
      );
      expect(response.body.answer).toBeDefined();
      expect(response.body.answer.message).toBe(
        'This is a helpful answer to your question.',
      );
      expect(response.body.answer.mentor_id).toBe(mentor.id);
    });

    it('should create answer for admin', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/consultations/answers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          consultations_question_id: consultationQuestion.id,
          message: 'Admin answer to consultation.',
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.CREATED);

      expect(response.body.message).toBe(
        'Consultation answer created successfully',
      );
      expect(response.body.answer.message).toBe(
        'Admin answer to consultation.',
      );
    });

    it('should return 403 for student access', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/consultations/answers')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          consultations_question_id: consultationQuestion.id,
          message: 'Student trying to answer.',
        });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 400 for invalid request data', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/consultations/answers')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          consultations_question_id: '',
          message: '',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 404 for non-existent consultation question', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/consultations/answers')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          consultations_question_id: 999,
          message: 'Answer to non-existent question.',
        });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/consultations/answers')
        .send({
          consultations_question_id: consultationQuestion.id,
          message: 'Unauthenticated answer.',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /consultations/answers/:answerId', () => {
    let consultationAnswer: any;

    beforeEach(async () => {
      consultationAnswer = await testService.createConsultationAnswer(
        mentor.id,
        consultationQuestion.id,
      );
    });

    it('should update answer by owner mentor', async () => {
      const response = await request(app.getHttpServer() as Server)
        .put(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          message: 'Updated consultation answer message.',
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.message).toBe(
        'Consultation answer updated successfully',
      );
      expect(response.body.answer.message).toBe(
        'Updated consultation answer message.',
      );
    });

    it('should update answer for admin (any answer)', async () => {
      const response = await request(app.getHttpServer() as Server)
        .put(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          message: 'Admin updated consultation answer.',
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.message).toBe(
        'Consultation answer updated successfully',
      );
      expect(response.body.answer.message).toBe(
        'Admin updated consultation answer.',
      );
    });

    it('should return 403 for student access', async () => {
      const response = await request(app.getHttpServer() as Server)
        .put(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          message: 'Student trying to update answer.',
        });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 403 for non-owner mentor', async () => {
      // Create another mentor
      await testService.createMentor('2');
      const anotherMentorLogin = await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({
          email: 'mentor2@example.com',
          password: 'mentor123',
        });
      const anotherMentorToken = anotherMentorLogin.body.token;

      const response = await request(app.getHttpServer() as Server)
        .put(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${anotherMentorToken}`)
        .send({
          message: 'Non-owner trying to update.',
        });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 404 for non-existent answer', async () => {
      const response = await request(app.getHttpServer() as Server)
        .put('/consultations/answers/999')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          message: 'Updated message.',
        });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app.getHttpServer() as Server)
        .put(`/consultations/answers/${consultationAnswer.id}`)
        .send({
          message: 'Unauthenticated update.',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for invalid answer id format', async () => {
      const response = await request(app.getHttpServer() as Server)
        .put('/consultations/answers/invalid')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          message: 'Updated message.',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /consultations/answers/:answerId', () => {
    let consultationAnswer: any;

    beforeEach(async () => {
      consultationAnswer = await testService.createConsultationAnswer(
        mentor.id,
        consultationQuestion.id,
      );
    });

    it('should delete answer by owner mentor', async () => {
      const response = await request(app.getHttpServer() as Server)
        .delete(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${mentorToken}`);

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.message).toBe(
        'Consultation answer deleted successfully',
      );
    });

    it('should delete answer for admin (any answer)', async () => {
      const response = await request(app.getHttpServer() as Server)
        .delete(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.message).toBe(
        'Consultation answer deleted successfully',
      );
    });

    it('should return 403 for student access', async () => {
      const response = await request(app.getHttpServer() as Server)
        .delete(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 403 for non-owner mentor', async () => {
      // Create another mentor
      await testService.createMentor('3');
      const anotherMentorLogin = await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({
          email: 'mentor3@example.com',
          password: 'mentor123',
        });
      const anotherMentorToken = anotherMentorLogin.body.token;

      const response = await request(app.getHttpServer() as Server)
        .delete(`/consultations/answers/${consultationAnswer.id}`)
        .set('Authorization', `Bearer ${anotherMentorToken}`);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 404 for non-existent answer', async () => {
      const response = await request(app.getHttpServer() as Server)
        .delete('/consultations/answers/999')
        .set('Authorization', `Bearer ${mentorToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app.getHttpServer() as Server).delete(
        `/consultations/answers/${consultationAnswer.id}`,
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for invalid answer id format', async () => {
      const response = await request(app.getHttpServer() as Server)
        .delete('/consultations/answers/invalid')
        .set('Authorization', `Bearer ${mentorToken}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
