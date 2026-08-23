import { validateBylaws } from '@vastumandal/core-spatial/src/bylaws';
import { sizeFooting } from '@vastumandal/core-structural/src/footing';
import { generateFootingBBS, compileBBSReport } from '@vastumandal/core-structural/src/bbs';
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

    // 2. Structural & BBS
    const footingDesign = sizeFooting(1500, 230, 450, soilCondition.safeBearingCapacity);
    const footingBBS = generateFootingBBS('F1', footingDesign.length, footingDesign.width, footingDesign.depth);
    const bbsReport = compileBBSReport(footingBBS);

    // 3. Estimator & BOQ
    const mockQuantities = {
      excavationVolume: 50,
      concreteVolume: 35,
      masonryVolume: 40,
      plasterArea: 300,
      formworkArea: 250
    };
    
    const boq = generateBOQ(mockQuantities, bbsReport, rateCard as RateCard);

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
