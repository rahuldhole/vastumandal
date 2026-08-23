export interface RateCard {
  name: string;
  region: string;
  cementPerBag: number; // in INR
  steelPerKg: number; // in INR
  sandPerCft: number; // in INR
  aggregatePerCft: number; // in INR
}

export const Tier1Rates: RateCard = {
  name: "Tier 1 City (e.g. Mumbai, Bangalore)",
  region: "Tier 1",
  cementPerBag: 450,
  steelPerKg: 85,
  sandPerCft: 80,
  aggregatePerCft: 60
};

export const Tier2Rates: RateCard = {
  name: "Tier 2 City (e.g. Pune, Jaipur)",
  region: "Tier 2",
  cementPerBag: 380,
  steelPerKg: 75,
  sandPerCft: 60,
  aggregatePerCft: 45
};

export function getRateCard(region: 'Tier1' | 'Tier2'): RateCard {
  return region === 'Tier1' ? Tier1Rates : Tier2Rates;
}

export function calculateMaterialCost(rates: RateCard, cementBags: number, steelKg: number, sandCft: number, aggregateCft: number): number {
  return (
    rates.cementPerBag * cementBags +
    rates.steelPerKg * steelKg +
    rates.sandPerCft * sandCft +
    rates.aggregatePerCft * aggregateCft
  );
}
