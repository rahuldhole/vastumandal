import { z } from 'zod';

export const PlotSpecSchema = z.object({
  width: z.number().positive(),
  length: z.number().positive(),
  facing: z.enum(['N', 'S', 'E', 'W']),
  setbacks: z.object({
    front: z.number().min(0),
    rear: z.number().min(0),
    left: z.number().min(0),
    right: z.number().min(0),
  }),
  roadWidth: z.number().positive(),
  floorCount: z.enum(['G', 'G+1']),
});

export type PlotSpec = z.infer<typeof PlotSpecSchema>;

export const RequirementSpecSchema = z.object({
  bhk: z.enum(['1BHK', '2BHK', '3BHK']),
  pujaRoom: z.boolean(),
  toilets: z.object({
    attached: z.boolean(),
    common: z.boolean(),
    type: z.enum(['Indian', 'Western']),
  }),
  parking: z.boolean(),
  porch: z.boolean(),
});

export type RequirementSpec = z.infer<typeof RequirementSpecSchema>;

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['living', 'master_bedroom', 'bedroom', 'kitchen', 'toilet_common', 'toilet_attached', 'pooja', 'porch']),
  bounds: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().positive(),
    length: z.number().positive(),
  }),
  doors: z.array(z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  })),
  windows: z.array(z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    sill: z.number(),
    lintel: z.number(),
  })),
});

export type Room = z.infer<typeof RoomSchema>;

export const ColumnSchema = z.object({
  id: z.string(),
  center: z.object({
    x: z.number(),
    y: z.number(),
  }),
  dimensions: z.object({
    width: z.number().positive(),
    depth: z.number().positive(),
  }),
  orientation: z.enum(['0deg', '90deg']),
  reinforcementLabel: z.string(),
});

export type Column = z.infer<typeof ColumnSchema>;

export const FloorPlanSchema = z.object({
  plotBounds: z.object({
    width: z.number(),
    length: z.number(),
  }),
  buildableEnvelope: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    length: z.number(),
  }),
  rooms: z.array(RoomSchema),
  columns: z.array(ColumnSchema),
  circulationSpines: z.array(z.object({
    points: z.array(z.object({ x: z.number(), y: z.number() })),
  })),
  scheduleOfOpenings: z.array(z.object({
    type: z.enum(['door', 'window', 'ventilator']),
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
    }),
    count: z.number(),
  })),
});

export type FloorPlan = z.infer<typeof FloorPlanSchema>;

export const BOQReportSchema = z.object({
  quantities: z.object({
    steelMT: z.number(),
    cementBags: z.number(),
    sandCuFt: z.number(),
    aggregateCuFt: z.number(),
    bricksCount: z.number(),
  }),
  phases: z.object({
    substructure: z.number(),
    rccFraming: z.number(),
    masonry: z.number(),
    plumbingElectrical: z.number(),
    finishing: z.number(),
  }),
  totalCost: z.number(),
});

export type BOQReport = z.infer<typeof BOQReportSchema>;
export * from './presets';

export interface BeamScheduleRow { elementId?: string; width: number; depth: number; bottomBarDia?: number; bottomBarCount: number; topExtraLeft?: number; topExtraRight?: number; stirrupDia?: number; stirrupSpacing?: number; }
export interface ColumnScheduleRow { columnId?: string; level?: string; concreteGrade?: string; width?: number; depth?: number; mainBarDia?: number; mainBarCount?: number; tieDia?: number; tieSpacing?: number; }
export interface SlabScheduleRow { slabId?: string; lx: number; ly?: number; depth: number; distBarDia?: number; mainBarDia?: number; distBarSpacing?: number; mainBarSpacing?: number; }
export interface FoundationScheduleRow { footingId?: string; lx: number; ly?: number; depth: number; meshBarDiaY?: number; meshBarDiaX?: number; meshBarSpacingY?: number; meshBarSpacingX?: number; }
export interface TankScheduleRow { tankId?: string; type?: string; capacity?: number; width: number; length?: number; height: number; wallThickness: number; mainBarDia?: number; mainBarSpacing?: number; }
export interface StairsScheduleRow { stairId?: string; tread?: number; rise?: number; numberOfSteps?: number; waistSlabThickness?: number; mainBarDia?: number; distBarDia?: number; mainBarSpacing?: number; distBarSpacing?: number; }
export interface TitleBlockRow { [key: string]: any; }
