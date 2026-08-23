import { describe, it, expect } from 'vitest';
import { generateBOQ } from './boq';
import type { BBSReport, RateCard } from '@vastumandal/dwg-schemas';

describe('BOQ Generator', () => {
  it('should generate a valid BOQ with expected total amount calculation', () => {
    const quantities = {
      excavationVolume: 100,
      concreteVolume: 50,
      masonryVolume: 80,
      plasterArea: 200,
      formworkArea: 150,
    };

    const bbsReport: BBSReport = {
      totalTonnage: 2.5,
      items: [],
      weightByDiameter: { '12': 1000, '16': 1500 }
    };

    const rateCard: RateCard = {
      steel: 60000,
      cement: 400,
      cementBag: 400,
      fineAggregate: 1500,
      coarseAggregate: 1400,
      concrete: 5000,
      sand: 1000,
      aggregate: 1000,
      masonry: 4000,
      excavation: 300,
      formwork: 400,
      brick: 8,
      columnSize: '230x380',
    };

    const boq = generateBOQ(quantities, bbsReport, rateCard);

    expect(boq.lineItems.length).toBeGreaterThan(0);
    
    // Check if the grand total is correctly calculated
    let expectedSubTotal = 0;
    boq.lineItems.forEach(item => {
      expectedSubTotal += item.totalAmount;
      expect(item.totalAmount).toBe(item.quantity * item.unitRate);
    });

    expect(boq.subTotal).toBe(expectedSubTotal);
    expect(boq.grandTotal).toBe(expectedSubTotal * 1.03); // 3% contingency
  });
});
