import { z } from 'zod';

export const createDealSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    amount: z.number().nonnegative().or(z.string().transform(Number)),
    contactId: z.string().uuid('Invalid contact ID'),
    stage: z.enum(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).optional(),
    probability: z.number().min(0).max(100).optional().or(z.string().transform(Number).optional()),
    artworkId: z.string().uuid().optional(),
    expectedCloseDate: z.string().datetime({ offset: true }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()) // Accept ISO or YYYY-MM-DD
  }),
});

export const updateStageSchema = z.object({
  body: z.object({
    stage: z.enum(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
    probability: z.number().min(0).max(100).optional(),
  }),
});
