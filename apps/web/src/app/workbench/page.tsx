import React from 'react';

export default function WorkbenchPage() {
  return (
    <div className="flex h-screen bg-[#0c0d10] text-slate-300 font-sans overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[18%] bg-[#14161b] border-r border-[#292d39] p-4 flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-widest text-[#d4af37] font-bold mb-4 font-[Space Grotesk]">Plot Settings</h2>
        <div className="text-sm space-y-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase mb-1">Orientation</div>
            <div className="font-mono text-[#06b6d4]">North</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase mb-1">Room Tree</div>
            <div className="text-xs text-slate-400 italic">No rooms added</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase mb-1">Vastu Constraints</div>
            <div className="text-xs text-emerald-500">All rules passing</div>
          </div>
        </div>
      </div>

      {/* CENTER VIEWPORT */}
      <div className="flex-1 flex flex-col relative bg-[#0c0d10]">
        <div className="h-12 border-b border-[#292d39] flex items-center px-4 justify-between bg-[#14161b]">
          <span className="font-mono text-xs font-bold text-white">Project Title</span>
          <span className="text-xs text-[#06b6d4] font-mono">Grid Snap: 100mm | Vastu Compliance Score: 94%</span>
          <button className="text-xs bg-[#e65100] px-4 py-1.5 rounded text-white font-bold tracking-wider hover:bg-[#ff5722] transition-colors">Export (DXF/PDF)</button>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
           {/* Mandala Grid Overlay */}
           <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           <div className="absolute top-4 right-4 text-xs font-mono text-[#d4af37] bg-black/50 p-2 rounded border border-[#d4af37]/30">N ↑</div>
           <div className="text-xl font-bold uppercase tracking-widest text-[#d4af37] border border-[#d4af37] p-8 rounded shadow-[0_0_15px_rgba(212,175,55,0.2)] bg-black/50 backdrop-blur-sm relative z-10 flex flex-col items-center gap-2">
              <span>8-Pada Yantra Grid</span>
              <span className="text-xs font-normal opacity-70">Interactive SVG / Three.js Placeholder</span>
           </div>
        </div>

        {/* BOTTOM TRAY */}
        <div className="h-32 border-t border-[#292d39] bg-[#1c1f26] p-4 font-mono text-xs overflow-y-auto">
          <div className="text-gray-500 mb-2">Console / Validation Warnings / BBS Summary</div>
          <div className="text-emerald-500">&gt; System initialized. Ready for CAD input.</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[22%] bg-[#14161b] border-l border-[#292d39] p-4 flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-widest text-[#d4af37] font-bold mb-4 font-[Space Grotesk]">Cost Ledger</h2>
        <div className="space-y-4">
          <div className="bg-[#1c1f26] p-4 rounded border border-[#292d39] hover:border-[#94a3b8]/50 transition-colors">
            <div className="text-[10px] text-gray-500 uppercase mb-1">Concrete (M20)</div>
            <div className="font-mono text-xl text-[#94a3b8] font-bold">28.4 m³</div>
          </div>
          <div className="bg-[#1c1f26] p-4 rounded border border-[#292d39] hover:border-[#38bdf8]/50 transition-colors">
            <div className="text-[10px] text-gray-500 uppercase mb-1">Fe500 Rebar</div>
            <div className="font-mono text-xl text-[#38bdf8] font-bold">2,840 kg</div>
          </div>
          <div className="bg-[#1c1f26] p-4 rounded border border-[#d4af37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
            <div className="text-[10px] text-[#d4af37] uppercase mb-1">Total Estimated Cost</div>
            <div className="font-mono text-2xl text-[#d4af37] font-bold">₹14,20,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
