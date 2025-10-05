import { z } from 'zod';

export class ConsultationQuestionValidation {
  static readonly CREATE = z.object({
    title: z.string().min(5).max(150),
    message: z.string().min(20).max(5000),
  });

  static readonly UPDATE = z.object({
    title: z.string().min(5).max(150).optional(),
    message: z.string().min(20).max(5000).optional(),
  });

  static readonly GET_QUERY = z.object({
    student_id: z.number().positive().optional(),
    page: z.number().positive().default(1),
    limit: z.number().positive().max(100).default(10),
    sort: z.enum(['created_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
  });
}
