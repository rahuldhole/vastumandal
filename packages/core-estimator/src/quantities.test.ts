import { describe, it, expect } from 'vitest';
import { computeMasonryVolume, computeExcavationVolume } from './quantities';

describe('Quantities Engine', () => {
  it('should compute precise masonry volume with void deductions', () => {
    const walls = [
      {
        length: 5, // 5m
        height: 3, // 3m
        thickness: 0.23, // 230mm
        openings: [{ width: 1, height: 2.1 }], // 1 door 2.1 sqm
        intersectingCols: [{ width: 0.23 }, { width: 0.23 }],
        intersectingBeams: [{ depth: 0.45 }] // 450mm beam depth
      }
    ];

    const result = computeMasonryVolume(walls);
    // Gross = 15
    // Openings = 2.1
    // Cols = (0.23 * 3) * 2 = 1.38
    // Beam = 5 * 0.45 = 2.25
    // Total deduction = 2.1 + 1.38 + 2.25 = 5.73
    // Net Area = 15 - 5.73 = 9.27
    // Vol = 9.27 * 0.23 = 2.1321
    expect(result.volume).toBeCloseTo(2.1321, 4);
    expect(result.plasterArea).toBeCloseTo(9.27, 2);
  });

  it('should compute exact excavation pit formulas with working clearance', () => {
    const footings = [
      { length: 1.5, width: 1.5, depth: 1.5 }
    ];
    // L = 1.5 + 0.6 = 2.1
    // B = 1.5 + 0.6 = 2.1
    // D = 1.5
    // Vol = 2.1 * 2.1 * 1.5 = 6.615
    const vol = computeExcavationVolume(footings);
    expect(vol).toBeCloseTo(6.615, 3);
  });
});
