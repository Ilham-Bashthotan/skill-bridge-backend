import { z } from 'zod';

export const updateStudentProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .max(20, 'Phone must be at most 20 characters')
    .optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  experience: z
    .string()
    .max(200, 'Experience must be at most 200 characters')
    .optional(),
});

export const getCoursesQuerySchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').optional(),
  limit: z.number().int().min(1, 'Limit must be at least 1').optional(),
  search: z
    .string()
    .max(100, 'Search term must be at most 100 characters')
    .optional(),
});

export const updateProgressSchema = z.object({
  completed: z.boolean(),
});

export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>;
export type GetCoursesQueryInput = z.infer<typeof getCoursesQuerySchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
