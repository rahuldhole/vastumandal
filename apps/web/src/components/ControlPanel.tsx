import React, { useState } from 'react';

export function ControlPanel({ onParamsChange }: { onParamsChange: (params: any) => void }) {
  const [sbc, setSbc] = useState(200);
  const [storeys, setStoreys] = useState(2); // G+1
  const [fSetback, setFSetback] = useState(3);
  const [rSetback, setRSetback] = useState(1.5);
  
  const triggerUpdate = () => {
    onParamsChange({ sbc, storeys, setbacks: { front: fSetback, rear: rSetback } });
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow border space-y-4">
      <h2 className="font-bold text-xl">Workbench Controls</h2>
      
      <div>
        <label className="block text-sm font-medium">Safe Bearing Capacity (kN/m²)</label>
        <input 
          type="range" min="50" max="400" step="10" 
          value={sbc} onChange={e => { setSbc(Number(e.target.value)); triggerUpdate(); }}
          className="w-full"
        />
        <div className="text-right text-xs text-gray-500">{sbc} kN/m²</div>
      </div>

      <div>
        <label className="block text-sm font-medium">Storeys</label>
        <select value={storeys} onChange={e => { setStoreys(Number(e.target.value)); triggerUpdate(); }} className="w-full p-2 border rounded">
          <option value={1}>G</option>
          <option value={2}>G+1</option>
          <option value={3}>G+2</option>
          <option value={4}>G+3</option>
          <option value={5}>G+4</option>
          <option value={6}>G+5</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">Front Setback (m)</label>
          <input type="number" value={fSetback} onChange={e => { setFSetback(Number(e.target.value)); triggerUpdate(); }} className="w-full p-1 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Rear Setback (m)</label>
          <input type="number" value={rSetback} onChange={e => { setRSetback(Number(e.target.value)); triggerUpdate(); }} className="w-full p-1 border rounded" />
        </div>
      </div>
      
    </div>
  );
}
