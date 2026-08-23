/// <reference lib="webworker" />

import type { PlotSpec, RequirementSpec } from '@vastumandal/dwg-schemas';

// Define the incoming message type
export interface EngineWorkerRequest {
  id: string;
  type: 'CALCULATE';
  payload: {
    plotSpec: PlotSpec;
    reqSpec: RequirementSpec;
    rates: any;
  };
}

// Define the outgoing message type
export interface EngineWorkerResponse {
  id: string;
  type: 'RESULT' | 'ERROR';
  payload?: {
    geometry: any;
    boq: any;
    dxfPayload: string;
  };
  error?: string;
}

self.onmessage = async (event: MessageEvent<EngineWorkerRequest>) => {
  const { id, type, payload } = event.data;

  if (type === 'CALCULATE') {
    try {
      const { plotSpec, reqSpec, rates } = payload;
      
      // Simulate heavy processing / solver calculation
      // Here we would call packages/core-spatial, core-structural, etc.
      
      const plotArea = plotSpec.width * plotSpec.length;
      const bua = plotArea * 0.7; // 70% coverage mock
      const carpetArea = bua * 0.85;
      const totalCost = bua * 1500; // 1500 per sqft mock
      
      const materials = {
        steel: (bua * 4).toFixed(1),
        cement: (bua * 0.4).toFixed(0),
        sand: (bua * 1.8).toFixed(0),
        aggregate: (bua * 1.35).toFixed(0),
        bricks: (bua * 8.5).toFixed(0),
      };

      const boq = {
        plotArea,
        bua,
        carpetArea,
        totalCost,
        materials,
      };

      // Mock geometry / spatial layout results
      const geometry = {
        width: plotSpec.width,
        length: plotSpec.length,
        setbacks: plotSpec.setbacks,
      };

      const response: EngineWorkerResponse = {
        id,
        type: 'RESULT',
        payload: {
          geometry,
          boq,
          dxfPayload: 'MOCK_DXF_STRING' // In a real scenario, output of dxf-exporter
        }
      };

      self.postMessage(response);
    } catch (error: any) {
      self.postMessage({
        id,
        type: 'ERROR',
        error: error.message || 'Unknown error in worker'
      } as EngineWorkerResponse);
    }
  }
};
