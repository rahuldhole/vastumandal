"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useStore";
import { Download, Menu, FileText } from "lucide-react";
import { PLOT_PRESETS } from "@vastumandal/dwg-schemas";
import ExportModal from "./ExportModal";

export default function Navbar() {
  const { plotSpec, setPlotSpec, leftPanelOpen, setLeftPanelOpen, rightPanelOpen, setRightPanelOpen, activeTab, setActiveTab } = useAppStore();
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
      <div className="w-full flex items-center justify-between px-2 md:px-4 gap-2 overflow-x-auto no-scrollbar">
        
        {/* Left: Branding & Panel Toggle */}
        <div className="flex items-center gap-2 md:gap-4 w-auto md:w-[340px] shrink-0">
          <button 
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Vastumandal Logo" width={28} height={28} className="w-7 h-7 rounded-md" />
            <div className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="hidden sm:inline">VastuMandal</span>
              <span className="sm:hidden">VM</span>
              <span className="hidden md:inline px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">Studio</span>
            </div>
          </Link>
        </div>

        {/* Center: Presets & Views */}
        <div className="flex-1 flex justify-center items-center gap-2 md:gap-4 shrink-0">
          <div className="bg-muted/50 p-1 rounded-md border border-border flex items-center shrink-0">
            <button 
              onClick={() => setActiveTab('2D')}
              className={`px-2 md:px-4 py-1 md:py-1.5 rounded-sm md:rounded-md text-xs md:text-sm font-medium transition ${activeTab === '2D' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              2D <span className="hidden lg:inline">Plan</span>
            </button>
            <button 
              onClick={() => setActiveTab('3D')}
              className={`px-2 md:px-4 py-1 md:py-1.5 rounded-sm md:rounded-md text-xs md:text-sm font-medium transition ${activeTab === '3D' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              3D <span className="hidden lg:inline">Isometric</span>
            </button>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1"></div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden lg:inline text-sm text-muted-foreground font-medium">Preset:</span>
            <select 
              value={currentPresetKey}
              onChange={handlePresetChange}
              className="bg-muted border border-border text-foreground text-xs md:text-sm rounded-md px-2 py-1 md:px-3 md:py-1.5 w-[100px] md:min-w-[160px] focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="" disabled>Custom</option>
              {Object.keys(PLOT_PRESETS).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Actions & Panel Toggle */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          
          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 md:px-4 md:py-1.5 rounded-md transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">Export...</span>
            </button>
          </div>

          <div className="w-px h-5 bg-border mx-0 md:mx-1"></div>
          
          <button 
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>

      </div>
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </header>
  );
}
