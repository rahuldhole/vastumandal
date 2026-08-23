"use client";

import React from "react";
import { Download, Copy, Check, Save } from "lucide-react";
import {  exportTankSectionToDXF, exportTankSectionToScript  } from "@rdcad-express/dxf-exporter";
import { useAppStore } from "@/store/useStore";
import DXFPreview from "@/components/DXFPreview";
import ExampleSelector, { Example } from "@/components/ExampleSelector";
import type { TankScheduleRow } from "@rdcad-express/dwg-schemas";

const tankExamples: Example<TankScheduleRow>[] = [
 { name: "Small Underground", data: { tankId: "UGT1", type: "UNDERGROUND", capacity: 50000, width: 3000, length: 5000, height: 3500, wallThickness: 250, mainBarDia: 12, mainBarSpacing: 150 } },
 { name: "Large Overhead", data: { tankId: "OHT1", type: "OVERHEAD", capacity: 150000, width: 6000, length: 8000, height: 4000, wallThickness: 300, mainBarDia: 16, mainBarSpacing: 150 } },
 { name: "Residential Roof Tank", data: { tankId: "RT1", type: "OVERHEAD", capacity: 10000, width: 2000, length: 2500, height: 2000, wallThickness: 150, mainBarDia: 10, mainBarSpacing: 200 } },
 { name: "Fire Water Tank", data: { tankId: "FWT1", type: "UNDERGROUND", capacity: 250000, width: 8000, length: 10000, height: 3500, wallThickness: 350, mainBarDia: 16, mainBarSpacing: 125 } },
 { name: "Sump Pit (Tiny)", data: { tankId: "SP1", type: "UNDERGROUND", capacity: 2000, width: 1000, length: 1000, height: 2000, wallThickness: 150, mainBarDia: 10, mainBarSpacing: 200 } },
 { name: "Rainwater Harvesting", data: { tankId: "RWH1", type: "UNDERGROUND", capacity: 75000, width: 4000, length: 6000, height: 3200, wallThickness: 200, mainBarDia: 12, mainBarSpacing: 175 } },
 { name: "Industrial Storage", data: { tankId: "IND1", type: "OVERHEAD", capacity: 500000, width: 10000, length: 12000, height: 4500, wallThickness: 400, mainBarDia: 20, mainBarSpacing: 100 } },
 { name: "Narrow Trench Tank", data: { tankId: "NT1", type: "UNDERGROUND", capacity: 30000, width: 1500, length: 10000, height: 2000, wallThickness: 200, mainBarDia: 12, mainBarSpacing: 150 } }
];

export default function TankDetailing() {
 const tankData = useAppStore(state => state.tankData);
 const setTankData = useAppStore(state => state.setTankData);
 const dxfString = React.useMemo(() => exportTankSectionToDXF(tankData), [tankData]);

 const handleExport = () => {
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `Tank_${tankData.tankId}_${tankData.type}_${tankData.width}x${tankData.length}.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

  const [copied, setCopied] = React.useState(false);
  const handleCopyScript = () => {
    const scriptString = exportTankSectionToScript(tankData);
    navigator.clipboard.writeText(scriptString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 return (
 <div className="p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Tank Detailing</h1>
 <p className="text-muted-foreground mt-1 text-sm">Underground and Overhead water tanks</p>
 </div>
 
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-card rounded border border-border p-6 space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-2">
 <h3 className="text-xl font-bold">Properties</h3>
 <ExampleSelector examples={tankExamples} onSelect={setTankData} />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Mark</label>
 <input type="text" value={tankData.tankId} onChange={e => setTankData({...tankData, tankId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Wall Thk (mm)</label>
 <input type="number" value={tankData.wallThickness} onChange={e => setTankData({...tankData, wallThickness: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Inner Width (mm)</label>
 <input type="number" value={tankData.width} onChange={e => setTankData({...tankData, width: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Inner Length (mm)</label>
 <input type="number" value={tankData.length} onChange={e => setTankData({...tankData, length: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 </div>
   <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
 <button 
 onClick={() => {
 useAppStore.getState().setProjectModalData({ 
 defaultName: `Tank_${tankData.tankId}_${tankData.type}`, 
 type: 'tank', 
 dxfString 
 });
 }}
 className="flex items-center justify-center p-2 bg-muted hover:bg-muted/80 text-foreground rounded transition"
  title="Save"
  >
  <Save className="w-4 h-4" />
  <span className="hidden sm:inline ml-2 text-sm font-medium">Save</span>
  </button>
 <button onClick={handleExport} className="flex items-center justify-center p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition shadow-lg shadow-emerald-500/20" title="Export DXF">
  <Download className="w-4 h-4" />
  <span className="hidden sm:inline ml-2 text-sm font-medium">Download</span>
  </button>
          <button onClick={handleCopyScript} className="flex items-center justify-center p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition shadow-lg shadow-indigo-500/20" title="Copy CAD Command">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline ml-2 text-sm font-medium">{copied ? "Copied!" : "Copy"}</span>
          </button>
 </div>
</div>

 <div className="bg-card rounded border border-border flex items-center justify-center relative overflow-hidden" style={{ minHeight: "500px" }}>
 <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded z-10">Live DXF Render</div>
 {dxfString && <DXFPreview dxfString={dxfString} />}
 </div>
 </div>
 </div>
 </div>
 );
}
