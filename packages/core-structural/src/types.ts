export interface Point2D {
  x: number;
  y: number;
}

export interface WallSegment {
  id: string;
  start: Point2D;
  end: Point2D;
  thickness: number;
}

export interface Column {
  id: string;
  center: Point2D;
  width: number; // e.g. 230
  depth: number; // e.g. 380 or 450
  rotation: number; // 0 or 90 degrees
}

export interface Beam {
  id: string;
  startColumnId: string;
  endColumnId: string;
  width: number;
  depth: number;
  clearSpan: number;
}

export type SlabType = 'ONE_WAY' | 'TWO_WAY';

export interface Slab {
  id: string;
  polygon: Point2D[];
  lx: number;
  ly: number;
  type: SlabType;
  thickness: number;
}

export interface StructuralFraming {
  columns: Column[];
  beams: Beam[];
  slabs: Slab[];
}
