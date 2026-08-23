import { z } from 'zod';

export const RateCardSchema = z.object({
  concrete: z.number().positive(),
  cementBag: z.number().positive().default(400),
  fineAggregate: z.number().positive().default(1500),
  coarseAggregate: z.number().positive().default(1400),
  steel: z.number().positive(),
  steelByDia: z.record(z.string(), z.number().positive()).optional(),
  formwork: z.number().positive(),
  masonry: z.number().positive(),
  excavation: z.number().positive(),
});

export const BOQLineItemSchema = z.object({
  itemCode: z.string(),
  description: z.string(),
  category: z.enum(['EXCAVATION', 'CONCRETE', 'STEEL', 'MASONRY', 'FINISHES']),
  quantity: z.number().nonnegative(),
  unit: z.string(),
  unitRate: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
});

export const BOQSummarySchema = z.object({
  lineItems: z.array(BOQLineItemSchema),
  subTotal: z.number().nonnegative(),
  contingencyPercent: z.number().nonnegative(),
  grandTotal: z.number().nonnegative(),
});

// Infer types
export type RateCard = z.infer<typeof RateCardSchema>;
export type BOQLineItem = z.infer<typeof BOQLineItemSchema>;
export type BOQSummary = z.infer<typeof BOQSummarySchema>;
