export interface WallMeasurement {
  length: number; // m
  height: number; // m
  thickness: number; // m
  openings: { width: number; height: number }[]; // m
  intersectingCols: { width: number }[]; // m
  intersectingBeams: { depth: number }[]; // m
}

export interface FootingMeasurement {
  length: number; // m
  width: number; // m
  depth: number; // m
}

export function computeMasonryVolume(walls: WallMeasurement[]): { volume: number; plasterArea: number } {
  let totalVolume = 0;
  let totalPlasterArea = 0; // assuming single-sided plastering

  for (const wall of walls) {
    const grossArea = wall.length * wall.height;
    
    // Deduct openings
    let openingArea = 0;
    for (const op of wall.openings) {
      openingArea += op.width * op.height;
    }

    // Deduct structural intersections (simplified: column strips and beam strips)
    let structArea = 0;
    for (const col of wall.intersectingCols) {
      structArea += col.width * wall.height;
    }
    for (const beam of wall.intersectingBeams) {
      // Beam depth deduction across clear span
      structArea += wall.length * beam.depth;
    }

    // Ensure we don't over-deduct structural areas
    const maxDeductibleStructArea = grossArea - openingArea;
    const effectiveStructDeduction = Math.min(structArea, maxDeductibleStructArea);

    const netArea = Math.max(0, grossArea - openingArea - effectiveStructDeduction);
    
    totalVolume += netArea * wall.thickness;
    // Assuming plaster covers the net area. Jamb allowances could be added, but this is the primary area.
    totalPlasterArea += netArea; 
  }

  return { volume: totalVolume, plasterArea: totalPlasterArea };
}

export function computeExcavationVolume(footings: FootingMeasurement[]): number {
  let volume = 0;
  for (const f of footings) {
    // 300mm (0.3m) side working clearance on all sides => + 0.6m total to L and B
    volume += (f.length + 0.6) * (f.width + 0.6) * f.depth;
  }
  return volume;
}

export function computeFootingFormwork(footings: FootingMeasurement[]): number {
  let area = 0;
  for (const f of footings) {
    // 2 * (L + B) * D
    area += 2 * (f.length + f.width) * f.depth;
  }
  return area;
}
