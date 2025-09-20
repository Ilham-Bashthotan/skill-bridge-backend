import { z } from 'zod';

export const UserValidation = {
  REGISTER: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().min(1).max(255),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6).max(100),
  }),

  LOGIN: z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(1).max(100),
  }),

  UPDATE_PROFILE: z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(10).max(15).optional(),
    bio: z.string().max(500).optional(),
    experience: z.string().max(1000).optional(),
  }),

  CHANGE_PASSWORD: z.object({
    current_password: z.string().min(1).max(100),
    new_password: z.string().min(6).max(100),
  }),

  DELETE_ACCOUNT: z.object({
    password: z.string().min(1).max(100),
  }),
};
