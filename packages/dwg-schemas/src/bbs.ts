import { z } from 'zod';

export const BBSItemSchema = z.object({
  id: z.string(),
  memberRef: z.string(),
  memberType: z.enum(['BEAM', 'COLUMN', 'SLAB', 'FOOTING']),
  barMark: z.string(),
  barDiameter: z.number().positive(),
  barShape: z.enum(['STRAIGHT', 'L_BENT', 'L_BENT_CURTAILED', 'CRANKED', 'RECT_STIRRUP']),
  cuttingLength: z.number().positive(),
  numberOfBars: z.number().positive(),
  totalLength: z.number().positive(),
  totalWeight: z.number().positive(),
});

export const BBSReportSchema = z.object({
  items: z.array(BBSItemSchema),
  totalTonnage: z.number().nonnegative(),
  weightByDiameter: z.record(z.string(), z.number().nonnegative()), // zod record keys are strings by default in TS when coerced from number, we'll use string keys
});

// Infer types
export type BBSItem = z.infer<typeof BBSItemSchema>;
export type BBSReport = z.infer<typeof BBSReportSchema>;
