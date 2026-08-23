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

  // Concrete
  addItem('CON-01', 'RCC Work in structural elements (M20)', 'CONCRETE', quantities.concreteVolume, 'cum', rateCard.concrete);
  
  // Formwork (Adding formwork under concrete category or as a separate implied item, using CONCRETE category for simplicity)
  addItem('FRM-01', 'Centering and shuttering (Formwork)', 'CONCRETE', quantities.formworkArea, 'sqm', rateCard.formwork);

  // Steel
  // We can itemize steel by diameter or as a bulk
  let totalSteelTonnage = bbsReport.totalTonnage; // MT
  addItem('STL-01', 'TMT Steel reinforcement bars (Fe500)', 'STEEL', totalSteelTonnage, 'MT', rateCard.steel);

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
