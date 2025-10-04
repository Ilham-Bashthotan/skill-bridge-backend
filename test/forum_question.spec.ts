import { Test, TestingModule } from '@nestjs/testing';
import { ForumQuestionService } from '../src/forum_question/forum_question.service';
import { PrismaService } from '../src/common/prisma.service';
import { ValidationService } from '../src/common/validation.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { TestService } from './test.service';

describe('ForumQuestionService', () => {
  let service: ForumQuestionService;

  const mockPrismaService = {
    forumQuestion: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    forumAnswer: {
      count: jest.fn(),
    },
  };

  const mockValidationService = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumQuestionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ValidationService,
          useValue: mockValidationService,
        },
      ],
    }).compile();

    service = module.get<ForumQuestionService>(ForumQuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /forum/questions', () => {
    it('should return questions with pagination', async () => {
      const mockQuestions = [TestService.createMockForumQuestion()];

      mockPrismaService.forumQuestion.findMany.mockResolvedValue(mockQuestions);
      mockPrismaService.forumQuestion.count.mockResolvedValue(1);

      const result = await service.getAllQuestions({
        page: 1,
        limit: 10,
      });

      expect(result.questions).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(1);
    });

    it('should handle search filter', async () => {
      mockPrismaService.forumQuestion.findMany.mockResolvedValue([]);
      mockPrismaService.forumQuestion.count.mockResolvedValue(0);

      await service.getAllQuestions({
        page: 1,
        limit: 10,
        search: 'test search',
      });

      expect(mockPrismaService.forumQuestion.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /forum/questions/:questionId', () => {
    it('should return question details', async () => {
      const mockQuestion = TestService.createMockForumQuestion({
        student: TestService.createMockStudent({ email: 'test@example.com' }),
      });

      mockPrismaService.forumQuestion.findUnique.mockResolvedValue(
        mockQuestion,
      );

      const result = await service.getQuestionById(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Question');
      expect(result.student).toBeDefined();
      expect(result.answers).toBeDefined();
    });

    it('should throw NotFoundException when question not found', async () => {
      mockPrismaService.forumQuestion.findUnique.mockResolvedValue(null);

      await expect(service.getQuestionById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('POST /forum/questions', () => {
    it('should create question for valid student', async () => {
      const mockUser = TestService.createMockStudent();
      const createQuestionDto = TestService.createValidCreateQuestionDto();
      const mockCreatedQuestion = TestService.createMockForumQuestion({
        title: createQuestionDto.title,
        message: createQuestionDto.message,
      });

      mockValidationService.validate.mockReturnValue(createQuestionDto);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.forumQuestion.create.mockResolvedValue(
        mockCreatedQuestion,
      );

      const result = await service.createQuestion(1, createQuestionDto);

      expect(result.message).toBe('Question created successfully');
      expect(result.question.title).toBe('New Question');
      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1, role: Role.student },
      });
    });

    it('should throw ForbiddenException for non-student user', async () => {
      const createQuestionDto = TestService.createValidCreateQuestionDto();

      mockValidationService.validate.mockReturnValue(createQuestionDto);
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.createQuestion(1, createQuestionDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('PUT /forum/questions/:questionId', () => {
    it('should update question for owner', async () => {
      const updateQuestionDto = TestService.createValidUpdateQuestionDto();
      const mockQuestion = TestService.createMockForumQuestion({
        title: 'Original Title',
        message: 'Original message',
      });
      const mockUpdatedQuestion = TestService.createMockForumQuestion({
        title: updateQuestionDto.title,
        message: updateQuestionDto.message,
      });

      mockValidationService.validate.mockReturnValue(updateQuestionDto);
      mockPrismaService.forumQuestion.findFirst.mockResolvedValue(mockQuestion);
      mockPrismaService.forumQuestion.update.mockResolvedValue(
        mockUpdatedQuestion,
      );

      const result = await service.updateQuestion(1, 1, updateQuestionDto);

      expect(result.message).toBe('Question updated successfully');
      expect(result.question.title).toBe('Updated Title');
    });

    it('should throw NotFoundException for unauthorized update', async () => {
      const updateQuestionDto = TestService.createValidUpdateQuestionDto({
        title: 'Updated Title',
      });

      mockValidationService.validate.mockReturnValue(updateQuestionDto);
      mockPrismaService.forumQuestion.findFirst.mockResolvedValue(null);

      await expect(
        service.updateQuestion(1, 1, updateQuestionDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /forum/questions/:questionId', () => {
    it('should delete question for owner', async () => {
      const mockQuestion = TestService.createMockForumQuestion();

      mockPrismaService.forumQuestion.findFirst.mockResolvedValue(mockQuestion);
      mockPrismaService.forumQuestion.delete.mockResolvedValue(mockQuestion);

      const result = await service.deleteQuestion(1, 1, Role.student);

      expect(result.message).toBe('Question deleted successfully');
      expect(mockPrismaService.forumQuestion.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should delete question for admin', async () => {
      const mockQuestion = TestService.createMockForumQuestion({
        studentId: 2, // Different student
      });

      mockPrismaService.forumQuestion.findFirst.mockResolvedValue(mockQuestion);
      mockPrismaService.forumQuestion.delete.mockResolvedValue(mockQuestion);

      const result = await service.deleteQuestion(1, 1, Role.admin);

      expect(result.message).toBe('Question deleted successfully');
    });

    it('should throw NotFoundException when question not found', async () => {
      mockPrismaService.forumQuestion.findFirst.mockResolvedValue(null);

      await expect(service.deleteQuestion(1, 1, Role.student)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('GET /forum/questions/search', () => {
    it('should search questions with query', async () => {
      const mockQuestions = [
        TestService.createMockForumQuestion({
          student: TestService.createMockStudent({ email: 'test@example.com' }),
        }),
      ];
      const searchQuery = TestService.createValidSearchQueryDto();

      mockPrismaService.forumQuestion.findMany.mockResolvedValue(mockQuestions);
      mockPrismaService.forumQuestion.count.mockResolvedValue(1);

      const result = await service.searchQuestions(searchQuery);

      expect(result.questions).toHaveLength(1);
      expect(result.search_metadata.query).toBe('test');
      expect(result.search_metadata.total_results).toBe(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should throw BadRequestException without search parameters', async () => {
      await expect(service.searchQuestions({})).rejects.toThrow();
    });
  });

  describe('GET /forum/questions/statistics', () => {
    it('should return forum statistics', async () => {
      const mockActiveStudents = [
        TestService.createMockStudent({
          name: 'Active Student',
          _count: { forumQuestions: 5 },
        }),
      ];

      mockPrismaService.forumQuestion.count
        .mockResolvedValueOnce(100) // totalQuestions
        .mockResolvedValueOnce(60) // answeredQuestions
        .mockResolvedValueOnce(20) // questionsThisMonth
        .mockResolvedValueOnce(80); // questionsThisYear

      mockPrismaService.user.findMany.mockResolvedValue(mockActiveStudents);
      mockPrismaService.forumAnswer.count.mockResolvedValue(150);

      const result = await service.getStatistics();

      expect(result.total_questions).toBe(100);
      expect(result.answered_questions).toBe(60);
      expect(result.unanswered_questions).toBe(40);
      expect(result.questions_this_month).toBe(20);
      expect(result.questions_this_year).toBe(80);
      expect(result.most_active_students).toHaveLength(1);
      expect(result.most_active_students[0].student_name).toBe(
        'Active Student',
      );
      expect(result.average_answers_per_question).toBe(1.5);
    });
  });
});
