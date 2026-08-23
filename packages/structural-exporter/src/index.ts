import { FloorPlan, Column } from '@vastumandal/dwg-schemas';

export function exportToStaad(floorPlan: FloorPlan, columns: Column[]): string {
  let stdData = `STAAD SPACE
START JOB INFORMATION
ENGINEER DATE ${new Date().toLocaleDateString()}
END JOB INFORMATION
INPUT WIDTH 79
UNIT METER KN
JOINT COORDINATES
`;
  
  // Basic mock geometry string for STAAD format
  stdData += `1 0 0 0\n`;
  stdData += `2 3 0 0\n`;
  stdData += `MEMBER INCIDENCES\n`;
  stdData += `1 1 2\n`;
  
  stdData += `FINISH\n`;

  return stdData;
}

export function exportToEtabs(floorPlan: FloorPlan, columns: Column[]): string {
  let edbData = `ETABS TEXT MODEL FILE
  
TABLE:  "PROJECT INFORMATION"
   Company=VastuMandal
  
TABLE:  "POINT COORDINATES"
   Point=1 X=0 Y=0 Z=0
   Point=2 X=3 Y=0 Z=0
`;

  return edbData;
}
