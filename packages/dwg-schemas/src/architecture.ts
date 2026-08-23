export interface PlotSpec {
  width: number;
  length: number;
  facing?: string;
  roadWidth?: number;
  floorCount?: string;
  maxFsi?: number;
  setbacks: {
    left: number;
    right: number;
    front: number;
    rear: number;
  };
}

export interface RequirementSpec {
  bhk?: string;
  pujaRoom?: boolean;
  toilets?: {
    attached?: boolean;
    common?: boolean;
    type?: string;
  };
  parking?: boolean;
  porch?: boolean;
  vastu?: {
    plotFacing?: string;
    mandirPosition?: string;
    kitchenPosition?: string;
    masterBedPosition?: string;
    waterTankPosition?: string;
    entrancePada?: string;
  };
}

export interface ArchRoom {
  id: string;
  name: string;
  type: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    length: number;
  };
  doors: any[];
  windows: any[];
}

export interface Column {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  depth?: number;
  height?: number;
}

export interface FloorPlan {
  plotBounds: {
    width: number;
    length: number;
  };
  buildableEnvelope: {
    x: number;
    y: number;
    width: number;
    length: number;
  };
  rooms: ArchRoom[];
  columns: Column[];
  circulationSpines: any[];
  scheduleOfOpenings: any[];
}

export interface BOQReport {
  lineItems?: {
    category?: string;
    itemCode?: string;
    description?: string;
    quantity: number;
    unit?: string;
    unitRate?: number;
  }[];
}

export interface BeamScheduleRow {
  elementId?: string;
  width: number;
  depth: number;
  bottomBarDia?: number;
  bottomBarCount: number;
  topExtraLeft?: number;
  topExtraRight?: number;
  stirrupDia?: number;
  stirrupSpacing?: number;
}

export interface ColumnScheduleRow {
  columnId?: string;
  level?: string;
  width?: number;
  depth?: number;
  mainBarDia?: number;
  mainBarCount?: number;
  concreteGrade?: string;
  tieDia?: number;
  tieSpacing?: number;
}

export interface SlabScheduleRow {
  slabId?: string;
  lx: number;
  ly?: number;
  depth: number;
  distBarDia?: number;
  mainBarDia?: number;
  mainBarSpacing?: number;
  distBarSpacing?: number;
}

export interface FoundationScheduleRow {
  footingId?: string;
  lx: number;
  ly?: number;
  depth: number;
  meshBarDiaY?: number;
  meshBarDiaX?: number;
  meshBarSpacingY?: number;
  meshBarSpacingX?: number;
}

export interface TankScheduleRow {
  tankId?: string;
  type?: string;
  capacity?: number;
  length?: number;
  width: number;
  height: number;
  wallThickness: number;
  mainBarDia?: number;
  mainBarSpacing?: number;
}

export interface StairsScheduleRow {
  stairId?: string;
  tread?: number;
  rise?: number;
  numberOfSteps?: number;
  waistSlabThickness?: number;
  mainBarDia?: number;
  mainBarSpacing?: number;
  distBarDia?: number;
  distBarSpacing?: number;
}

export interface TitleBlockRow {
  title?: string;
  project?: string;
  client?: string;
  sheetSize?: string;
  projectName?: string;
  drawingTitle?: string;
  clientName?: string;
  date?: string;
  drawnBy?: string;
}

// Phase 2: Parametric Fixtures & Appliance Library
export interface Vector2D {
  x: number;
  y: number;
}

export interface BoundingBox3D {
  width: number;
  length: number;
  height: number;
}

export interface Fixture {
  id: string;
  type: string; // e.g., 'Bed', 'Wardrobe', 'Hob', 'Sink', 'WC', 'Basin', 'Sofa', 'DiningTable'
  position: Vector2D; // center position relative to room bottom-left
  rotation: number; // degrees
  boundingBox: BoundingBox3D;
  clearanceEnvelope?: { width: number; length: number }; // For operational clearance
  vectorPaths?: Vector2D[][]; // Array of polylines for 2D rendering (DXF/SVG)
}

export const FIXTURE_TEMPLATES: Record<string, Omit<Fixture, 'id' | 'position' | 'rotation'>> = {
  MasterBed: {
    type: 'Bed',
    boundingBox: { width: 1.8, length: 2.0, height: 0.6 },
    clearanceEnvelope: { width: 2.4, length: 2.6 },
    vectorPaths: [
      [{ x: -0.9, y: -1.0 }, { x: 0.9, y: -1.0 }, { x: 0.9, y: 1.0 }, { x: -0.9, y: 1.0 }, { x: -0.9, y: -1.0 }] // Bed outline
    ]
  },
  Wardrobe: {
    type: 'Wardrobe',
    boundingBox: { width: 1.2, length: 0.6, height: 2.1 }, // Standard 1200x600 depth
    clearanceEnvelope: { width: 1.2, length: 1.2 }, // Need 600mm to open doors
  },
  KitchenHob: {
    type: 'Hob',
    boundingBox: { width: 0.6, length: 0.5, height: 0.1 },
    clearanceEnvelope: { width: 0.6, length: 1.0 },
  },
  KitchenSink: {
    type: 'Sink',
    boundingBox: { width: 0.8, length: 0.5, height: 0.2 },
    clearanceEnvelope: { width: 0.8, length: 1.0 },
  },
  WaterCloset: {
    type: 'WC',
    boundingBox: { width: 0.4, length: 0.6, height: 0.8 },
    clearanceEnvelope: { width: 0.9, length: 1.2 }, // 900x1200 clearance
  },
  WashBasin: {
    type: 'Basin',
    boundingBox: { width: 0.5, length: 0.4, height: 0.85 },
    clearanceEnvelope: { width: 0.7, length: 0.9 },
  },
  SofaSet: {
    type: 'Sofa',
    boundingBox: { width: 2.0, length: 0.9, height: 0.85 },
    clearanceEnvelope: { width: 2.2, length: 1.5 },
  },
  DiningTable6Seater: {
    type: 'DiningTable',
    boundingBox: { width: 1.5, length: 0.9, height: 0.75 },
    clearanceEnvelope: { width: 2.5, length: 1.9 }, // Including chair pushback
  }
};
