import { BylawParams, SoilCondition, RateCard } from './index';
import type { PlotSpec, RequirementSpec } from './architecture';

/**
 * A complete preset configuration that bundles every piece needed
 * to hydrate the workbench for a specific building typology.
 */
export interface PresetConfig {
  label: string;
  description: string;        // e.g. "20'×30' • G • 1BHK"
  plotSpec: PlotSpec;
  reqSpec: RequirementSpec;
  bylaws: BylawParams;
  soil: SoilCondition;
  rates: RateCard;
}

// ---------------------------------------------------------------------------
// 1. 1BHK Row House  (20×30 ft, G-only)
// ---------------------------------------------------------------------------
const ROW_HOUSE_1BHK: PresetConfig = {
  label: '1BHK Row House',
  description: "20'×30' • G • Budget single-floor",
  plotSpec: {
    width: 6,    // ~20ft in m
    length: 9,   // ~30ft in m
    facing: 'E',
    roadWidth: 6,
    floorCount: 'G',
    setbacks: { front: 1.5, rear: 1.0, left: 0.75, right: 0.75 },
  },
  reqSpec: {
    bhk: '1BHK',
    pujaRoom: false,
    toilets: { attached: true, common: false, type: 'Indian' },
    parking: false,
    porch: true,
  },
  bylaws: {
    plotWidth: 6,
    plotDepth: 9,
    frontSetback: 1.5,
    rearSetback: 1.0,
    sideSetbacks: [0.75, 0.75],
    maxFsi: 1.0,
    roadWidth: 6,
  },
  soil: { safeBearingCapacity: 120, soilType: 'MEDIUM', waterTableDepth: 2.5 },
  rates: { concrete: 5500, steel: 70000, formwork: 350, masonry: 700, excavation: 250 },
};

// ---------------------------------------------------------------------------
// 2. G+1 Residential  (30×40 ft)
// ---------------------------------------------------------------------------
const G_PLUS_1_RES: PresetConfig = {
  label: 'G+1 Residential',
  description: "30'×40' • G+1 • Standard 2BHK",
  plotSpec: {
    width: 9,
    length: 12,
    facing: 'N',
    roadWidth: 9,
    floorCount: 'G+1',
    setbacks: { front: 1.5, rear: 1.0, left: 1.0, right: 1.0 },
  },
  reqSpec: {
    bhk: '2BHK',
    pujaRoom: true,
    toilets: { attached: true, common: true, type: 'Western' },
    parking: true,
    porch: true,
  },
  bylaws: {
    plotWidth: 9,
    plotDepth: 12,
    frontSetback: 1.5,
    rearSetback: 1.0,
    sideSetbacks: [1.0, 1.0],
    maxFsi: 1.5,
    roadWidth: 9,
  },
  soil: { safeBearingCapacity: 150, soilType: 'MEDIUM', waterTableDepth: 3.0 },
  rates: { concrete: 6000, steel: 75000, formwork: 400, masonry: 800, excavation: 300 },
};

// ---------------------------------------------------------------------------
// 3. 2BHK Duplex  (30×40 ft)
// ---------------------------------------------------------------------------
const DUPLEX_2BHK: PresetConfig = {
  label: '2BHK Duplex',
  description: "30'×40' • G+1 Duplex • Owner-occupied",
  plotSpec: {
    width: 9,
    length: 12,
    facing: 'E',
    roadWidth: 9,
    floorCount: 'G+1',
    setbacks: { front: 1.5, rear: 1.0, left: 1.0, right: 1.0 },
  },
  reqSpec: {
    bhk: '2BHK',
    pujaRoom: true,
    toilets: { attached: true, common: true, type: 'Western' },
    parking: true,
    porch: true,
    vastu: {
      plotFacing: 'East',
      mandirPosition: 'NE (Ishan)',
      kitchenPosition: 'SE (Agni)',
      masterBedPosition: 'SW (Nairutya)',
      entrancePada: 'Favorable',
    },
  },
  bylaws: {
    plotWidth: 9,
    plotDepth: 12,
    frontSetback: 1.5,
    rearSetback: 1.0,
    sideSetbacks: [1.0, 1.0],
    maxFsi: 1.5,
    roadWidth: 9,
  },
  soil: { safeBearingCapacity: 150, soilType: 'MEDIUM', waterTableDepth: 3.0 },
  rates: { concrete: 6000, steel: 75000, formwork: 400, masonry: 800, excavation: 300 },
};

