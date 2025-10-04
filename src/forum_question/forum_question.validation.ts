import { z } from 'zod';

export const ForumQuestionValidation = {
  CREATE: z.object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title must be at most 200 characters'),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(2000, 'Message must be at most 2000 characters'),
  }),

  UPDATE: z.object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title must be at most 200 characters')
      .optional(),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(2000, 'Message must be at most 2000 characters')
      .optional(),
  }),

  GET_QUESTIONS_QUERY: z.object({
    page: z
      .number()
      .int()
      .min(1, 'Page must be at least 1')
      .max(1000, 'Page must be at most 1000')
      .optional(),
    limit: z
      .number()
      .int()
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit must be at most 100')
      .optional(),
    search: z
      .string()
      .max(100, 'Search term must be at most 100 characters')
      .optional(),
    student_id: z
      .number()
      .int()
      .positive('Student ID must be positive')
      .optional(),
    sort: z
      .enum(['created_at', 'updated_at', 'answers_count', 'title'])
      .optional(),
    order: z.enum(['asc', 'desc']).optional(),
  }),

  GET_MY_QUESTIONS_QUERY: z.object({
    page: z
      .number()
      .int()
      .min(1, 'Page must be at least 1')
      .max(1000, 'Page must be at most 1000')
      .optional(),
    limit: z
      .number()
      .int()
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit must be at most 100')
      .optional(),
    status: z.enum(['answered', 'unanswered', 'all']).optional(),
  }),

  SEARCH_QUESTIONS: z
    .object({
      q: z
        .string()
        .min(1, 'Search query is required')
        .max(100, 'Search query must be at most 100 characters')
        .optional(),
      student_id: z
        .number()
        .int()
        .positive('Student ID must be positive')
        .optional(),
      has_answers: z.boolean().optional(),
      date_from: z
        .string()
        .datetime('Invalid date format for date_from')
        .optional(),
      date_to: z
        .string()
        .datetime('Invalid date format for date_to')
        .optional(),
      page: z
        .number()
        .int()
        .min(1, 'Page must be at least 1')
        .max(1000, 'Page must be at most 1000')
        .optional(),
      limit: z
        .number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must be at most 100')
        .optional(),
    })
    .refine(
      (data) =>
        data.q ||
        data.student_id ||
        data.has_answers !== undefined ||
        data.date_from ||
        data.date_to,
      {
        message: 'At least one search parameter is required',
      },
    )
    .refine(
      (data) => {
        if (data.date_from && data.date_to) {
          return new Date(data.date_from) <= new Date(data.date_to);
        }
        return true;
      },
      {
        message: 'date_from must be before or equal to date_to',
      },
    ),

  QUESTION_ID_PARAM: z.object({
    questionId: z
      .number()
      .int()
      .positive('Question ID must be a positive integer'),
  }),
};

// Type exports for use in DTOs
export type CreateForumQuestionInput = z.infer<
  typeof ForumQuestionValidation.CREATE
>;
export type UpdateForumQuestionInput = z.infer<
  typeof ForumQuestionValidation.UPDATE
>;
export type GetForumQuestionsQueryInput = z.infer<
  typeof ForumQuestionValidation.GET_QUESTIONS_QUERY
>;
export type GetMyQuestionsQueryInput = z.infer<
  typeof ForumQuestionValidation.GET_MY_QUESTIONS_QUERY
>;
export type SearchForumQuestionsInput = z.infer<
  typeof ForumQuestionValidation.SEARCH_QUESTIONS
>;
export type QuestionIdParamInput = z.infer<
  typeof ForumQuestionValidation.QUESTION_ID_PARAM
>;
