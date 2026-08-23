import type { BylawParams } from '@vastumandal/dwg-schemas/src/spatial';

export interface BylawDiagnostic {
  level: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  code: string;
}

export interface BylawValidationResult {
  valid: boolean;
  diagnostics: BylawDiagnostic[];
}

import { calculatePolygonArea, isPointInPolygon, offsetPolygon, Point2D } from './polygon';

// Assumes coordinates (0,0) is bottom-left of the plot if standard, or arbitrary for irregular
export function validateBylaws(
  params: BylawParams,
  outerWallPolygon: Point2D[], // Array of [x, y] representing outer footprint
  totalBuiltUpArea: number, // Across all floors
  groundFloorFootprintArea: number,
  staircaseSpecs?: { riser: number; tread: number }
): BylawValidationResult {
  const diagnostics: BylawDiagnostic[] = [];
  let valid = true;

  // 1. Setback Encroachment
  // We compute an allowed envelope by offsetting the plot polygon inwards.
  // For arbitrary polygons, we use the maximum required setback to ensure compliance,
  // or a more advanced logic would map specific edges to front/rear/sides.
  const maxSetback = Math.max(params.frontSetback, params.rearSetback, ...params.sideSetbacks);
  
  // Negative distance for inward offset
  const allowedEnvelope = offsetPolygon(params.plotPolygon as Point2D[], -maxSetback);

  let setbackViolated = false;
  for (const point of outerWallPolygon) {
    if (!isPointInPolygon(point, allowedEnvelope)) {
      setbackViolated = true;
      break;
    }
  }

  if (setbackViolated) {
    valid = false;
    diagnostics.push({
      level: 'ERROR',
      code: 'SETBACK_ENCROACHMENT',
      message: `Building footprint encroaches on allowable setbacks (checked against max setback of ${maxSetback}mm).`
    });
  } else {
    diagnostics.push({
      level: 'INFO',
      code: 'SETBACK_PASS',
      message: 'Setback requirements met.'
    });
  }

  // 2. FAR / FSI Calculation
  const plotArea = calculatePolygonArea(params.plotPolygon as Point2D[]); // Need mm^2 or m^2 consistently
  const fsi = totalBuiltUpArea / plotArea;

  if (fsi > params.maxFsi) {
    valid = false;
    diagnostics.push({
      level: 'ERROR',
      code: 'FSI_EXCEEDED',
      message: `Calculated FSI (${fsi.toFixed(2)}) exceeds maximum allowed (${params.maxFsi.toFixed(2)}).`
    });
  } else {
    diagnostics.push({
      level: 'INFO',
      code: 'FSI_PASS',
      message: `FSI (${fsi.toFixed(2)}) is within allowed limits.`
    });
  }

  // 3. Ground Coverage
  const coveragePercent = (groundFloorFootprintArea / plotArea) * 100;
  diagnostics.push({
    level: 'INFO',
    code: 'GROUND_COVERAGE',
    message: `Ground coverage is ${coveragePercent.toFixed(2)}%.`
  });

  // 4. Staircase Safety Ratio
  if (staircaseSpecs) {
    const { riser, tread } = staircaseSpecs;
    const isRiserValid = riser >= 150 && riser <= 180;
    const isTreadValid = tread >= 250 && tread <= 300;
    const pitch = Math.atan(riser / tread) * (180 / Math.PI);

    if (!isRiserValid || !isTreadValid || pitch > 38) {
      valid = false;
      diagnostics.push({
        level: 'ERROR',
        code: 'STAIRCASE_UNSAFE',
        message: `Staircase unsafe. Riser: ${riser}mm, Tread: ${tread}mm, Pitch: ${pitch.toFixed(1)}° (Max 38°).`
      });
    } else {
      diagnostics.push({
        level: 'INFO',
        code: 'STAIRCASE_PASS',
        message: `Staircase dimensions are safe and code-compliant.`
      });
    }
  }

  return {
    valid,
    diagnostics
  };
}