// ---------------------------------------------------------------------------
// 4. 3BHK Independent House  (40×50 ft)
// ---------------------------------------------------------------------------
const INDEPENDENT_3BHK: PresetConfig = {
  label: '3BHK Independent',
  description: "40'×50' • G+1 • Large family house",
  plotSpec: {
    width: 12,
    length: 15,
    facing: 'N',
    roadWidth: 12,
    floorCount: 'G+1',
    setbacks: { front: 2.0, rear: 1.5, left: 1.2, right: 1.2 },
  },
  reqSpec: {
    bhk: '3BHK',
    pujaRoom: true,
    toilets: { attached: true, common: true, type: 'Western' },
    parking: true,
    porch: true,
    vastu: {
      plotFacing: 'North',
      mandirPosition: 'NE (Ishan)',
      kitchenPosition: 'SE (Agni)',
      masterBedPosition: 'SW (Nairutya)',
      entrancePada: 'Favorable',
    },
  },
  bylaws: {
    plotWidth: 12,
    plotDepth: 15,
    frontSetback: 2.0,
    rearSetback: 1.5,
    sideSetbacks: [1.2, 1.2],
    maxFsi: 1.5,
    roadWidth: 12,
  },
  soil: { safeBearingCapacity: 180, soilType: 'HARD', waterTableDepth: 3.5 },
  rates: { concrete: 5800, steel: 73000, formwork: 380, masonry: 750, excavation: 280 },
};

// ---------------------------------------------------------------------------
// 5. G+2 Apartment  (40×60 ft)
// ---------------------------------------------------------------------------
const G_PLUS_2_APT: PresetConfig = {
  label: 'G+2 Apartment',
  description: "40'×60' • G+2 • 6-unit walk-up",
  plotSpec: {
    width: 12,
    length: 18,
    facing: 'N',
    roadWidth: 12,
    floorCount: 'G+2',
    setbacks: { front: 2.0, rear: 1.5, left: 1.2, right: 1.2 },
  },
  reqSpec: {
    bhk: '2BHK',
    pujaRoom: false,
    toilets: { attached: true, common: false, type: 'Western' },
    parking: true,
    porch: false,
  },
  bylaws: {
    plotWidth: 12,
    plotDepth: 18,
    frontSetback: 2.0,
    rearSetback: 1.5,
    sideSetbacks: [1.2, 1.2],
    maxFsi: 2.0,
    roadWidth: 12,
  },
  soil: { safeBearingCapacity: 200, soilType: 'HARD', waterTableDepth: 4.5 },
  rates: { concrete: 5800, steel: 73000, formwork: 380, masonry: 750, excavation: 250 },
};

// ---------------------------------------------------------------------------
// 6. G+3 Walk-Up  (40×60 ft)
// ---------------------------------------------------------------------------
const G_PLUS_3_WALKUP: PresetConfig = {
  label: 'G+3 Walk-Up',
  description: "40'×60' • G+3 • 8-unit residential",
  plotSpec: {
    width: 12,
    length: 18,
    facing: 'S',
    roadWidth: 12,
    floorCount: 'G+3',
    setbacks: { front: 3.0, rear: 2.0, left: 1.5, right: 1.5 },
  },
  reqSpec: {
    bhk: '2BHK',
    pujaRoom: false,
    toilets: { attached: true, common: false, type: 'Western' },
    parking: true,
    porch: false,
  },
  bylaws: {
    plotWidth: 12,
    plotDepth: 18,
    frontSetback: 3.0,
    rearSetback: 2.0,
    sideSetbacks: [1.5, 1.5],
    maxFsi: 2.5,
    roadWidth: 12,
  },
  soil: { safeBearingCapacity: 220, soilType: 'HARD', waterTableDepth: 5.0 },
  rates: { concrete: 5600, steel: 72000, formwork: 370, masonry: 720, excavation: 240 },
};

// ---------------------------------------------------------------------------
// 7. G+4 Mid-Rise  (50×80 ft)
// ---------------------------------------------------------------------------
const G_PLUS_4_MIDRISE: PresetConfig = {
  label: 'G+4 Mid-Rise',
  description: "50'×80' • G+4 • 16-unit residential",
  plotSpec: {
    width: 15,
    length: 24,
    facing: 'N',
    roadWidth: 18,
    floorCount: 'G+4',
    setbacks: { front: 4.5, rear: 3.0, left: 2.0, right: 2.0 },
  },
  reqSpec: {
    bhk: '2BHK',
    pujaRoom: false,
    toilets: { attached: true, common: false, type: 'Western' },
    parking: true,
    porch: false,
  },
  bylaws: {
    plotWidth: 15,
    plotDepth: 24,
    frontSetback: 4.5,
    rearSetback: 3.0,
    sideSetbacks: [2.0, 2.0],
    maxFsi: 3.0,
    roadWidth: 18,
  },
  soil: { safeBearingCapacity: 250, soilType: 'HARD', waterTableDepth: 6.0 },
  rates: { concrete: 5400, steel: 70000, formwork: 360, masonry: 700, excavation: 230 },
};

