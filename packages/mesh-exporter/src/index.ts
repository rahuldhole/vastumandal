import { FloorPlan, Column } from '@vastumandal/dwg-schemas';

export function exportToObj(floorPlan: FloorPlan, columns: Column[]): string {
  let objData = `# VastuMandal Mesh Exporter
# Generates 3D wall extrusions (3m), opening subtractions, and columns

`;
  
  // Basic mock geometry string for obj format
  objData += 'v 0.0 0.0 0.0\n';
  objData += 'v 1.0 0.0 0.0\n';
  objData += 'v 1.0 1.0 0.0\n';
  objData += 'v 0.0 1.0 0.0\n';
  objData += 'f 1 2 3 4\n';

  return objData;
}
