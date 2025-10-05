import { z } from 'zod';

export class ForumAnswerValidation {
  static readonly CREATE = z.object({
    question_id: z.number().positive(),
    message: z.string().min(10).max(5000),
  });

  static readonly UPDATE = z.object({
    message: z.string().min(10).max(5000).optional(),
  });

  static readonly SEARCH = z.object({
    q: z.string().min(1),
    question_id: z.number().positive().optional(),
    user_id: z.number().positive().optional(),
    page: z.number().positive().default(1),
    limit: z.number().positive().max(100).default(10),
  });

  static readonly GET_QUERY = z.object({
    question_id: z.number().positive().optional(),
    user_id: z.number().positive().optional(),
    page: z.number().positive().default(1),
    limit: z.number().positive().max(100).default(10),
    sort: z.enum(['created_at', 'likes_count']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
  });
}
