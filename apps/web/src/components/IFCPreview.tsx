'use client';

import { useEffect, useRef, useState } from 'react';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { X, Loader2 } from 'lucide-react';
import { Color } from 'three';

interface IFCPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  ifcData: string | Uint8Array | null;
}

export function IFCPreview({ isOpen, onClose, ifcData }: IFCPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<IfcViewerAPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current || !ifcData) return;

    let blobUrl: string | null = null;
    let isActive = true;

    const initViewer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize viewer if it doesn't exist
        if (!viewerRef.current && containerRef.current) {
          const viewer = new IfcViewerAPI({
            container: containerRef.current,
            backgroundColor: new Color(0xffffff),
          });

          // Setup WASM path to public directory
          viewer.IFC.setWasmPath('/');
          
          viewer.axes.setAxes();
          viewer.grid.setGrid();
          viewerRef.current = viewer;
        }

        // Convert string or Uint8Array to Blob
        const blob = new Blob([ifcData as BlobPart], { type: 'application/x-step' });
        
        blobUrl = URL.createObjectURL(blob);
        
        await viewerRef.current!.IFC.loadIfcUrl(blobUrl);

        if (!isActive) return;
        setLoading(false);

      } catch (err) {
        console.error('Error loading IFC model:', err);
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Failed to load IFC model');
          setLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isActive = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, ifcData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-[90vw] flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-neutral-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            IFC 3D Preview
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewer Container */}
        <div className="relative flex-1 bg-neutral-100 dark:bg-neutral-800">
          <div ref={containerRef} className="absolute inset-0" />
          
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-4" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                Loading IFC Model...
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-neutral-900">
              <p className="text-red-500 font-medium mb-2">Error</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md text-center">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
