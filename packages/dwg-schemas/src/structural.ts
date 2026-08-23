import { z } from 'zod';

export const SoilConditionSchema = z.object({
  safeBearingCapacity: z.number().positive(),
  soilType: z.enum(['SOFT', 'MEDIUM', 'HARD', 'ROCK']),
  waterTableDepth: z.number().positive().optional(),
});

export const SlabMemberSchema = z.object({
  id: z.string(),
  spanX: z.number().positive(),
  spanY: z.number().positive(),
  thickness: z.number().positive(),
  slabType: z.enum(['ONE_WAY', 'TWO_WAY']),
  deadLoad: z.number().nonnegative(),
  liveLoad: z.number().nonnegative(),
});

export const BeamMemberSchema = z.object({
  id: z.string(),
  startNodeId: z.string(),
  endNodeId: z.string(),
  span: z.number().positive(),
  width: z.number().positive(),
  depth: z.number().positive(),
  tributaryUniformLoad: z.number().nonnegative(),
  reinforcement: z.object({
    topHangerBars: z.object({ count: z.number().positive(), diameter: z.number().positive() }),
    bottomMainBars: z.object({ count: z.number().positive(), diameter: z.number().positive() }),
    shearStirrups: z.object({ diameter: z.number().positive(), spacing: z.number().positive() }),
  }),
});

export const ColumnMemberSchema = z.object({
  id: z.string(),
  gridNodeId: z.tuple([z.number(), z.number()]),
  width: z.number().positive(),
  depth: z.number().positive(),
  height: z.number().positive(),
  tributaryArea: z.number().nonnegative(),
  factoredAxialLoad: z.number().nonnegative(),
  mainRebar: z.object({ count: z.number().positive(), diameter: z.number().positive() }),
  tieSpacing: z.number().positive(),
});

export const FootingMemberSchema = z.object({
  id: z.string(),
  columnId: z.string(),
  axialLoad: z.number().nonnegative(),
  length: z.number().positive(),
  width: z.number().positive(),
  depth: z.number().positive(),
  netSoilPressure: z.number().nonnegative(),
  bottomMeshRebar: z.object({ barDia: z.number().positive(), spacing: z.number().positive() }),
});

// Infer types
export type SoilCondition = z.infer<typeof SoilConditionSchema>;
export type SlabMember = z.infer<typeof SlabMemberSchema>;
export type BeamMember = z.infer<typeof BeamMemberSchema>;
export type ColumnMember = z.infer<typeof ColumnMemberSchema>;
export type FootingMember = z.infer<typeof FootingMemberSchema>;
