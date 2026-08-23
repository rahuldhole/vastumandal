import { PlotSpec, RequirementSpec, FloorPlan, Room } from '@vastumandal/dwg-schemas';

// Simple mock implementation for the benchmark.
// A real spatial constraint solver would be much more complex.
export function generateFloorPlan(plot: PlotSpec, req: RequirementSpec): FloorPlan {
  const buildableWidth = plot.width - (plot.setbacks.left + plot.setbacks.right);
  const buildableLength = plot.length - (plot.setbacks.front + plot.setbacks.rear);

  const rooms: Room[] = [];
  
  // Just create a dummy living room for now to satisfy types
  rooms.push({
    id: 'living_1',
    name: 'Living Room',
    type: 'living',
    bounds: {
      x: plot.setbacks.left,
      y: plot.setbacks.front,
      width: Math.max(10, buildableWidth * 0.5), // NBC min 10 ft
      length: Math.max(12, buildableLength * 0.5)
    },
    doors: [],
    windows: []
  });

  return {
    plotBounds: {
      width: plot.width,
      length: plot.length
    },
    buildableEnvelope: {
      x: plot.setbacks.left,
      y: plot.setbacks.front,
      width: buildableWidth,
      length: buildableLength
    },
    rooms: rooms,
    columns: [],
    circulationSpines: [],
    scheduleOfOpenings: []
  };
}
