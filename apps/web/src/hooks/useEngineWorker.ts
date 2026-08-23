import { useState, useEffect, useRef, useCallback } from 'react';
import type { EngineWorkerRequest, EngineWorkerResponse } from '../workers/engine.worker';
import type { PlotSpec, RequirementSpec } from '@vastumandal/dwg-schemas';

export function useEngineWorker() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<EngineWorkerResponse['payload'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        workerRef.current = new Worker(new URL('../workers/engine.worker.ts', import.meta.url));
        workerRef.current.onmessage = (event: MessageEvent<EngineWorkerResponse>) => {
          const { type, payload, error } = event.data;
          if (type === 'PIPELINE_RESULT' || type === 'RESULT') {
            setResult(payload || null);
            setError(null);
          } else if (type === 'ERROR') {
            setError(error || 'Worker error');
          }
          
          
          setIsCalculating(false);
        };
        workerRef.current.onerror = (error) => {
          console.error("Worker error", error);
          setError("Worker failed to initialize or execute.");
          setIsCalculating(false);
        };
      } catch (err: unknown) {
        console.error("Failed to initialize engine worker", err);
        setTimeout(() => setError("Web Workers are not supported or failed to initialize."), 0);
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculate = useCallback((plotSpec: PlotSpec, reqSpec: RequirementSpec, rates: any) => {
    if (workerRef.current) {
      setIsCalculating(true);
      
      // Map PlotSpec → BylawParams shape expected by core-spatial
      const w = plotSpec.width || 10;
      const d = plotSpec.length || 15;
      const bylawParams = {
        plotPolygon: [[0, 0], [w, 0], [w, d], [0, d]] as [number, number][],
        frontSetback: plotSpec.setbacks?.front ?? 0,
        rearSetback: plotSpec.setbacks?.rear ?? 0,
        sideSetbacks: [
          plotSpec.setbacks?.left ?? 0,
          plotSpec.setbacks?.right ?? 0,
        ] as [number, number],
        maxFsi: plotSpec.maxFsi ?? 1.5,
        roadWidth: plotSpec.roadWidth ?? 9,
      };

      const request: EngineWorkerRequest = {
        id: crypto.randomUUID(),
        type: 'RUN_PIPELINE',
        payload: {
          spatialProject: { plotSpec, reqSpec },
          bylawParams,
          soilCondition: { safeBearingCapacity: rates.sbc ?? 200 },
          // Map UI-level material rates → RateCard shape expected by core-estimator
          rateCard: {
            concrete: (rates.cement || 380) + (rates.sand || 60) + (rates.aggregate || 55) + 3500, // cement+sand+aggregate+labour
            steel: (rates.steel || 65) * 1000, // per-kg → per-MT
            formwork: 450, // ₹/sqm typical
            masonry: (rates.brick || 7) * 500 + 1500, // bricks-per-cum * rate + labour
            excavation: 350, // ₹/cum typical
            columnSize: rates.columnSize || '230x380',
          }
        }
      };
      
      workerRef.current.postMessage(request);
    } else {
      // Graceful fallback could go here
      setError("Worker not available.");
    }
  }, []);

  return { isCalculating, result, error, calculate };
}
