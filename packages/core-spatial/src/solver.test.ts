import { describe, it, expect } from 'vitest';
import { generateFloorPlan } from './solver';
import { PlotSpec, RequirementSpec } from '@vastumandal/dwg-schemas';

describe('Spatial Solver', () => {
  it('generates a floor plan for a 30x40 ft plot', () => {
    const plot: PlotSpec = {
      width: 30,
      length: 40,
      facing: 'E',
      setbacks: { front: 5, rear: 3, left: 3, right: 3 },
      roadWidth: 20,
      floorCount: 'G',
    };

    const req: RequirementSpec = {
      bhk: '2BHK',
      pujaRoom: true,
      toilets: { attached: true, common: true, type: 'Western' },
      parking: true,
      porch: true,
    };

    const plan = generateFloorPlan(plot, req);
    expect(plan.plotBounds.width).toBe(30);
    expect(plan.plotBounds.length).toBe(40);
    expect(plan.buildableEnvelope.width).toBe(24); // 30 - 3 - 3
    expect(plan.buildableEnvelope.length).toBe(32); // 40 - 5 - 3
    expect(plan.rooms.length).toBeGreaterThan(0);
  });

  it('generates a floor plan for a 30x50 ft plot (North facing)', () => {
    const plot: PlotSpec = {
      width: 30,
      length: 50,
      facing: 'N',
      setbacks: { front: 5, rear: 3, left: 3, right: 3 },
      roadWidth: 20,
      floorCount: 'G',
    };

    const req: RequirementSpec = {
      bhk: '3BHK',
      pujaRoom: true,
      toilets: { attached: true, common: true, type: 'Indian' },
      parking: true,
      porch: true,
    };

    const plan = generateFloorPlan(plot, req);
    expect(plan.plotBounds.width).toBe(30);
    expect(plan.plotBounds.length).toBe(50);
  });
});
