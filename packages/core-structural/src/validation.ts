import { Column, Beam, StructuralFraming } from './types';

export interface ValidationIssue {
  elementId: string;
  elementType: 'COLUMN' | 'BEAM' | 'SLAB';
  issueType: 'SEISMIC_GUARD' | 'DEFLECTION_LIMIT' | 'GENERAL';
  message: string;
  severity: 'WARNING' | 'ERROR';
}

/**
 * Validates a structural framing system against basic seismic and deflection codes.
 */
export function validateFraming(framing: StructuralFraming, code: 'IS456' | 'IS13920' | 'ACI318' = 'IS13920'): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Column Guards
  framing.columns.forEach(col => {
    // IS 13920 minimum dimension is generally 200mm (sometimes updated to 300mm depending on zone, but we stick to 200-230mm)
    const minDim = Math.min(col.width, col.depth);
    if (minDim < 200) {
      issues.push({
        elementId: col.id,
        elementType: 'COLUMN',
        issueType: 'SEISMIC_GUARD',
        message: `Column minimum dimension is ${minDim}mm. Ductile detailing codes recommend at least 200mm.`,
        severity: 'WARNING'
      });
    }

    // ACI 318 or IS 13920 cross section aspect ratio limit (usually depth/width <= 0.4 or 2.5)
    // Actually aspect ratio max is usually around 2.5 to 3.0 for columns before they act as shear walls.
    const maxDim = Math.max(col.width, col.depth);
    if (maxDim / minDim > 3.0) {
      issues.push({
        elementId: col.id,
        elementType: 'COLUMN',
        issueType: 'SEISMIC_GUARD',
        message: `Column aspect ratio is ${maxDim/minDim}. Ratios > 3.0 should be designed as shear walls.`,
        severity: 'WARNING'
      });
    }
  });

  // Beam Guards
  framing.beams.forEach(beam => {
    // Minimum width for beams in seismic zones is usually 200mm
    if (beam.width < 200) {
      issues.push({
        elementId: beam.id,
        elementType: 'BEAM',
        issueType: 'SEISMIC_GUARD',
        message: `Beam width is ${beam.width}mm. Minimum recommended is 200mm for seismic detailing.`,
        severity: 'WARNING'
      });
    }

    // Deflection limit: Span to depth ratio
    // IS 456 basic values: 7 for cantilever, 20 for simply supported, 26 for continuous.
    // Let's assume continuous (26) or simply supported (20). We'll use a conservative guard of 20.
    const spanToDepth = beam.clearSpan / beam.depth;
    if (spanToDepth > 20) {
      issues.push({
        elementId: beam.id,
        elementType: 'BEAM',
        issueType: 'DEFLECTION_LIMIT',
        message: `Beam span-to-depth ratio is ${spanToDepth.toFixed(1)}. Standard limits recommend <= 20 for simply supported beams to control deflection.`,
        severity: 'WARNING'
      });
    }
  });

  return issues;
}
