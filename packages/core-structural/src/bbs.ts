import type { BBSItem, BBSReport } from '@vastumandal/dwg-schemas/src/bbs';

export function calculateBarWeight(diameterMm: number, lengthMeters: number): number {
  return (Math.pow(diameterMm, 2) / 162.2) * lengthMeters;
}

export function getDevelopmentLength(dia: number, code: 'IS456' | 'ACI318' = 'IS456'): number {
  // Approximate Ld for M25/Fe500
  return code === 'IS456' ? 47 * dia : 40 * dia;
}

export function getHookAllowance(dia: number, angle: 90 | 135 | 180 = 135): number {
  if (angle === 90) return 4 * dia;
  if (angle === 135) return 6 * dia;
  return 8 * dia;
}

export function generateBeamBBS(
  beamId: string,
  clearSpan: number, // mm
  width: number,
  depth: number,
  cover: number = 25,
  topDia: number = 12,
  topCount: number = 2,
  bottomDia: number = 16,
  bottomCount: number = 3,
  stirrupDia: number = 8,
  stirrupSpacing: number = 150
): BBSItem[] {
  const items: BBSItem[] = [];

  // Main Bottom Bars (straight with 90 deg L-bends at ends)
  // L_d (Development length) required into the support
  const Ld = getDevelopmentLength(bottomDia);
  const endAnchorage = Math.min(Ld, 200 + getHookAllowance(bottomDia, 90)); // simplified anchorage
  const bottomCutLen = clearSpan + 2 * endAnchorage - 2 * (2 * bottomDia); // 90 deg deduction = 2d per bend
  items.push({
    id: `${beamId}-bottom`,
    memberRef: beamId,
    memberType: 'BEAM',
    barMark: 'B1',
    barDiameter: bottomDia,
    barShape: 'L_BENT',
    cuttingLength: bottomCutLen,
    numberOfBars: bottomCount,
    totalLength: (bottomCutLen * bottomCount) / 1000,
    totalWeight: calculateBarWeight(bottomDia, (bottomCutLen * bottomCount) / 1000)
  });

  // Top Anchor Bars
  const topLd = getDevelopmentLength(topDia);
  const topEndAnchorage = Math.min(topLd, 200 + getHookAllowance(topDia, 90));
  const topCutLen = clearSpan + 2 * topEndAnchorage - 2 * (2 * topDia);
  items.push({
    id: `${beamId}-top`,
    memberRef: beamId,
    memberType: 'BEAM',
    barMark: 'T1',
    barDiameter: topDia,
    barShape: 'L_BENT',
    cuttingLength: topCutLen,
    numberOfBars: topCount,
    totalLength: (topCutLen * topCount) / 1000,
    totalWeight: calculateBarWeight(topDia, (topCutLen * topCount) / 1000)
  });

  // Top Extra Negative Rebar at supports (curtailed at 0.25L)
  const extraTopLen = 0.25 * clearSpan + topEndAnchorage;
  items.push({
    id: `${beamId}-top-extra`,
    memberRef: beamId,
    memberType: 'BEAM',
    barMark: 'T2_EXTRA',
    barDiameter: topDia,
    barShape: 'L_BENT_CURTAILED',
    cuttingLength: extraTopLen,
    numberOfBars: topCount, // Assume same count for extra bars as main top bars for now
    totalLength: (extraTopLen * topCount * 2) / 1000, // 2 supports
    totalWeight: calculateBarWeight(topDia, (extraTopLen * topCount * 2) / 1000)
  });

  // Stirrups (2-legged closed ties, 135 deg hooks)
  const stirrupA = width - 2 * cover;
  const stirrupB = depth - 2 * cover;
  const hookLen = getHookAllowance(stirrupDia, 135); // standard ductile detailing hook
  // 135 deg bend deduction = 3d
  // A standard stirrup has 3 90-deg bends and 2 135-deg bends
  const stirrupCutLen = 2 * (stirrupA + stirrupB) + 2 * hookLen - 3 * (2 * stirrupDia) - 2 * (3 * stirrupDia);
  const stirrupCount = Math.floor(clearSpan / stirrupSpacing) + 1;
  items.push({
    id: `${beamId}-stirrups`,
    memberRef: beamId,
    memberType: 'BEAM',
    barMark: 'S1',
    barDiameter: stirrupDia,
    barShape: 'RECT_STIRRUP',
    cuttingLength: stirrupCutLen,
    numberOfBars: stirrupCount,
    totalLength: (stirrupCutLen * stirrupCount) / 1000,
    totalWeight: calculateBarWeight(stirrupDia, (stirrupCutLen * stirrupCount) / 1000)
  });

  return items;
}

