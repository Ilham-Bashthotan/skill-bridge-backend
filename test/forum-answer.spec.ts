import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ForumAnswerService } from '../src/forum_answer/forum_answer.service';
import { CommonModule } from '../src/common/common.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ForumAnswerService', () => {
  let service: ForumAnswerService;
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, TestModule],
      providers: [ForumAnswerService],
    }).compile();

    service = module.get<ForumAnswerService>(ForumAnswerService);
    testService = module.get<TestService>(TestService);
  });

  afterEach(async () => {
    await testService.cleanDatabase();
  });

  describe('GET /forum/answers', () => {
    it('should return empty answers list when no answers exist', async () => {
      await testService.cleanDatabase();
      const result = await service.getAllAnswers({ page: 1, limit: 10 });

      expect(result.answers).toBeDefined();
      expect(Array.isArray(result.answers)).toBe(true);
      expect(result.answers.length).toBe(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should return answers with pagination', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createForumQuestion(student.id);
      await testService.createForumAnswer(mentor.id, question.id);
      await testService.createForumAnswer(mentor.id, question.id);

      const result = await service.getAllAnswers({ page: 1, limit: 10 });

      expect(result.answers.length).toBe(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should filter answers by question_id', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question1 = await testService.createForumQuestion(student.id);
      const question2 = await testService.createForumQuestion(student.id);
      await testService.createForumAnswer(mentor.id, question1.id);
      await testService.createForumAnswer(mentor.id, question2.id);

      const result = await service.getAllAnswers({
        page: 1,
        limit: 10,
        question_id: question1.id,
      });

      expect(result.answers.length).toBe(1);
      expect(result.answers[0].question_id).toBe(question1.id);
    });

    it('should filter answers by user_id', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor1 = await testService.createMentor();
      const mentor2 = await testService.createMentor('2');
      const question = await testService.createForumQuestion(student.id);
      await testService.createForumAnswer(mentor1.id, question.id);
      await testService.createForumAnswer(mentor2.id, question.id);

      const result = await service.getAllAnswers({
        page: 1,
        limit: 10,
        user_id: mentor1.id,
      });

      expect(result.answers.length).toBe(1);
      expect(result.answers[0].user_id).toBe(mentor1.id);
    });
  });

  describe('GET /forum/answers/:answerId', () => {
    it('should return answer details by id', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createForumQuestion(student.id);
      const answer = await testService.createForumAnswer(
        mentor.id,
        question.id,
      );

      const result = await service.getAnswerById(answer.id);

      expect(result.id).toBe(answer.id);
      expect(result.message).toBe('Test forum answer');
      expect(result.user).toBeDefined();
      expect(result.user?.name).toBe('Test Mentor');
      expect(result.question).toBeDefined();
      expect(result.question?.title).toBe('Test Forum Question');
    });

    it('should throw NotFoundException for non-existent answer', async () => {
      await expect(service.getAnswerById(99999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('POST /forum/answers', () => {
    it('should create new answer with valid user', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createForumQuestion(student.id);

      const answerData = {
        question_id: question.id,
        message: 'This is a helpful answer to your question.',
      };

      const result = await service.createAnswer(mentor.id, answerData);

      expect(result.message).toBe('Answer created successfully');
      expect(result.answer).toBeDefined();
      expect(result.answer.message).toBe(answerData.message);
      expect(result.answer.user_id).toBe(mentor.id);
    });

    it('should throw NotFoundException for non-existent question', async () => {
      await testService.cleanDatabase();
      const mentor = await testService.createMentor();

      const answerData = {
        question_id: 99999,
        message: 'This is a helpful answer to your question.',
      };

      await expect(service.createAnswer(mentor.id, answerData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('PUT /forum/answers/:answerId', () => {
    it('should update answer with valid user and ownership', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createForumQuestion(student.id);
      const answer = await testService.createForumAnswer(
        mentor.id,
        question.id,
      );

      const updateData = {
        message: 'Updated answer with more details',
      };

      const result = await service.updateAnswer(
        mentor.id,
        answer.id,
        updateData,
      );

      expect(result.message).toBe('Answer updated successfully');
      expect(result.answer.message).toBe(updateData.message);
    });

    it('should throw NotFoundException for non-existent answer', async () => {
      await testService.cleanDatabase();
      const mentor = await testService.createMentor();

      const updateData = {
        message: 'Updated answer',
      };

      await expect(
        service.updateAnswer(mentor.id, 99999, updateData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user tries to update answer they do not own', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor1 = await testService.createMentor();
      const mentor2 = await testService.createMentor('2');
      const question = await testService.createForumQuestion(student.id);
      const answer = await testService.createForumAnswer(
        mentor1.id,
        question.id,
      );

      const updateData = {
        message: 'Updated answer',
      };

      await expect(
        service.updateAnswer(mentor2.id, answer.id, updateData),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DELETE /forum/answers/:answerId', () => {
    it('should delete answer with valid user and ownership', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createForumQuestion(student.id);
      const answer = await testService.createForumAnswer(
        mentor.id,
        question.id,
      );

      const result = await service.deleteAnswer(mentor.id, answer.id);

      expect(result.message).toBe('Answer deleted successfully');
    });

    it('should throw NotFoundException for non-existent answer', async () => {
      await testService.cleanDatabase();
      const mentor = await testService.createMentor();

      await expect(service.deleteAnswer(mentor.id, 99999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user tries to delete answer they do not own', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor1 = await testService.createMentor();
      const mentor2 = await testService.createMentor('2');
      const question = await testService.createForumQuestion(student.id);
      const answer = await testService.createForumAnswer(
        mentor1.id,
        question.id,
      );

      await expect(service.deleteAnswer(mentor2.id, answer.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('GET /forum/answers/search', () => {
    it('should search answers with query', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createForumQuestion(student.id);
      await testService.createForumAnswer(mentor.id, question.id);

      const result = await service.searchAnswers({
        q: 'forum answer',
        page: 1,
        limit: 10,
      });

      expect(result.answers.length).toBe(1);
      expect(result.search_metadata.query).toBe('forum answer');
      expect(result.search_metadata.total_results).toBe(1);
      expect(typeof result.search_metadata.search_time_ms).toBe('number');
    });

    it('should throw BadRequestException when no search query provided', async () => {
      await expect(
        service.searchAnswers({
          q: '',
          page: 1,
          limit: 10,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET /forum/answers/statistics', () => {
    it('should return answer statistics', async () => {
      await testService.cleanDatabase();
      const student = await testService.createStudent();
      const mentor = await testService.createMentor();
      const question = await testService.createForumQuestion(student.id);
      await testService.createForumAnswer(mentor.id, question.id);
      await testService.createForumAnswer(mentor.id, question.id);

      const result = await service.getStatistics();

      expect(result.total_answers).toBe(2);
      expect(typeof result.answers_this_month).toBe('number');
      expect(typeof result.answers_this_year).toBe('number');
    });

    it('should return zero statistics when no answers exist', async () => {
      await testService.cleanDatabase();

      const result = await service.getStatistics();

      expect(result.total_answers).toBe(0);
      expect(result.answers_this_month).toBe(0);
      expect(result.answers_this_year).toBe(0);
    });
  });
});
