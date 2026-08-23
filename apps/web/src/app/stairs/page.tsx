"use client";

import React from "react";
import { Download, Copy, Check, Save } from "lucide-react";
import {  exportStairsSectionToDXF, exportStairsSectionToScript  } from "@rdcad-express/dxf-exporter";
import { useAppStore } from "@/store/useStore";
import DXFPreview from "@/components/DXFPreview";
import ExampleSelector, { Example } from "@/components/ExampleSelector";
import type { StairsScheduleRow } from "@rdcad-express/dwg-schemas";

const stairsExamples: Example<StairsScheduleRow>[] = [
 { name: "Standard Residential", data: { stairId: "ST1", tread: 250, rise: 150, numberOfSteps: 10, waistSlabThickness: 150, mainBarDia: 12, mainBarSpacing: 150, distBarDia: 8, distBarSpacing: 200 } },
 { name: "Commercial Wide", data: { stairId: "ST2", tread: 300, rise: 150, numberOfSteps: 12, waistSlabThickness: 200, mainBarDia: 16, mainBarSpacing: 125, distBarDia: 10, distBarSpacing: 150 } },
 { name: "Compact Service Stairs", data: { stairId: "ST3", tread: 220, rise: 175, numberOfSteps: 8, waistSlabThickness: 125, mainBarDia: 10, mainBarSpacing: 150, distBarDia: 8, distBarSpacing: 200 } },
 { name: "Grand Entrance Stairs", data: { stairId: "ST4", tread: 350, rise: 125, numberOfSteps: 15, waistSlabThickness: 250, mainBarDia: 20, mainBarSpacing: 100, distBarDia: 12, distBarSpacing: 150 } },
 { name: "Fire Escape Stairs", data: { stairId: "ST5", tread: 250, rise: 200, numberOfSteps: 14, waistSlabThickness: 150, mainBarDia: 12, mainBarSpacing: 125, distBarDia: 8, distBarSpacing: 175 } },
 { name: "Basement Access", data: { stairId: "ST6", tread: 250, rise: 160, numberOfSteps: 9, waistSlabThickness: 150, mainBarDia: 12, mainBarSpacing: 150, distBarDia: 8, distBarSpacing: 200 } },
 { name: "Public Building Stairs", data: { stairId: "ST7", tread: 300, rise: 140, numberOfSteps: 20, waistSlabThickness: 200, mainBarDia: 16, mainBarSpacing: 100, distBarDia: 12, distBarSpacing: 150 } },
 { name: "Dog-legged (Standard)", data: { stairId: "ST8", tread: 260, rise: 150, numberOfSteps: 11, waistSlabThickness: 150, mainBarDia: 12, mainBarSpacing: 125, distBarDia: 10, distBarSpacing: 150 } }
];

export default function StairsDetailing() {
 const stairsData = useAppStore(state => state.stairsData);
 const setStairsData = useAppStore(state => state.setStairsData);
 const dxfString = React.useMemo(() => exportStairsSectionToDXF(stairsData), [stairsData]);

 const handleExport = () => {
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `Stairs_${stairsData.stairId}_${stairsData.tread}x${stairsData.rise}.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

  const [copied, setCopied] = React.useState(false);
  const handleCopyScript = () => {
    const scriptString = exportStairsSectionToScript(stairsData);
    navigator.clipboard.writeText(scriptString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 return (
 <div className="p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Stairs Detailing</h1>
 <p className="text-muted-foreground mt-1 text-sm">Parametric staircase calculation and preview</p>
 </div>
 
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-card rounded border border-border p-6 space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-2">
 <h3 className="text-xl font-bold">Properties</h3>
 <ExampleSelector examples={stairsExamples} onSelect={setStairsData} />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Mark</label>
 <input type="text" value={stairsData.stairId} onChange={e => setStairsData({...stairsData, stairId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div />
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Tread (mm)</label>
 <input type="number" value={stairsData.tread} onChange={e => setStairsData({...stairsData, tread: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Rise (mm)</label>
 <input type="number" value={stairsData.rise} onChange={e => setStairsData({...stairsData, rise: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">No. of Steps</label>
 <input type="number" value={stairsData.numberOfSteps} onChange={e => setStairsData({...stairsData, numberOfSteps: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Waist Slab Thk (mm)</label>
 <input type="number" value={stairsData.waistSlabThickness} onChange={e => setStairsData({...stairsData, waistSlabThickness: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Main Bar Dia (mm)</label>
 <input type="number" value={stairsData.mainBarDia} onChange={e => setStairsData({...stairsData, mainBarDia: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Main Bar Spacing (mm)</label>
 <input type="number" value={stairsData.mainBarSpacing} onChange={e => setStairsData({...stairsData, mainBarSpacing: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Dist Bar Dia (mm)</label>
 <input type="number" value={stairsData.distBarDia} onChange={e => setStairsData({...stairsData, distBarDia: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Dist Bar Spacing (mm)</label>
 <input type="number" value={stairsData.distBarSpacing} onChange={e => setStairsData({...stairsData, distBarSpacing: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 </div>
   <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
 <button 
 onClick={() => {
 useAppStore.getState().setProjectModalData({ 
 defaultName: `Stairs_${stairsData.stairId}_${stairsData.tread}x${stairsData.rise}`, 
 type: 'stairs', 
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