export function generateColumnBBS(
  colId: string,
  height: number,
  width: number,
  depth: number,
  cover: number = 40,
  mainDia: number = 16,
  mainCount: number = 6,
  tieDia: number = 8,
  tieSpacing: number = 150
): BBSItem[] {
  const items: BBSItem[] = [];

  // Longitudinal Bars with lap allowance
  // Ductile detailing: lap splices must be in the central 50% of the column height, avoiding beam-column joints.
  const lapLength = getDevelopmentLength(mainDia);
  const mainCutLen = height + lapLength;
  items.push({
    id: `${colId}-main`,
    memberRef: colId,
    memberType: 'COLUMN',
    barMark: 'C1',
    barDiameter: mainDia,
    barShape: 'STRAIGHT', // simplified
    cuttingLength: mainCutLen,
    numberOfBars: mainCount,
    totalLength: (mainCutLen * mainCount) / 1000,
    totalWeight: calculateBarWeight(mainDia, (mainCutLen * mainCount) / 1000)
  });

  // Lateral Ties
  const tieA = width - 2 * cover;
  const tieB = depth - 2 * cover;
  const hookLen = getHookAllowance(tieDia, 135);
  const tieCutLen = 2 * (tieA + tieB) + 2 * hookLen - 3 * (2 * tieDia) - 2 * (3 * tieDia);
  const tieCount = Math.floor(height / tieSpacing) + 1;
  items.push({
    id: `${colId}-ties`,
    memberRef: colId,
    memberType: 'COLUMN',
    barMark: 'L1',
    barDiameter: tieDia,
    barShape: 'RECT_STIRRUP',
    cuttingLength: tieCutLen,
    numberOfBars: tieCount,
    totalLength: (tieCutLen * tieCount) / 1000,
    totalWeight: calculateBarWeight(tieDia, (tieCutLen * tieCount) / 1000)
  });

  return items;
}

export function generateFootingBBS(
  footingId: string,
  length: number,
  width: number,
  depth: number,
  cover: number = 50,
  barDia: number = 12,
  spacing: number = 150
): BBSItem[] {
  const items: BBSItem[] = [];
  const verticalReturn = depth - 2 * cover;

  // X direction bars
  const lenX = length - 2 * cover;
  const cutLenX = lenX + 2 * verticalReturn - 2 * (2 * barDia); // two 90-deg bends
  const numBarsX = Math.floor(width / spacing) + 1;
  items.push({
    id: `${footingId}-x`,
    memberRef: footingId,
    memberType: 'FOOTING',
    barMark: 'F1',
    barDiameter: barDia,
    barShape: 'L_BENT',
    cuttingLength: cutLenX,
    numberOfBars: numBarsX,
    totalLength: (cutLenX * numBarsX) / 1000,
    totalWeight: calculateBarWeight(barDia, (cutLenX * numBarsX) / 1000)
  });

  // Y direction bars
  const lenY = width - 2 * cover;
  const cutLenY = lenY + 2 * verticalReturn - 2 * (2 * barDia);
  const numBarsY = Math.floor(length / spacing) + 1;
  items.push({
    id: `${footingId}-y`,
    memberRef: footingId,
    memberType: 'FOOTING',
    barMark: 'F2',
    barDiameter: barDia,
    barShape: 'L_BENT',
    cuttingLength: cutLenY,
    numberOfBars: numBarsY,
    totalLength: (cutLenY * numBarsY) / 1000,
    totalWeight: calculateBarWeight(barDia, (cutLenY * numBarsY) / 1000)
  });

  return items;
}

export function compileBBSReport(items: BBSItem[]): BBSReport {
  let totalTonnage = 0;
  const weightByDia: Record<string, number> = {};

  items.forEach(item => {
    totalTonnage += item.totalWeight / 1000; // convert kg to tonnes
    const diaKey = item.barDiameter.toString();
    weightByDia[diaKey] = (weightByDia[diaKey] || 0) + item.totalWeight;
  });

  return {
    items,
    totalTonnage,
    weightByDiameter: weightByDia
  };
}
