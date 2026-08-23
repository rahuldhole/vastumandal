export interface PlotSpec {
  width: number;
  length: number;
  facing?: string;
  roadWidth?: number;
  floorCount?: string;
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
  // Add as needed
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
