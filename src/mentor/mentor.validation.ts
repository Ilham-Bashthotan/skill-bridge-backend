/*
  NOTE: This file contains Zod schemas for mentor-related payloads.
  The project already uses class-validator decorators on DTO classes
  (src/mentor/dto/*.ts). Maintaining both Zod schemas and class-validator
  decorators duplicates validation logic and can cause confusion.

  Recommendation:
  - Prefer one validation approach for the project. If you want runtime
    schema composition and parsing (e.g., for runtime-only validation or
    in non-Nest contexts), keep Zod. If you prefer Nest's ValidationPipe
    and decorator-based validation, keep class-validator and remove Zod.

  For now this file is kept as an optional set of schemas. It was created
  to avoid importing DTO classes directly (reduces tight coupling).
*/

import { z } from 'zod';

export const MentorValidation = {
  UPDATE_PROFILE: z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(10).max(15).optional(),
    bio: z.string().max(500).optional(),
    experience: z.string().max(1000).optional(),
  }),

  CREATE_MATERIAL: z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
  }),

  UPDATE_MATERIAL: z.object({
    title: z.string().max(255).optional(),
    content: z.string().optional(),
  }),

  UPDATE_STATUS: z.object({
    bio: z.string().max(500).optional(),
    experience: z.string().max(1000).optional(),
  }),
};
