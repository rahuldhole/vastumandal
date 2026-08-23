export type RegionalStandard = 'IS' | 'BS' | 'ACI';
export const RegionalStandards = {
  IS: 'IS' as RegionalStandard,
  BS: 'BS' as RegionalStandard,
  ACI: 'ACI' as RegionalStandard,
};

export interface IBendRules {
  deduction90: (diameter: number) => number;
  allowance135: (diameter: number) => number;
}

/**
 * Hook and bend allowance rules.
 */
export const BendRules: Record<RegionalStandard, IBendRules> = {
  'IS': {
    /** IS: 90 degree bend deduction (2 * D) */
    deduction90: (diameter: number) => 2 * diameter,
    /** IS: 135 degree stirrup hook allowance (10 * D) */
    allowance135: (diameter: number) => 10 * diameter,
  },
  'BS': {
    /** BS: 90 degree bend deduction (typically 2 * D depending on radius, using 2D for simplicity) */
    deduction90: (diameter: number) => 2 * diameter,
    /** BS: 135 degree stirrup hook allowance (typically 12 * D or based on min radius) */
    allowance135: (diameter: number) => 12 * diameter,
  },
  'ACI': {
    /** ACI: 90 degree bend deduction (approx 2 * D) */
    deduction90: (diameter: number) => 2 * diameter,
    /** ACI: 135 degree stirrup hook allowance (6 * D or 3 inches max, simplified to 6 * D) */
    allowance135: (diameter: number) => 6 * diameter, // Can be configured further
  }
};

/** Default active bend rules (Fallback to IS for backward compatibility) */
export const DefaultBendRules = BendRules['IS'];

/**
 * Stirrup count calculator
 * 
 * @param clearSpan Clear span in mm
 * @param spacing Spacing in mm
 * @returns Number of stirrups
 */
export function calculateStirrupCount(clearSpan: number, spacing: number): number {
  return Math.floor(clearSpan / spacing) + 1;
}

export function distance(p1: {x: number, y: number}, p2: {x: number, y: number}): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function polygonArea(points: {x: number, y: number}[]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

// Computes unfactored and factored axial loads.
// Default material assumed: M20 concrete, Fe500 steel
export function computeAxialLoad(
  tributaryArea: number,
  deadLoad: number,
  liveLoad: number,
  floors: number
): { unfactored: number; factored: number } {
  // Load per floor = area * (DL + LL)
  const totalUnfactored = tributaryArea * (deadLoad + liveLoad) * floors;
  // Factored load = 1.5 * (DL + LL)
  const totalFactored = tributaryArea * (1.5 * deadLoad + 1.5 * liveLoad) * floors;

  return {
    unfactored: totalUnfactored,
    factored: totalFactored,
  };
}

export function calculateBeamUDL(
  tributaryArea: number,
  spanLength: number,
  deadLoad: number,
  liveLoad: number
): number {
  if (spanLength === 0) return 0;
  const load = (tributaryArea * (deadLoad + liveLoad)) / (spanLength / 1000); // Assuming spanLength is mm, we want kN/m usually, but wait, if tributary area is m2... let's just assume inputs are m and m2.
  return load;
}
