import { BylawParams, SoilCondition, RateCard } from './index';

export const G_PLUS_1_RESIDENTIAL: { bylaws: BylawParams; soil: SoilCondition; rates: RateCard } = {
  bylaws: {
    plotWidth: 9, // 30ft
    plotDepth: 12, // 40ft
    frontSetback: 1.5,
    rearSetback: 1.0,
    sideSetbacks: [1.0, 1.0],
    maxFsi: 1.5,
    roadWidth: 9, // 30ft road
  },
  soil: {
    safeBearingCapacity: 150, // kN/m2 (Medium soil typical)
    soilType: 'MEDIUM',
    waterTableDepth: 3.0,
  },
  rates: {
    concrete: 6000,
    steel: 75,
    formwork: 400,
    masonry: 800,
    excavation: 300,
  },
};

export const G_PLUS_2_APARTMENT: { bylaws: BylawParams; soil: SoilCondition; rates: RateCard } = {
  bylaws: {
    plotWidth: 12, // 40ft
    plotDepth: 18, // 60ft
    frontSetback: 2.0,
    rearSetback: 1.5,
    sideSetbacks: [1.2, 1.2],
    maxFsi: 2.0,
    roadWidth: 12, // 40ft road
  },
  soil: {
    safeBearingCapacity: 200, // kN/m2 (Hard soil preferred for G+2)
    soilType: 'HARD',
    waterTableDepth: 4.5,
  },
  rates: {
    concrete: 5800,
    steel: 73,
    formwork: 380,
    masonry: 750,
    excavation: 250,
  },
};

export const PLOT_PRESETS: Record<string, any> = {
  'G+1 Residential': G_PLUS_1_RESIDENTIAL,
  'G+2 Apartment': G_PLUS_2_APARTMENT
};
