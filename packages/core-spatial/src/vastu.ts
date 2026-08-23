import { Point2D, calculatePolygonArea, isPointInPolygon } from './polygon';
import { Room } from '@vastumandal/dwg-schemas/src/spatial';

export type VastuGridType = '3x3' | '9x9';
export type VastuZone = 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'SSE' | 'S' | 'SSW' | 'SW' | 'WSW' | 'W' | 'WNW' | 'NW' | 'NNW' | 'N' | 'NNE' | 'CENTER' | 'BRAHMASTHANA';

export interface VastuScoreResult {
  roomName: string;
  zone: VastuZone;
  score: number; // 0 to 100
  recommendation: string;
}

// Map 3x3 grid indices to Zones
const ZoneMap_3x3: VastuZone[][] = [
  ['NW', 'N', 'NE'],
  ['W', 'CENTER', 'E'],
  ['SW', 'S', 'SE']
];

export function generateVastuGrid(plotPolygon: Point2D[], type: VastuGridType = '9x9'): Point2D[][] {
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

function getZoneFromAngle(angleDeg: number): VastuZone {
  // Normalize angle to 0-360
  const normalized = (angleDeg % 360 + 360) % 360;
  
  // 16 zones, each 22.5 degrees wide. N is at 0/360.
  // 0 N, 22.5 NNE, 45 NE, 67.5 ENE, 90 E, 112.5 ESE, 135 SE, 157.5 SSE, 180 S, 202.5 SSW, 225 SW, 247.5 WSW, 270 W, 292.5 WNW, 315 NW, 337.5 NNW
  const zones: VastuZone[] = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(normalized / 22.5) % 16;
  return zones[index];
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

  const centerPlotX = (minX + maxX) / 2;
  const centerPlotY = (minY + maxY) / 2;

  // Brahmasthana check (central 1/9th area -> middle 3x3 of 9x9 grid)
  const normalizedX = (cx - minX) / (maxX - minX);
  const normalizedY = (cy - minY) / (maxY - minY);
  const isBrahmasthana = normalizedX >= 1/3 && normalizedX <= 2/3 && normalizedY >= 1/3 && normalizedY <= 2/3;

  // Calculate angle from center
  const dx = cx - centerPlotX;
  const dy = cy - centerPlotY;
  // Assume +Y is North, +X is East
  // Math.atan2(y, x) -> 0 is East, 90 is North. 
  // We want 0 to be North, 90 to be East.
  // So we use Math.atan2(dx, dy)
  let angleDeg = Math.atan2(dx, dy) * (180 / Math.PI);
  if (angleDeg < 0) angleDeg += 360;

  let zone: VastuZone = isBrahmasthana ? 'BRAHMASTHANA' : getZoneFromAngle(angleDeg);
  let score = 50;
  let rec = '';

  const type = room.roomType.toLowerCase();

  if (isBrahmasthana) {
    if (type === 'toilet' || type === 'kitchen') {
      score = 0;
      rec = 'CRITICAL: Wet areas strictly prohibited in Brahmasthana.';
    } else {
      score = 20;
      rec = 'Avoid heavy structures in Brahmasthana. Best kept open.';
    }
    return { roomName: room.name, zone, score, recommendation: rec };
  }

  // 16-zone evaluation
  switch (type) {
    case 'kitchen':
      if (zone === 'SE' || zone === 'SSE' || zone === 'ESE') { score = 100; rec = 'Excellent placement (Agni).'; }
      else if (zone === 'NW' || zone === 'WNW') { score = 75; rec = 'Good alternative placement (Vayavya).'; }
      else if (zone === 'NE' || zone === 'NNE' || zone === 'SW' || zone === 'SSW') { score = 10; rec = 'Avoid Kitchen here. Fire clashes with Water/Earth elements.'; }
      else { score = 40; rec = 'Suboptimal. Move to SE or NW.'; }
      break;
    case 'bedroom':
      if (zone === 'SW' || zone === 'SSW') { score = 100; rec = 'Excellent for Master Bedroom (Nairrutya).'; }
      else if (zone === 'S' || zone === 'W') { score = 80; rec = 'Good placement.'; }
      else if (zone === 'NW' || zone === 'WNW') { score = 70; rec = 'Good for guest or children room.'; }
      else if (zone === 'NE' || zone === 'ENE' || zone === 'NNE') { score = 20; rec = 'Avoid Bedroom in NE (Ishanya).'; }
      else { score = 50; rec = 'Acceptable placement.'; }
      break;
    case 'toilet':
      if (zone === 'NW' || zone === 'WNW' || zone === 'SSW') { score = 100; rec = 'Excellent placement for disposal zones.'; }
      else if (zone === 'NE' || zone === 'SW' || zone === 'NNE' || zone === 'ENE') { score = 0; rec = 'Strictly avoid Toilet here. Pollutes positive energy zones.'; }
      else { score = 30; rec = 'Suboptimal placement.'; }
      break;
    case 'living':
      if (zone === 'NE' || zone === 'E' || zone === 'N' || zone === 'NNE' || zone === 'ENE') { score = 100; rec = 'Excellent placement for living/drawing.'; }
      else { score = 60; rec = 'Acceptable placement.'; }
      break;
    default:
      rec = 'General purpose area. Vastu impact is moderate.';
      break;
  }

  return {
    roomName: room.name,
    zone,
    score,
    recommendation: rec
  };
}
