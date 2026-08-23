import { Point2D, calculatePolygonArea, isPointInPolygon } from './polygon';
import { Room } from '@vastumandal/dwg-schemas/src/spatial';

export type VastuGridType = '3x3' | '9x9';
export type VastuZone = 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'N' | 'CENTER';

export interface VastuScoreResult {
  roomName: string;
  zone: VastuZone;
  score: number; // 0 to 10
  recommendation: string;
}

// Map 3x3 grid indices to Zones
const ZoneMap_3x3: VastuZone[][] = [
  ['NW', 'N', 'NE'],
  ['W', 'CENTER', 'E'],
  ['SW', 'S', 'SE']
];

export function generateVastuGrid(plotPolygon: Point2D[], type: VastuGridType = '3x3'): Point2D[][] {
  // Simplified bounding box approach for Vastu grid generation on arbitrary polygon.
  // In a true system, we might map the grid exactly to the non-orthogonal shape using affine transformations,
  // but bounding box is standard practice for basic Vastu Mandala on irregular plots.
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  plotPolygon.forEach(p => {
    if (p[0] < minX) minX = p[0];
    if (p[0] > maxX) maxX = p[0];
    if (p[1] < minY) minY = p[1];
    if (p[1] > maxY) maxY = p[1];
  });

  const cols = type === '3x3' ? 3 : 9;
  const rows = cols;
  const cellWidth = (maxX - minX) / cols;
  const cellHeight = (maxY - minY) / rows;

  const grid: Point2D[][] = [];
  
  for (let i = 0; i <= rows; i++) {
    const rowPoints: Point2D[] = [];
    for (let j = 0; j <= cols; j++) {
      rowPoints.push([minX + j * cellWidth, minY + i * cellHeight]);
    }
    grid.push(rowPoints);
  }

  return grid;
}

export function evaluateRoomVastu(room: Room, plotPolygon: Point2D[]): VastuScoreResult {
  // Determine center of the room
  let cx = 0, cy = 0;
  room.polygon.forEach(p => {
    cx += p[0];
    cy += p[1];
  });
  cx /= room.polygon.length;
  cy /= room.polygon.length;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  plotPolygon.forEach(p => {
    if (p[0] < minX) minX = p[0];
    if (p[0] > maxX) maxX = p[0];
    if (p[1] < minY) minY = p[1];
    if (p[1] > maxY) maxY = p[1];
  });

  const normalizedX = (cx - minX) / (maxX - minX);
  const normalizedY = (cy - minY) / (maxY - minY);

  // Map to 3x3
  const colIndex = Math.min(2, Math.max(0, Math.floor(normalizedX * 3)));
  const rowIndex = Math.min(2, Math.max(0, Math.floor(normalizedY * 3)));

  // Note: rowIndex 0 is bottom (South if assuming North is Up/Y+ or depending on rotation)
  // Let's assume standard: Y+ is North, X+ is East.
  // Then rowIndex 2 is North, rowIndex 0 is South.
  // ZoneMap_3x3 is visually top-down (row 0 is North). We need to flip Y.
  const visualRow = 2 - rowIndex;
  const zone = ZoneMap_3x3[visualRow][colIndex];

  let score = 5;
  let rec = '';

  switch (room.roomType.toLowerCase()) {
    case 'kitchen':
      if (zone === 'SE') { score = 10; rec = 'Excellent placement (Agni).'; }
      else if (zone === 'NW') { score = 7; rec = 'Good alternative placement.'; }
      else { score = 3; rec = 'Avoid Kitchen here. Move to SE or NW.'; }
      break;
    case 'bedroom':
      // Master bedroom SW is best
      if (zone === 'SW') { score = 10; rec = 'Excellent for Master Bedroom (Nairutya).'; }
      else if (zone === 'S' || zone === 'W') { score = 8; rec = 'Good placement.'; }
      else if (zone === 'NE') { score = 2; rec = 'Avoid Bedroom in NE (Eesanya).'; }
      else { score = 5; rec = 'Acceptable placement.'; }
      break;
    case 'toilet':
      if (zone === 'NW' || zone === 'W' || zone === 'S') { score = 9; rec = 'Good placement.'; }
      else if (zone === 'NE' || zone === 'SW' || zone === 'CENTER') { score = 1; rec = 'Strictly avoid Toilet here.'; }
      else { score = 4; rec = 'Suboptimal placement.'; }
      break;
    case 'living':
      if (zone === 'NE' || zone === 'E' || zone === 'N') { score = 9; rec = 'Excellent placement for living/drawing.'; }
      else { score = 6; rec = 'Acceptable placement.'; }
      break;
    default:
      rec = 'General purpose area. Vastu impact is neutral.';
      break;
  }

  return {
    roomName: room.name,
    zone,
    score,
    recommendation: rec
  };
}
