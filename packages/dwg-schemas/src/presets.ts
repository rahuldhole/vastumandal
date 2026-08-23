import { PlotSpec } from './index';

export const PLOT_PRESETS: Record<string, PlotSpec> = {
  '20x30': {
    width: 20,
    length: 30,
    facing: 'E',
    setbacks: { front: 3, rear: 2, left: 1.5, right: 1.5 },
    roadWidth: 20,
    floorCount: 'G',
  },
  '30x40': {
    width: 30,
    length: 40,
    facing: 'E',
    setbacks: { front: 5, rear: 3, left: 3, right: 3 },
    roadWidth: 30,
    floorCount: 'G+1',
  },
  '30x50': {
    width: 30,
    length: 50,
    facing: 'N',
    setbacks: { front: 5, rear: 3, left: 3, right: 3 },
    roadWidth: 30,
    floorCount: 'G+1',
  },
  '40x60': {
    width: 40,
    length: 60,
    facing: 'E',
    setbacks: { front: 10, rear: 5, left: 5, right: 5 },
    roadWidth: 40,
    floorCount: 'G+1',
  }
};
