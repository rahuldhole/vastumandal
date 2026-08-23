"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useStore";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ControlPanel() {
  const { plotSpec, setPlotSpec, reqSpec, setReqSpec, rates, setRates } = useAppStore();
  const [openSections, setOpenSections] = useState({
    plot: true,
    space: true,
    structural: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-[340px] flex-shrink-0 bg-card border-r border-border h-full overflow-y-auto flex flex-col custom-scrollbar">
      <div className="p-4 font-semibold border-b border-border text-foreground sticky top-0 bg-card z-10 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-primary rounded-full"></span>
        Parametric Controls
      </div>

      <div className="p-2 space-y-2">
        {/* Plot & Setbacks */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <button 
            onClick={() => toggleSection('plot')}
            className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition"
          >
            <span className="font-medium text-sm text-foreground">Plot & Orientation</span>
            {openSections.plot ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {openSections.plot && (
            <div className="p-4 space-y-4 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Width (ft)</label>
                  <input 
                    type="number" 
                    value={plotSpec.width}
                    onChange={(e) => setPlotSpec({ width: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Length (ft)</label>
                  <input 
                    type="number" 
                    value={plotSpec.length}
                    onChange={(e) => setPlotSpec({ length: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Facing</label>
                <select 
                  value={plotSpec.facing}
                  onChange={(e) => setPlotSpec({ facing: e.target.value as 'N' | 'S' | 'E' | 'W' })}
                  className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm"
                >
                  <option value="E">East</option>
                  <option value="W">West</option>
                  <option value="N">North</option>
                  <option value="S">South</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-2 font-medium">Setbacks (ft)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-10">Front:</span>
                    <input type="number" value={plotSpec.setbacks.front} onChange={(e) => setPlotSpec({ setbacks: { ...plotSpec.setbacks, front: Number(e.target.value) } })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-10">Rear:</span>
                    <input type="number" value={plotSpec.setbacks.rear} onChange={(e) => setPlotSpec({ setbacks: { ...plotSpec.setbacks, rear: Number(e.target.value) } })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-10">Left:</span>
                    <input type="number" value={plotSpec.setbacks.left} onChange={(e) => setPlotSpec({ setbacks: { ...plotSpec.setbacks, left: Number(e.target.value) } })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-10">Right:</span>
                    <input type="number" value={plotSpec.setbacks.right} onChange={(e) => setPlotSpec({ setbacks: { ...plotSpec.setbacks, right: Number(e.target.value) } })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Space Requirements */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <button 
            onClick={() => toggleSection('space')}
            className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition"
          >
            <span className="font-medium text-sm text-foreground">Space Requirements</span>
            {openSections.space ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {openSections.space && (
            <div className="p-4 space-y-4 border-t border-border">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Configuration</label>
                <select 
                  value={reqSpec.bhk}
                  onChange={(e) => setReqSpec({ bhk: e.target.value as '1BHK' | '2BHK' | '3BHK' })}
                  className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm"
                >
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={reqSpec.pujaRoom} onChange={(e) => setReqSpec({ pujaRoom: e.target.checked })} className="rounded border-border bg-background" />
                  <span className="text-sm">Mandir / Pooja Room</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={reqSpec.parking} onChange={(e) => setReqSpec({ parking: e.target.checked })} className="rounded border-border bg-background" />
                  <span className="text-sm">Parking Space</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={reqSpec.porch} onChange={(e) => setReqSpec({ porch: e.target.checked })} className="rounded border-border bg-background" />
                  <span className="text-sm">Porch / Verandah</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Structural & Rate Card */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <button 
            onClick={() => toggleSection('structural')}
            className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition"
          >
            <span className="font-medium text-sm text-foreground">Structural & Rates</span>
            {openSections.structural ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {openSections.structural && (
            <div className="p-4 space-y-4 border-t border-border">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Column Sizing</label>
                <select 
                  value={rates.columnSize}
                  onChange={(e) => setRates({ columnSize: e.target.value })}
                  className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm"
                >
                  <option value="230x230">9&quot; x 9&quot; (230x230mm)</option>
                  <option value="230x380">9&quot; x 15&quot; (230x380mm)</option>
                  <option value="230x450">9&quot; x 18&quot; (230x450mm)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Steel (₹/kg)</label>
                  <input type="number" value={rates.steel} onChange={(e) => setRates({ steel: Number(e.target.value) })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Cement (₹/bag)</label>
                  <input type="number" value={rates.cement} onChange={(e) => setRates({ cement: Number(e.target.value) })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Sand (₹/cft)</label>
                  <input type="number" value={rates.sand} onChange={(e) => setRates({ sand: Number(e.target.value) })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Brick (₹/pc)</label>
                  <input type="number" value={rates.brick} onChange={(e) => setRates({ brick: Number(e.target.value) })} className="w-full bg-background border border-border rounded px-2 py-1 text-sm" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
