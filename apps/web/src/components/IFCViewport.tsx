'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Loader2, Box, RotateCcw } from 'lucide-react';
import { Color } from 'three';
import { exportVastumandalIFC } from '@vastumandal/ifc-exporter';

/**
 * Inline IFC BIM viewer that renders inside the CADViewport.
 * Generates IFC from the current project state and renders it via web-ifc-viewer.
 */
export default function IFCViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<IfcViewerAPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate IFC data (will re-generate when store changes trigger re-render upstream)
  const ifcData = useMemo(() => {
    try {
      return exportVastumandalIFC({});
    } catch {
      return null;
    }
  }, []);

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !ifcData) return;

    let blobUrl: string | null = null;
    let cancelled = false;

    const initViewer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dispose previous viewer if it exists
        if (viewerRef.current) {
          viewerRef.current.dispose();
          viewerRef.current = null;
        }

        const viewer = new IfcViewerAPI({
          container: containerRef.current!,
          backgroundColor: new Color(0xf8f9fa),
        });

        await viewer.IFC.setWasmPath('/');

        viewer.axes.setAxes();
        viewer.grid.setGrid();
        viewerRef.current = viewer;

        const blob = new Blob([ifcData], { type: 'application/x-step' });
        blobUrl = URL.createObjectURL(blob);

        await viewer.IFC.loadIfcUrl(blobUrl);

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading IFC model:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load IFC model');
          setLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      cancelled = true;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [ifcData, retryKey]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-4" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Loading IFC BIM Model...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 z-10">
          <Box className="h-10 w-10 text-red-400 mb-3" />
          <p className="text-red-500 font-semibold mb-1">IFC Load Error</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md text-center mb-4">
            {error}
          </p>
          <button
            onClick={() => setRetryKey(k => k + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Info badge */}
      <div className="absolute top-4 left-4 z-10 backdrop-blur-md bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white px-3 py-2 rounded-xl shadow-xl">
        <div className="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-wider">Mode</div>
        <div className="text-sm font-bold flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-purple-500" />
          IFC BIM
        </div>
      </div>
    </div>
  );
}
