import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['COLLECTOR', 'GALLERY', 'MUSEUM', 'DEALER', 'OTHER']),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['COLLECTOR', 'GALLERY', 'MUSEUM', 'DEALER', 'OTHER']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'LEAD']).optional(),
    // other fields...
  }),
});
