import { z, ZodType } from 'zod';

export class ConsultationAnswerValidation {
  static readonly CREATE: ZodType = z.object({
    consultations_question_id: z.number().positive(),
    message: z.string().min(10).max(2000),
  });

  static readonly UPDATE: ZodType = z.object({
    message: z.string().min(10).max(2000).optional(),
  });

  static readonly GET_QUERY: ZodType = z.object({
    consultations_question_id: z.number().positive().optional(),
    mentor_id: z.number().positive().optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    sort: z.enum(['created_at']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    q: z.string().min(1),
    consultations_question_id: z.number().positive().optional(),
    mentor_id: z.number().positive().optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
  });
}
