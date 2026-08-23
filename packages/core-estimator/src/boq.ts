import type { RateCard, BOQSummary, BOQLineItem, BBSReport } from '@vastumandal/dwg-schemas';

export interface ProjectQuantities {
  excavationVolume: number; // m3
  concreteVolume: number; // m3
  masonryVolume: number; // m3
  plasterArea: number; // m2
  formworkArea: number; // m2
}

export function generateBOQ(
  quantities: ProjectQuantities,
  bbsReport: BBSReport,
  rateCard: RateCard
): BOQSummary {
  const lineItems: BOQLineItem[] = [];
  let subTotal = 0;

  const addItem = (
    itemCode: string,
    description: string,
    category: BOQLineItem['category'],
    quantity: number,
    unit: string,
    unitRate: number
  ) => {
    if (quantity <= 0) return;
    const totalAmount = quantity * unitRate;
    subTotal += totalAmount;
    lineItems.push({
      itemCode,
      description,
      category,
      quantity,
      unit,
      unitRate,
      totalAmount
    });
  };

  // Excavation
  addItem('EXC-01', 'Earthwork in excavation for foundation', 'EXCAVATION', quantities.excavationVolume, 'cum', rateCard.excavation);

  // Concrete Disaggregation (Assume M20 mix ratio 1:1.5:3, total parts = 5.5)
  // Dry volume factor = 1.54
  const dryVolume = quantities.concreteVolume * 1.54;
  const cementVolume = dryVolume * (1 / 5.5); // m3
  const cementBags = Math.ceil((cementVolume * 1440) / 50); // 1440 kg/m3 density, 50kg bag
  const fineAggVolume = dryVolume * (1.5 / 5.5); // m3
  const coarseAggVolume = dryVolume * (3 / 5.5); // m3
  
  addItem('MAT-CEM', 'Portland Cement (50kg bags)', 'CONCRETE', cementBags, 'bags', rateCard.cementBag ?? 400);
  addItem('MAT-SND', 'Fine Aggregate / M-Sand', 'CONCRETE', fineAggVolume, 'cum', rateCard.fineAggregate ?? 1500);
  addItem('MAT-AGG', 'Coarse Aggregate (20mm & 10mm)', 'CONCRETE', coarseAggVolume, 'cum', rateCard.coarseAggregate ?? 1400);

  // Formwork
  addItem('FRM-01', 'Centering and shuttering (Formwork)', 'CONCRETE', quantities.formworkArea, 'sqm', rateCard.formwork);

  // Steel Disaggregation by Diameter
  if (bbsReport.weightByDiameter && Object.keys(bbsReport.weightByDiameter).length > 0) {
    for (const [dia, weightKg] of Object.entries(bbsReport.weightByDiameter)) {
      const weightMT = weightKg / 1000;
      const rate = (rateCard.steelByDia && rateCard.steelByDia[dia]) ? rateCard.steelByDia[dia] : rateCard.steel;
      addItem(`STL-${dia}`, `TMT Steel reinforcement bars (Fe500) - Φ${dia}`, 'STEEL', weightMT, 'MT', rate);
    }
  } else {
    // Fallback
    let totalSteelTonnage = bbsReport.totalTonnage; // MT
    addItem('STL-01', 'TMT Steel reinforcement bars (Fe500)', 'STEEL', totalSteelTonnage, 'MT', rateCard.steel);
  }

  // Masonry
  addItem('MAS-01', 'Brickwork in superstructure', 'MASONRY', quantities.masonryVolume, 'cum', rateCard.masonry);

  // Plaster Finishes (using masonry rate or derived rate)
  // Assuming plaster rate is a portion of masonry rate if not provided in rate card
  const plasterRate = rateCard.masonry * 0.1; // Placeholder ratio
  addItem('FIN-01', 'Cement plaster on walls', 'FINISHES', quantities.plasterArea, 'sqm', plasterRate);

  const contingencyPercent = 3; // 3%
  const grandTotal = subTotal + (subTotal * (contingencyPercent / 100));

  return {
    lineItems,
    subTotal,
    contingencyPercent,
    grandTotal
  };
}
