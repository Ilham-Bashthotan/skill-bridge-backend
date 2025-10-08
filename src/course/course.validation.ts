import { z, ZodType } from 'zod';

export class CourseValidation {
  static readonly CREATE: ZodType = z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description cannot exceed 1000 characters'),
  });

  static readonly UPDATE: ZodType = z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title cannot exceed 200 characters')
      .optional(),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional(),
  });

  static readonly ASSIGN_MENTOR: ZodType = z.object({
    mentor_id: z.number().int().min(1, 'Mentor ID must be at least 1'),
  });

  static readonly QUERY: ZodType = z.object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).optional(),
    search: z.string().max(100).optional(),
  });
}
