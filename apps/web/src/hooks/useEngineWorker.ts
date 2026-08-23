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
          
          if (type === 'RESULT') {
            setResult(payload || null);
            setError(null);
          } else if (type === 'ERROR') {
            setError(error || 'Worker error');
          }
          
          setIsCalculating(false);
        };
      } catch (err: any) {
        console.error("Failed to initialize engine worker", err);
        setError("Web Workers are not supported or failed to initialize.");
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const calculate = useCallback((plotSpec: PlotSpec, reqSpec: RequirementSpec, rates: any) => {
    if (workerRef.current) {
      setIsCalculating(true);
      
      const request: EngineWorkerRequest = {
        id: crypto.randomUUID(),
        type: 'CALCULATE',
        payload: {
          plotSpec,
          reqSpec,
          rates
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
