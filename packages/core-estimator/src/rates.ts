export interface RateCard {
  name: string;
  region: string;
  cementPerBag: number; // in INR
  steelPerKg: number; // in INR
  sandPerCft: number; // in INR
  aggregatePerCft: number; // in INR
  labourConcretePerCum: number; // in INR
  labourMasonryPerSqm: number; // in INR
}

export const CPWD_DSR_2024: RateCard = {
  name: "CPWD DSR 2024 (Base)",
  region: "National",
  cementPerBag: 400,
  steelPerKg: 75,
  sandPerCft: 65,
  aggregatePerCft: 50,
  labourConcretePerCum: 800,
  labourMasonryPerSqm: 450
};

export const State_PWD_2023: RateCard = {
  name: "State PWD DSR 2023",
  region: "State",
  cementPerBag: 380,
  steelPerKg: 70,
  sandPerCft: 60,
  aggregatePerCft: 45,
  labourConcretePerCum: 750,
  labourMasonryPerSqm: 400
};

export const CustomLocalContractor: RateCard = {
  name: "Custom Local Contractor",
  region: "Local",
  cementPerBag: 360,
  steelPerKg: 65,
  sandPerCft: 50,
  aggregatePerCft: 40,
  labourConcretePerCum: 600,
  labourMasonryPerSqm: 350
};

export function getRateCard(profile: 'CPWD' | 'PWD' | 'Local'): RateCard {
  if (profile === 'CPWD') return CPWD_DSR_2024;
  if (profile === 'PWD') return State_PWD_2023;
  return CustomLocalContractor;
}

export function calculateMaterialCost(rates: RateCard, cementBags: number, steelKg: number, sandCft: number, aggregateCft: number): number {
  return (
    rates.cementPerBag * cementBags +
    rates.steelPerKg * steelKg +
    rates.sandPerCft * sandCft +
    rates.aggregatePerCft * aggregateCft
  );
}
