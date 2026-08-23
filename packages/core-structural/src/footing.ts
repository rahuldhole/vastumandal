import { Column, Footing } from './types';

export interface FootingDesign {
  length: number; // mm
  width: number;  // mm
  depth: number;  // mm
  netSoilPressure: number; // kN/m2
  bottomMeshRebar: {
    barDia: number; // mm
    spacing: number; // mm
  };
}

export function sizeFooting(
  axialLoadUnfactoredKN: number,
  columnWidth: number,
  columnDepth: number,
  safeBearingCapacity: number // kN/m2
): FootingDesign {
  // 1. Required Area
  const P_withSelfWeight = axialLoadUnfactoredKN * 1.10; // 10% for footing and soil
  const A_req = P_withSelfWeight / safeBearingCapacity; // m2

  // 2. Footing Dimensions (L x B) matching column aspect ratio
  // let aspect = col_L / col_B (assuming depth is L and width is B)
  const colL = Math.max(columnWidth, columnDepth);
  const colB = Math.min(columnWidth, columnDepth);
  const aspect = colL / colB;

  // B * L = A_req => B * (B * aspect) = A_req => B^2 = A_req / aspect
  const B_req = Math.sqrt(A_req / aspect);
  const L_req = B_req * aspect;

  // Round up to nearest 100mm
  let width = Math.ceil((B_req * 1000) / 100) * 100;
  let length = Math.ceil((L_req * 1000) / 100) * 100;

  // Ensure minimum dimensions
  width = Math.max(1000, width);
  length = Math.max(1000, length);

  // Recalculate net soil pressure (upward pressure for structural design)
  // factored load for structural checks = 1.5 * unFactoredLoad
  const P_factored = axialLoadUnfactoredKN * 1.5;
  const netSoilPressure = P_factored / ((width / 1000) * (length / 1000)); // kN/m2

  // 3. Footing Depth
  // A full implementation would check one-way and two-way shear.
  // We approximate based on load magnitude, defaulting to min 300mm.
  let depth = 300;
  if (P_factored > 1000) depth = 400;
  if (P_factored > 2000) depth = 500;
  if (P_factored > 3000) depth = 600;

  // 4. Bottom Mesh Rebar (Simplified based on bending moment)
  // M_u = p * (L - colL)^2 / 8
  const cantileverL = (length - colL) / 2000; // in meters
  const Mu = netSoilPressure * width/1000 * Math.pow(cantileverL, 2) / 2; // kN.m for total width

  // Rebar: standard high-yield bars
  let barDia = 10;
  let spacing = 150;
  
  // Very rough sizing
  if (Mu > 50) {
    barDia = 12;
    spacing = 125;
  }
  if (Mu > 100) {
    barDia = 16;
    spacing = 150;
  }

  return {
    length,
    width,
    depth,
    netSoilPressure,
    bottomMeshRebar: {
      barDia,
      spacing
    }
  };
}

// Check if two bounding boxes overlap
function rectsOverlap(
  r1: { x: number, y: number, w: number, h: number },
  r2: { x: number, y: number, w: number, h: number }
): boolean {
  return !(
    r2.x >= r1.x + r1.w || 
    r2.x + r2.w <= r1.x || 
    r2.y >= r1.y + r1.h || 
    r2.y + r2.h <= r1.y
  );
}

export function generateFootingLayout(columns: Column[], sbc: number = 200, assumedLoadPerFloorKN: number = 500): Footing[] {
  let footings: Footing[] = [];

  // Generate initial isolated footings
  columns.forEach(col => {
    // Basic load assumption for a 3-4 story residential building
    const load = assumedLoadPerFloorKN * 3; 
    const design = sizeFooting(load, col.width, col.depth, sbc);
    
    footings.push({
      id: `footing-${col.id}`,
      columnId: col.id,
      center: { x: col.center.x, y: col.center.y },
      length: design.length,
      width: design.width,
      depth: design.depth,
      type: 'ISOLATED'
    });
  });

  // Collision detection and Combined Footing Generation
  // A naive implementation that merges colliding footings into one bounding combined footing
  let hasCollisions = true;
  while(hasCollisions) {
    hasCollisions = false;
    let mergedThisPass = false;

    for (let i = 0; i < footings.length; i++) {
      if (mergedThisPass) break;
      for (let j = i + 1; j < footings.length; j++) {
        const f1 = footings[i];
        const f2 = footings[j];

        const r1 = { x: f1.center.x - f1.width/2, y: f1.center.y - f1.length/2, w: f1.width, h: f1.length };
        const r2 = { x: f2.center.x - f2.width/2, y: f2.center.y - f2.length/2, w: f2.width, h: f2.length };

        if (rectsOverlap(r1, r2)) {
          // Merge them into a combined footing (simplified bounding box)
          const minX = Math.min(r1.x, r2.x);
          const maxX = Math.max(r1.x + r1.w, r2.x + r2.w);
          const minY = Math.min(r1.y, r2.y);
          const maxY = Math.max(r1.y + r1.h, r2.y + r2.h);

          const combinedWidth = maxX - minX;
          const combinedLength = maxY - minY;
          const cx = minX + combinedWidth / 2;
          const cy = minY + combinedLength / 2;
          const combinedDepth = Math.max(f1.depth, f2.depth) + 100; // slightly thicker for combined

          const combinedFooting: Footing = {
            id: `comb-${f1.id}-${f2.id}`,
            columnId: `${f1.columnId},${f2.columnId}`, // Represents multiple columns
            center: { x: cx, y: cy },
            length: combinedLength,
            width: combinedWidth,
            depth: combinedDepth,
            type: 'COMBINED'
          };

          // Remove old, add new
          footings.splice(j, 1);
          footings.splice(i, 1);
          footings.push(combinedFooting);
          
          hasCollisions = true;
          mergedThisPass = true;
          break;
        }
      }
    }
  }

  return footings;
}
