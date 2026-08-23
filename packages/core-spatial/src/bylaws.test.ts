import { describe, it, expect } from 'vitest';
import { validateBylaws } from './bylaws';
import type { BylawParams } from '@vastumandal/dwg-schemas/src/spatial';

describe('Bylaw Validator', () => {
  const defaultParams: BylawParams = {
    plotPolygon: [[0, 0], [12, 0], [12, 18], [0, 18]],
    frontSetback: 3,
    rearSetback: 1.5,
    sideSetbacks: [1, 1],
    maxFsi: 2.0,
    roadWidth: 9
  };

  it('should detect setback encroachment', () => {
    const polygon: [number, number][] = [
      [0, 3], // Violates sideSetbacks[0] which is 1
      [10, 3],
      [10, 10],
      [0, 10]
    ];
    
    const result = validateBylaws(defaultParams, polygon, 100, 100);
    expect(result.valid).toBe(false);
    expect(result.diagnostics.find(d => d.code === 'SETBACK_ENCROACHMENT')).toBeDefined();
  });

  it('should validate FSI compliance', () => {
    const polygon: [number, number][] = [
      [2, 4],
      [10, 4],
      [10, 10],
      [2, 10]
    ];
    // plot area = 12 * 18 = 216. max FSI = 2.0, max built up = 432
    const resultPass = validateBylaws(defaultParams, polygon, 400, 100);
    expect(resultPass.valid).toBe(true);

    const resultFail = validateBylaws(defaultParams, polygon, 500, 100);
    expect(resultFail.valid).toBe(false);
    expect(resultFail.diagnostics.find(d => d.code === 'FSI_EXCEEDED')).toBeDefined();
  });

  it('should validate staircase safety ratios and pitch', () => {
    const polygon: [number, number][] = [[2, 4], [10, 4], [10, 10], [2, 10]];
    
    // Pitch = atan(200/250) = 38.6 degrees (> 38)
    const resultFail = validateBylaws(defaultParams, polygon, 100, 100, { riser: 200, tread: 250 });
    expect(resultFail.valid).toBe(false);
    expect(resultFail.diagnostics.find(d => d.code === 'STAIRCASE_UNSAFE')).toBeDefined();
    
    // Pitch = atan(150/300) = 26.5 degrees
    const resultPass = validateBylaws(defaultParams, polygon, 100, 100, { riser: 150, tread: 300 });
    expect(resultPass.valid).toBe(true);
  });
});
