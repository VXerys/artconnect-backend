import { z } from 'zod';

export const createArtworkSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    artist: z.string().min(1, 'Artist is required'),
    price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive')
           .or(z.string().regex(/^\d+(\.\d+)?$/, 'Price must be a valid number').transform(Number)),
    description: z.string().optional(),
    year: z.number().int().min(1000).max(new Date().getFullYear()).optional()
          .or(z.string().regex(/^\d{4}$/).transform(Number).optional()),
    medium: z.string().optional(),
    dimensions: z.string().optional(),
    currency: z.string().default('IDR'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateArtworkSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    artist: z.string().min(1).optional(),
    price: z.number().positive().optional()
           .or(z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional()),
    status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'ON_LOAN']).optional(),
    // other fields optional...
  }),
});
