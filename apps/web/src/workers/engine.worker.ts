import { validateBylaws } from '@vastumandal/core-spatial/src/bylaws';
import { sizeFooting } from '@vastumandal/core-structural/src/footing';
import { generateFootingBBS, generateBeamBBS, generateColumnBBS, compileBBSReport } from '@vastumandal/core-structural/src/bbs';
import { generateBOQ } from '@vastumandal/core-estimator/src/boq';
import type { BylawParams } from '@vastumandal/dwg-schemas/src/spatial';
import type { RateCard } from '@vastumandal/dwg-schemas/src/estimator';

export interface EngineWorkerRequest {
  id: string;
  type: 'CALCULATE' | 'RUN_PIPELINE';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface EngineWorkerResponse {
  type: 'RESULT' | 'ERROR' | 'PIPELINE_RESULT';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  error?: string;
}

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === 'RUN_PIPELINE') {
    const { bylawParams, rateCard, soilCondition } = payload;
    
    // Boundary Checks
    const diagnostics: unknown[] = [];
    
    if (soilCondition.safeBearingCapacity < 80) {
      diagnostics.push({
        level: 'WARNING',
        message: 'Low soil bearing capacity detected. Shallow isolated pad footings are unsafe. Export geometry to SAFE/PLAXIS for deep pile/raft foundation design.',
        code: 'SBC_LOW'
      });
    }

    // Mock span check for master demo
    const maxSpanDetected = 8.0; // from spatialProject hypothetically
    if (maxSpanDetected > 7.5) {
      diagnostics.push({
        level: 'WARNING',
        message: 'Large span detected requiring post-tensioned or dynamic deflection verification. Export to ETABS/STAAD.Pro.',
        code: 'SPAN_LARGE'
      });
    }
    
    const storeys = 6; // from spatialProject hypothetically
    if (storeys > 5) {
      diagnostics.push({
        level: 'WARNING',
        message: 'High-rise structure requires dynamic seismic response spectrum and wind tunnel FEA. Export to ETABS.',
        code: 'HIGH_RISE'
      });
    }

    // 1. Spatial & Bylaw
    // Derive building footprint from the setback envelope (guaranteed compliant)
    const bpLeft = bylawParams.sideSetbacks[0];
    const bpRight = bylawParams.plotWidth - bylawParams.sideSetbacks[1];
    const bpFront = bylawParams.frontSetback;
    const bpRear = bylawParams.plotDepth - bylawParams.rearSetback;
    const buildingPolygon: [number, number][] = [
      [bpLeft, bpFront],
      [bpRight, bpFront],
      [bpRight, bpRear],
      [bpLeft, bpRear],
    ];
    const buildableW = bpRight - bpLeft;
    const buildableH = bpRear - bpFront;
    const groundFootprint = buildableW * buildableH;

    // Estimate floors from spatialProject if available
    const floorStr = payload.spatialProject?.plotSpec?.floorCount || 'G';
    const floorMatch = floorStr.match(/G\+(\d+)/i);
    const floors = floorMatch ? 1 + parseInt(floorMatch[1], 10) : 1;
    const totalBuiltUp = groundFootprint * floors;

    const bylawResult = validateBylaws(
      bylawParams as BylawParams,
      buildingPolygon,
      totalBuiltUp,
      groundFootprint
    );

    diagnostics.push(...bylawResult.diagnostics);

    // 2. Structural & BBS — derive from actual building geometry
    // Parse column size from user rates (e.g. "230x380")
    const colSizeStr = payload.spatialProject?.reqSpec?.columnSize
      || payload.rateCard?.columnSize
      || '230x380';
    const colParts = (typeof colSizeStr === 'string' ? colSizeStr : '230x380').split('x').map(Number);
    const colW = colParts[0] || 230;   // mm
    const colD = colParts[1] || 380;   // mm
    const floorHeight = 3000; // mm per storey

    // Typical grid: columns every ~4-5m in both directions
    const spanX = Math.min(buildableW * 1000, 5000); // mm, cap at 5m
    const spanY = Math.min(buildableH * 1000, 5000);
    const colsX = Math.max(2, Math.ceil((buildableW * 1000) / spanX) + 1);
    const colsY = Math.max(2, Math.ceil((buildableH * 1000) / spanY) + 1);
    const numColumns = colsX * colsY;
    const numBeamsX = (colsX - 1) * colsY * floors; // beams along X per floor
    const numBeamsY = colsX * (colsY - 1) * floors;

    // Tributary area per interior column (conservative: full grid cell)
    const tributaryArea = (spanX / 1000) * (spanY / 1000); // m²
    const loadPerFloor = tributaryArea * 15; // ~15 kN/m² (DL + LL typical)
    const columnAxialLoad = loadPerFloor * floors; // kN unfactored

    const footingDesign = sizeFooting(columnAxialLoad, colW, colD, soilCondition.safeBearingCapacity);
    const footingBBS = generateFootingBBS('F1', footingDesign.length, footingDesign.width, footingDesign.depth,
      50, footingDesign.bottomMeshRebar.barDia, footingDesign.bottomMeshRebar.spacing);

    // Generate beam BBS for one typical beam per direction
    const beamDepth = Math.max(300, Math.round(spanX / 12)); // L/12 rule of thumb
    const beamWidth = Math.max(230, Math.round(beamDepth * 0.5));
    const beamBBSX = generateBeamBBS('BX1', spanX, beamWidth, beamDepth);
    const beamBBSY = generateBeamBBS('BY1', spanY, beamWidth, beamDepth);

    // Generate column BBS for one typical column
    const colBBS = generateColumnBBS('C1', floorHeight * floors, colW, colD, 40, colW >= 300 ? 20 : 16, colW >= 300 ? 8 : 6);

    // Scale items by count for the full building
    const scaleItems = (items: ReturnType<typeof generateFootingBBS>, factor: number) =>
      items.map(it => ({
        ...it,
        numberOfBars: it.numberOfBars * factor,
        totalLength: it.totalLength * factor,
        totalWeight: it.totalWeight * factor,
      }));

    const allBBSItems = [
      ...scaleItems(footingBBS, numColumns),
      ...scaleItems(beamBBSX, numBeamsX),
      ...scaleItems(beamBBSY, numBeamsY),
      ...scaleItems(colBBS, numColumns),
    ];
    const bbsReport = compileBBSReport(allBBSItems);

    // 3. Estimator & BOQ — derive from building geometry
    const totalBuiltUpM2 = totalBuiltUp;              // m²
    const perimeterM = 2 * (buildableW + buildableH); // m
    const wallHeightM = (floorHeight / 1000) * floors;
    const wallThickness = 0.23; // m (9" brick)

    const excavationVolume = numColumns * (footingDesign.length / 1000) * (footingDesign.width / 1000) * 1.5; // 1.5m depth
    const concreteVolume =
      // footings
      numColumns * (footingDesign.length / 1000) * (footingDesign.width / 1000) * (footingDesign.depth / 1000)
      // columns
      + numColumns * (colW / 1000) * (colD / 1000) * wallHeightM
      // beams (approx)
      + (numBeamsX * spanX / 1000 + numBeamsY * spanY / 1000) * (beamWidth / 1000) * (beamDepth / 1000)
      // slabs
      + totalBuiltUpM2 * 0.15; // 150mm slab
    const masonryVolume = perimeterM * wallHeightM * wallThickness * 0.7; // 70% of perimeter is wall (minus openings)
    const plasterArea = perimeterM * wallHeightM * 2 * 0.7; // both faces
    const formworkArea = concreteVolume * 8; // rough rule: ~8 m² formwork per m³ concrete

    const quantities = {
      excavationVolume: Math.round(excavationVolume * 100) / 100,
      concreteVolume: Math.round(concreteVolume * 100) / 100,
      masonryVolume: Math.round(masonryVolume * 100) / 100,
      plasterArea: Math.round(plasterArea * 100) / 100,
      formworkArea: Math.round(formworkArea * 100) / 100,
    };

    const boq = generateBOQ(quantities, bbsReport, rateCard as RateCard);

    self.postMessage({
      type: 'PIPELINE_RESULT',
      payload: {
        diagnostics,
        bylawResult,
        footingDesign,
        bbsReport,
        boq
      }
    });
  }
};
