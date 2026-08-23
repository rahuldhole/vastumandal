import React from 'react';

export function ExportModal({ onClose }: { onClose: () => void }) {
  const downloadFile = (format: string) => {
    alert(`Downloading model in ${format.toUpperCase()} format...`);
    // In actual implementation, this triggers Blob download
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold">Export Project</h2>
        <p className="text-sm text-gray-600">Select standard interoperability format for downstream processing:</p>
        
        <div className="flex flex-col space-y-2">
          <button onClick={() => downloadFile('dxf')} className="bg-blue-100 text-blue-800 p-2 rounded hover:bg-blue-200">AutoCAD DXF (R12)</button>
          <button onClick={() => downloadFile('ifc')} className="bg-blue-100 text-blue-800 p-2 rounded hover:bg-blue-200">IFC4 STEP (BIM)</button>
          <button onClick={() => downloadFile('json')} className="bg-blue-100 text-blue-800 p-2 rounded hover:bg-blue-200">Vastumandal JSON</button>
          <button onClick={() => downloadFile('csv')} className="bg-blue-100 text-blue-800 p-2 rounded hover:bg-blue-200">BOQ & BBS (CSV)</button>
        </div>

        <div className="pt-4 border-t text-right">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>
      </div>
    </div>
  );
}
