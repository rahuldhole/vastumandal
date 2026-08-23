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

// Assumes coordinates (0,0) is bottom-left of the plot
export function validateBylaws(
  params: BylawParams,
  outerWallPolygon: [number, number][], // Array of [x, y] representing outer footprint
  totalBuiltUpArea: number, // Across all floors
  groundFloorFootprintArea: number,
  staircaseSpecs?: { riser: number; tread: number }
): BylawValidationResult {
  const diagnostics: BylawDiagnostic[] = [];
  let valid = true;

  // 1. Setback Encroachment
  // Plot boundaries: X [0, plotWidth], Y [0, plotDepth]
  // Allowed envelope:
  const minX = params.sideSetbacks[0];
  const maxX = params.plotWidth - params.sideSetbacks[1];
  // Assuming front is Y=0
  const minY = params.frontSetback;
  const maxY = params.plotDepth - params.rearSetback;

  let setbackViolated = false;
  for (const [x, y] of outerWallPolygon) {
    if (x < minX || x > maxX || y < minY || y > maxY) {
      setbackViolated = true;
      break;
    }
  }

  if (setbackViolated) {
    valid = false;
    diagnostics.push({
      level: 'ERROR',
      code: 'SETBACK_ENCROACHMENT',
      message: `Building footprint encroaches on allowable setbacks. Allowed Envelope: X[${minX} to ${maxX}], Y[${minY} to ${maxY}].`
    });
  } else {
    diagnostics.push({
      level: 'INFO',
      code: 'SETBACK_PASS',
      message: 'Setback requirements met.'
    });
  }

  // 2. FAR / FSI Calculation
  const plotArea = params.plotWidth * params.plotDepth;
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
