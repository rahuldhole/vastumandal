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
      
      const request: EngineWorkerRequest = {
        id: crypto.randomUUID(),
        type: 'RUN_PIPELINE',
        payload: {
          spatialProject: { plotSpec, reqSpec },
          bylawParams: plotSpec,
          soilCondition: { safeBearingCapacity: 200 },
          rateCard: rates
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
