'use client';

import React, { useState } from 'react';

export default function WorkbenchPage() {
  const [showMandala, setShowMandala] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#0c0d10] text-gray-200 font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-[#14161b] border-b border-[#292d39]">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold tracking-wider text-gray-100 uppercase" style={{ fontFamily: 'Cinzel, Space Grotesk, sans-serif' }}>
            VASTUMANDAL
          </h1>
          <span className="text-xs text-gray-400">Project: Villa Residence</span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Grid Snap:</span>
            <span className="text-cyan-400">100mm</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Vastu Score:</span>
            <span className="text-amber-500">94%</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-[#1c1f26] border border-[#292d39] rounded hover:bg-[#292d39] transition">
            Export DXF
          </button>
          <button className="px-3 py-1 text-xs bg-[#1c1f26] border border-[#292d39] rounded hover:bg-[#292d39] transition">
            Export PDF
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Inspector & Constraints (18%) */}
        <aside className="w-[18%] bg-[#14161b] border-r border-[#292d39] flex flex-col">
          <div className="p-4 border-b border-[#292d39]">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Plot Settings</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Width</span>
                <span className="font-mono text-gray-300">9000 mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Length</span>
                <span className="font-mono text-gray-300">12000 mm</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Room Wishlist</h2>
            <ul className="space-y-2">
              <li className="p-2 bg-[#1c1f26] rounded border border-[#292d39] flex justify-between items-center cursor-pointer hover:border-[#d4af37] transition">
                <span className="text-sm">Living Hub</span>
                <span className="text-xs font-mono text-gray-500">24 m²</span>
              </li>
              <li className="p-2 bg-[#1c1f26] rounded border border-[#d4af37] text-[#d4af37] flex justify-between items-center cursor-pointer transition">
                <span className="text-sm">Kitchen (SE)</span>
                <span className="text-xs font-mono">12 m²</span>
              </li>
              <li className="p-2 bg-[#1c1f26] rounded border border-[#292d39] flex justify-between items-center cursor-pointer hover:border-[#d4af37] transition">
                <span className="text-sm">Master Bed</span>
                <span className="text-xs font-mono text-gray-500">16 m²</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Center Viewport (60%) */}
        <section className="flex-1 relative bg-[#0c0d10] flex flex-col">
          {/* Viewport Toolbar */}
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button 
              onClick={() => setShowMandala(!showMandala)}
              className={`px-3 py-1.5 text-xs rounded border transition ${
                showMandala 
                ? 'bg-[rgba(212,175,55,0.15)] border-[#d4af37] text-[#d4af37]' 
                : 'bg-[#1c1f26] border-[#292d39] text-gray-400 hover:border-gray-500'
              }`}
            >
              Mandala Grid
            </button>
            <button className="px-3 py-1.5 text-xs rounded border bg-[#1c1f26] border-[#292d39] text-gray-400 hover:border-gray-500 transition">
              2D / 3D
            </button>
          </div>

          {/* Canvas Placeholder */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{
            backgroundImage: 'radial-gradient(#292d39 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
            {showMandala && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                {/* Placeholder 9-Pada Grid */}
                <div className="w-[400px] h-[400px] border-2 border-[#d4af37] grid grid-cols-3 grid-rows-3">
                  <div className="border border-[#d4af37]/50 flex items-center justify-center text-xs font-mono text-[#d4af37]">Vayu</div>
                  <div className="border border-[#d4af37]/50"></div>
                  <div className="border border-[#d4af37]/50 flex items-center justify-center text-xs font-mono text-[#d4af37]">Ishanya</div>
                  <div className="border border-[#d4af37]/50"></div>
                  <div className="border border-[#d4af37] bg-[#d4af37]/10 flex items-center justify-center text-xs font-mono text-[#d4af37] tracking-widest uppercase">Brahmasthan</div>
                  <div className="border border-[#d4af37]/50"></div>
                  <div className="border border-[#d4af37]/50 flex items-center justify-center text-xs font-mono text-[#d4af37]">Nairuthi</div>
                  <div className="border border-[#d4af37]/50"></div>
                  <div className="border border-[#d4af37]/50 flex items-center justify-center text-xs font-mono text-[#e65100]">Agni</div>
                </div>
              </div>
            )}
            
            <div className="text-[#292d39] text-2xl font-mono opacity-50 select-none">
              SVG CANVAS ACTIVE
            </div>
          </div>

          {/* Bottom Tray */}
          <div className="h-48 bg-[#14161b] border-t border-[#292d39] p-4 font-mono text-xs overflow-y-auto">
            <h3 className="text-gray-500 mb-2 uppercase tracking-wide">Validation Console</h3>
            <div className="text-[#06b6d4] mb-1">» Graph Solver initialized.</div>
            <div className="text-amber-500 mb-1">» Warning: Kitchen aspect ratio at 1:1.4.</div>
            <div className="text-gray-400 mb-1">» Grid snapped to 100mm increments.</div>
          </div>
        </section>

        {/* Right Pane: Ledger (22%) */}
        <aside className="w-[22%] bg-[#14161b] border-l border-[#292d39] flex flex-col">
          <div className="p-4 border-b border-[#292d39]">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Live IS 456 Ledger</h2>
            <p className="text-[10px] text-gray-500">Real-time material takeoff</p>
          </div>
          
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Concrete */}
            <div className="bg-[#1c1f26] border border-[#292d39] rounded p-3">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-[#94a3b8]">Concrete (M20)</span>
                <span className="text-lg font-mono text-gray-200">28.4 <span className="text-xs text-gray-500">m³</span></span>
              </div>
              <div className="w-full bg-[#0c0d10] h-1.5 rounded overflow-hidden">
                <div className="bg-[#94a3b8] w-[65%] h-full"></div>
              </div>
            </div>

            {/* Steel */}
            <div className="bg-[#1c1f26] border border-[#292d39] rounded p-3">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-[#38bdf8]">Fe500 Rebar</span>
                <span className="text-lg font-mono text-gray-200">2,840 <span className="text-xs text-gray-500">kg</span></span>
              </div>
              <div className="w-full bg-[#0c0d10] h-1.5 rounded overflow-hidden">
                <div className="bg-[#38bdf8] w-[45%] h-full"></div>
              </div>
            </div>

            {/* Total Cost */}
            <div className="mt-6 p-4 border border-[#d4af37]/30 bg-[#d4af37]/5 rounded">
              <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Estimated Cost</span>
              <span className="block text-2xl font-mono text-[#d4af37]">₹ 14,20,000</span>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
