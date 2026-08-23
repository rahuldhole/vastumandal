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
