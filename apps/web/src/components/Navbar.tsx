"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useStore";
import { ThemeToggle } from "./ThemeToggle";
import { Download, FileDown, Layers } from "lucide-react";
import { PLOT_PRESETS } from "@vastumandal/dwg-schemas";
import ExportModal from "./ExportModal";

export default function Navbar() {
  const { plotSpec, setPlotSpec, layers, setLayers } = useAppStore();
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetKey = e.target.value;
    if (presetKey && PLOT_PRESETS[presetKey]) {
      setPlotSpec(PLOT_PRESETS[presetKey]);
    }
  };

  const currentPresetKey = Object.keys(PLOT_PRESETS).find(key => {
    const p = PLOT_PRESETS[key];
    return p.width === plotSpec.width && p.length === plotSpec.length && p.facing === plotSpec.facing;
  }) || "";

  return (
    <header className="bg-card border-b border-border h-14 flex items-center shrink-0 z-50">
      <div className="w-full flex items-center justify-between px-4">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-4 w-[340px]">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Vastumandal Logo" width={28} height={28} className="w-7 h-7 rounded-md" />
            <div className="font-bold text-lg text-primary flex items-center gap-2">
              VastuMandal
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">Studio</span>
            </div>
          </Link>
        </div>

        {/* Center: Presets */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Preset:</span>
            <select 
              value={currentPresetKey}
              onChange={handlePresetChange}
              className="bg-muted border border-border text-foreground text-sm rounded-md px-3 py-1.5 min-w-[200px] focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="" disabled>Custom Layout</option>
              {Object.keys(PLOT_PRESETS).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Layer Toggles */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-border">
            <Layers className="w-4 h-4 text-muted-foreground ml-1 mr-1" />
            <button 
              onClick={() => setLayers({ zones: !layers.zones })}
              className={`px-2 py-1 text-xs rounded transition ${layers.zones ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Zones
            </button>
            <button 
              onClick={() => setLayers({ grid: !layers.grid })}
              className={`px-2 py-1 text-xs rounded transition ${layers.grid ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setLayers({ dims: !layers.dims })}
              className={`px-2 py-1 text-xs rounded transition ${layers.dims ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Dims
            </button>
            <button 
              onClick={() => setLayers({ openings: !layers.openings })}
              className={`px-2 py-1 text-xs rounded transition ${layers.openings ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Doors
            </button>
          </div>

          <div className="w-px h-5 bg-border mx-1"></div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-md transition shadow-sm"
            >
              <Download className="w-4 h-4" /> Export...
            </button>
          </div>

          <div className="w-px h-5 bg-border mx-1"></div>
          
          <ThemeToggle />
        </div>

      </div>
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </header>
  );
}
