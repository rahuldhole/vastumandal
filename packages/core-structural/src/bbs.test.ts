import { describe, it, expect } from 'vitest';
import { generateBeamBBS, generateColumnBBS, generateFootingBBS, compileBBSReport } from './bbs';

describe('BBS Generator', () => {
  it('should calculate valid beam BBS items', () => {
    const items = generateBeamBBS('B1', 4000, 230, 450);
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item.memberRef).toBe('B1');
      expect(item.memberType).toBe('BEAM');
      expect(item.totalLength).toBeGreaterThan(0);
      expect(item.totalWeight).toBeGreaterThan(0);
    });
  });

  it('should calculate valid column BBS items', () => {
    const items = generateColumnBBS('C1', 3000, 230, 380);
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item.memberRef).toBe('C1');
      expect(item.memberType).toBe('COLUMN');
      expect(item.totalLength).toBeGreaterThan(0);
      expect(item.totalWeight).toBeGreaterThan(0);
    });
  });

  it('should calculate valid footing BBS items', () => {
    const items = generateFootingBBS('F1', 1500, 1500, 400);
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item.memberRef).toBe('F1');
      expect(item.memberType).toBe('FOOTING');
      expect(item.totalLength).toBeGreaterThan(0);
      expect(item.totalWeight).toBeGreaterThan(0);
    });
  });

  it('should compile BBS report correctly', () => {
    const beamItems = generateBeamBBS('B1', 4000, 230, 450);
    const colItems = generateColumnBBS('C1', 3000, 230, 380);
    
    const report = compileBBSReport([...beamItems, ...colItems]);
    expect(report.items.length).toBe(beamItems.length + colItems.length);
    expect(report.totalTonnage).toBeGreaterThan(0);
    expect(Object.keys(report.weightByDiameter).length).toBeGreaterThan(0);
  });
});
