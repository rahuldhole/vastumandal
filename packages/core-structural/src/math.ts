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