// ---------------------------------------------------------------------------
// 8. Commercial Shop  (20×40 ft, G-only)
// ---------------------------------------------------------------------------
const COMMERCIAL_SHOP: PresetConfig = {
  label: 'Commercial Shop',
  description: "20'×40' • G • Roadside showroom",
  plotSpec: {
    width: 6,
    length: 12,
    facing: 'S',
    roadWidth: 12,
    floorCount: 'G',
    setbacks: { front: 0, rear: 1.0, left: 0, right: 0 },
  },
  reqSpec: {
    bhk: '1BHK', // not really applicable, but keeps type happy
    pujaRoom: false,
    toilets: { attached: false, common: true, type: 'Western' },
    parking: false,
    porch: false,
  },
  bylaws: {
    plotWidth: 6,
    plotDepth: 12,
    frontSetback: 0,
    rearSetback: 1.0,
    sideSetbacks: [0, 0],
    maxFsi: 1.0,
    roadWidth: 12,
  },
  soil: { safeBearingCapacity: 150, soilType: 'MEDIUM', waterTableDepth: 3.0 },
  rates: { concrete: 5800, steel: 73000, formwork: 390, masonry: 780, excavation: 270 },
};

// ---------------------------------------------------------------------------
// 9. Mixed-Use G+2  (30×60 ft — shop below, flats above)
// ---------------------------------------------------------------------------
const MIXED_USE_G2: PresetConfig = {
  label: 'Mixed-Use G+2',
  description: "30'×60' • G+2 • Shop + 4 flats",
  plotSpec: {
    width: 9,
    length: 18,
    facing: 'W',
    roadWidth: 12,
    floorCount: 'G+2',
    setbacks: { front: 1.5, rear: 1.5, left: 1.0, right: 1.0 },
  },
  reqSpec: {
    bhk: '2BHK',
    pujaRoom: false,
    toilets: { attached: true, common: true, type: 'Western' },
    parking: true,
    porch: false,
  },
  bylaws: {
    plotWidth: 9,
    plotDepth: 18,
    frontSetback: 1.5,
    rearSetback: 1.5,
    sideSetbacks: [1.0, 1.0],
    maxFsi: 2.5,
    roadWidth: 12,
  },
  soil: { safeBearingCapacity: 200, soilType: 'HARD', waterTableDepth: 4.0 },
  rates: { concrete: 5900, steel: 74000, formwork: 400, masonry: 790, excavation: 280 },
};

// ---------------------------------------------------------------------------
// 10. Farmhouse Villa  (60×80 ft, G-only, large plot)
// ---------------------------------------------------------------------------
const FARMHOUSE_VILLA: PresetConfig = {
  label: 'Farmhouse Villa',
  description: "60'×80' • G • Luxury low-density",
  plotSpec: {
    width: 18,
    length: 24,
    facing: 'E',
    roadWidth: 6,
    floorCount: 'G',
    setbacks: { front: 6.0, rear: 4.5, left: 3.0, right: 3.0 },
  },
  reqSpec: {
    bhk: '3BHK',
    pujaRoom: true,
    toilets: { attached: true, common: true, type: 'Western' },
    parking: true,
    porch: true,
    vastu: {
      plotFacing: 'East',
      mandirPosition: 'NE (Ishan)',
      kitchenPosition: 'SE (Agni)',
      masterBedPosition: 'SW (Nairutya)',
      entrancePada: 'Favorable',
    },
  },
  bylaws: {
    plotWidth: 18,
    plotDepth: 24,
    frontSetback: 6.0,
    rearSetback: 4.5,
    sideSetbacks: [3.0, 3.0],
    maxFsi: 0.5,
    roadWidth: 6,
  },
  soil: { safeBearingCapacity: 160, soilType: 'MEDIUM', waterTableDepth: 3.0 },
  rates: { concrete: 6200, steel: 76000, formwork: 420, masonry: 850, excavation: 320 },
};

// ---------------------------------------------------------------------------
// Backwards-compatible exports for existing test code
// ---------------------------------------------------------------------------
export const G_PLUS_1_RESIDENTIAL = G_PLUS_1_RES;
export const G_PLUS_2_APARTMENT = G_PLUS_2_APT;

// ---------------------------------------------------------------------------
// Master list — ordered roughly by plot size / complexity
// ---------------------------------------------------------------------------
export const PRESETS: PresetConfig[] = [
  ROW_HOUSE_1BHK,
  G_PLUS_1_RES,
  DUPLEX_2BHK,
  INDEPENDENT_3BHK,
  G_PLUS_2_APT,
  G_PLUS_3_WALKUP,
  G_PLUS_4_MIDRISE,
  COMMERCIAL_SHOP,
  MIXED_USE_G2,
  FARMHOUSE_VILLA,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PLOT_PRESETS: Record<string, any> = PRESETS.reduce<Record<string, PresetConfig>>(
  (acc, p) => { acc[p.label] = p; return acc; },
  {}
);
