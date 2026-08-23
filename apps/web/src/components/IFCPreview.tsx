'use client';

import React from 'react';

interface IFCPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  ifcData: string | null;
}

export function IFCPreview({ isOpen, onClose, ifcData }: IFCPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-3/4 h-3/4 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IFC Output Preview (Raw STEP)</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 p-4">
          <pre className="text-sm font-mono text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
            {ifcData ? ifcData.slice(0, 5000) + (ifcData.length > 5000 ? '\n\n... (truncated for preview)' : '') : 'No data available'}
          </pre>
        </div>
      </div>
    </div>
  );
}
