import { z } from 'zod';

export const GridAxisSchema = z.object({
  id: z.string(),
  label: z.string(),
  direction: z.enum(['X', 'Y']),
  offset: z.number(),
});

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  polygon: z.array(z.tuple([z.number(), z.number()])),
  roomType: z.enum(['Living', 'Bedroom', 'Kitchen', 'Toilet', 'Staircase', 'Other']),
  targetArea: z.number().positive(),
});

export const WallSchema = z.object({
  id: z.string(),
  startNode: z.tuple([z.number(), z.number()]),
  endNode: z.tuple([z.number(), z.number()]),
  thickness: z.number().positive(),
  isLoadBearing: z.boolean(),
});

export const OpeningSchema = z.object({
  id: z.string(),
  wallId: z.string(),
  type: z.enum(['DOOR', 'WINDOW', 'VENTILATOR']),
  width: z.number().positive(),
  height: z.number().positive(),
  sillHeight: z.number().min(0),
  offsetFromStart: z.number().min(0),
});

export const BylawParamsSchema = z.object({
  plotWidth: z.number().positive(),
  plotDepth: z.number().positive(),
  frontSetback: z.number().min(0),
  rearSetback: z.number().min(0),
  sideSetbacks: z.tuple([z.number().min(0), z.number().min(0)]),
  maxFsi: z.number().positive(),
  roadWidth: z.number().positive(),
});

// Infer types
export type GridAxis = z.infer<typeof GridAxisSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Wall = z.infer<typeof WallSchema>;
export type Opening = z.infer<typeof OpeningSchema>;
export type BylawParams = z.infer<typeof BylawParamsSchema>;
