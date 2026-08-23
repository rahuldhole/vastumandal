import React, { useState } from 'react';

export function CADViewport() {
  const [layers, setLayers] = useState({
    grid: true,
    walls: true,
    columns: true,
    footings: true,
    dims: true
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="relative w-full h-full bg-gray-900 border overflow-hidden flex flex-col">
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-75 text-white p-2 rounded text-xs space-y-1">
        <h4 className="font-bold border-b border-gray-600 mb-2 pb-1">Layers</h4>
        {Object.keys(layers).map(layer => (
          <div key={layer} className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={layers[layer as keyof typeof layers]} 
              onChange={() => toggleLayer(layer as keyof typeof layers)}
            />
            <span className="capitalize">{layer}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center text-gray-500">
        <svg width="400" height="400" viewBox="-100 -100 500 500" className="opacity-80">
          {layers.footings && (
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="lightgreen" strokeDasharray="4" strokeWidth="2" />
          )}
          {layers.columns && (
            <rect x="40" y="40" width="20" height="20" fill="red" />
          )}
          {layers.walls && (
            <path d="M50 50 L 350 50 L 350 350 L 50 350 Z" fill="none" stroke="white" strokeWidth="4" />
          )}
          {layers.grid && (
            <path d="M0 50 L 400 50 M50 0 L 50 400" stroke="gray" strokeWidth="1" strokeDasharray="10 5" />
          )}
          {layers.dims && (
            <text x="200" y="30" fill="yellow" fontSize="12" textAnchor="middle">3000 mm</text>
          )}
        </svg>
      </div>
    </div>
  );
}
