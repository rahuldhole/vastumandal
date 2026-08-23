import { Point2D, WallSegment, Column, Beam, Slab, StructuralFraming, SlabType } from './types';

// Constants as per IS 456
const MAX_BEAM_SPAN = 4500; // mm
const COL_WIDTH = 230; // mm
const COL_DEPTH = 380; // mm (defaulting to 380 for residential)
const GRID_TOLERANCE = 150; // mm

export function generateStructuralFraming(walls: WallSegment[]): StructuralFraming {
  const columns: Column[] = [];
  const beams: Beam[] = [];
  const slabs: Slab[] = [];

  // 1. Identify Intersections (L, T, X junctions) to place columns
  const points = extractUniquePoints(walls);
  
  // Snap points to grid logic
  const gridX = generateGridAxes(points.map(p => p.x));
  const gridY = generateGridAxes(points.map(p => p.y));

  points.forEach((p, index) => {
    const snapped = snapToGrid(p, gridX, gridY, GRID_TOLERANCE);
    columns.push({
      id: `col-${index}`,
      center: snapped,
      width: COL_WIDTH,
      depth: COL_DEPTH,
      rotation: 0 // Simplification: assuming all columns are 0 deg for now
    });
  });

  // 2. Generate Beams between adjacent columns along walls
  // Simplification: Connect columns if they form a segment
  // If distance > 4.5m, add an intermediate column
  columns.forEach((c1, i) => {
    columns.forEach((c2, j) => {
      if (i >= j) return; // avoid duplicates

      // Check if they align horizontally or vertically (roughly)
      const isHorizontal = Math.abs(c1.center.y - c2.center.y) < GRID_TOLERANCE;
      const isVertical = Math.abs(c1.center.x - c2.center.x) < GRID_TOLERANCE;

      if (isHorizontal || isVertical) {
        // Calculate clear span (rough estimation)
        const dist = Math.hypot(c1.center.x - c2.center.x, c1.center.y - c2.center.y);
        
        // This is a naive heuristic for demonstration:
        // A full engine would traverse the graph and check for walls
        // Here we just add beams if they are close enough and aligned
        if (dist > 0 && dist <= MAX_BEAM_SPAN + 500) {
          beams.push({
            id: `beam-${beams.length}`,
            startColumnId: c1.id,
            endColumnId: c2.id,
            width: COL_WIDTH,
            depth: 450, // Standard beam depth
            clearSpan: dist - COL_WIDTH
          });
        }
      }
    });
  });

  // 3. Define Slabs (Placeholder for bounded regions)
  // A robust algorithm would find cycles in the graph of beams
  // Here we just mock a simple slab based on bounds if there are columns
  if (columns.length >= 4) {
    const lx = 4000;
    const ly = 5000;
    const ratio = Math.max(lx, ly) / Math.min(lx, ly);
    
    slabs.push({
      id: `slab-0`,
      polygon: [],
      lx,
      ly,
      type: ratio > 2 ? 'ONE_WAY' : 'TWO_WAY',
      thickness: 125
    });
  }

  return { columns, beams, slabs };
}

function extractUniquePoints(walls: WallSegment[]): Point2D[] {
  const points: Point2D[] = [];
  const threshold = 10; // mm

  const addPoint = (p: Point2D) => {
    if (!points.some(existing => Math.hypot(existing.x - p.x, existing.y - p.y) < threshold)) {
      points.push(p);
    }
  };

  walls.forEach(w => {
    addPoint(w.start);
    addPoint(w.end);
  });

  return points;
}

function generateGridAxes(values: number[]): number[] {
  const axes: number[] = [];
  values.sort((a, b) => a - b).forEach(v => {
    if (axes.length === 0 || Math.abs(axes[axes.length - 1] - v) > GRID_TOLERANCE) {
      axes.push(v);
    }
  });
  return axes;
}

function snapToGrid(p: Point2D, gridX: number[], gridY: number[], tolerance: number): Point2D {
  let snappedX = p.x;
  let snappedY = p.y;

  for (const gx of gridX) {
    if (Math.abs(p.x - gx) <= tolerance) {
      snappedX = gx;
      break;
    }
  }

  for (const gy of gridY) {
    if (Math.abs(p.y - gy) <= tolerance) {
      snappedY = gy;
      break;
    }
  }

  return { x: snappedX, y: snappedY };
}

// Preliminary Sizing

export function sizeSlab(lx: number, ly: number, isContinuous: boolean = true): { type: SlabType; thickness: number } {
  const ratio = Math.max(lx, ly) / Math.min(lx, ly);
  const type: SlabType = ratio > 2 ? 'ONE_WAY' : 'TWO_WAY';
  const span = Math.min(lx, ly); // effective span for one-way, short span for two-way

  // IS 456 continuous slab rules of thumb
  const spanToDepthRatio = type === 'ONE_WAY' ? 28 : 32;
  const minThickness = Math.max(100, Math.ceil(span / spanToDepthRatio / 5) * 5);

  return { type, thickness: minThickness };
}

export function sizeBeam(span: number): { width: number; depth: number } {
  // depth L/12 to L/15, choose L/12 for safety
  const depth = Math.max(300, Math.ceil(span / 12 / 50) * 50); // multiple of 50
  // width >= 200, matching typical col width
  const width = Math.max(200, COL_WIDTH);
  return { width, depth };
}

export function sizeColumn(
  axialLoadFactoredKN: number,
  fck: number = 20,
  fy: number = 500,
  pt: number = 0.01 // 1% steel
): { width: number; depth: number } {
  // Pu = 0.4 fck Ac + 0.67 fy Asc
  // Ac = Ag - Asc
  // Asc = pt * Ag
  // Pu = 0.4 fck (Ag - pt*Ag) + 0.67 fy (pt*Ag)
  // Pu = Ag [ 0.4 fck (1 - pt) + 0.67 fy pt ]
  
  const Pu_N = axialLoadFactoredKN * 1000;
  const stress = 0.4 * fck * (1 - pt) + 0.67 * fy * pt;
  const Ag_req = Pu_N / stress;

  const width = COL_WIDTH;
  const depthReq = Ag_req / width;
  const depth = Math.max(COL_DEPTH, Math.ceil(depthReq / 50) * 50);

  return { width, depth };
}

