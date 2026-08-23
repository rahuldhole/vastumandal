"use client";

import React from "react";
import { Download, Copy, Check, Save } from "lucide-react";
import {  exportFoundationSectionToDXF, exportFoundationSectionToScript  } from "@rdcad-express/dxf-exporter";
import { useAppStore } from "@/store/useStore";
import DXFPreview from "@/components/DXFPreview";
import ExampleSelector, { Example } from "@/components/ExampleSelector";
import type { FoundationScheduleRow } from "@rdcad-express/dwg-schemas";

const foundationExamples: Example<FoundationScheduleRow>[] = [
 { name: "Small Isolated", data: { footingId: "F1", lx: 1500, ly: 1500, depth: 350, meshBarDiaX: 10, meshBarSpacingX: 150, meshBarDiaY: 10, meshBarSpacingY: 150 } },
 { name: "Large Mat Footing", data: { footingId: "F2", lx: 3500, ly: 3500, depth: 600, meshBarDiaX: 16, meshBarSpacingX: 150, meshBarDiaY: 16, meshBarSpacingY: 150 } },
 { name: "Rectangular Footing", data: { footingId: "F3", lx: 2500, ly: 1800, depth: 450, meshBarDiaX: 12, meshBarSpacingX: 125, meshBarDiaY: 10, meshBarSpacingY: 150 } },
 { name: "Strip Footing (Sim)", data: { footingId: "SF1", lx: 1000, ly: 5000, depth: 300, meshBarDiaX: 12, meshBarSpacingX: 150, meshBarDiaY: 10, meshBarSpacingY: 200 } },
 { name: "Combined Footing (Sim)", data: { footingId: "CF1", lx: 2000, ly: 4500, depth: 550, meshBarDiaX: 16, meshBarSpacingX: 125, meshBarDiaY: 12, meshBarSpacingY: 150 } },
 { name: "Heavy Machine Fdn", data: { footingId: "MF1", lx: 4000, ly: 4000, depth: 800, meshBarDiaX: 20, meshBarSpacingX: 100, meshBarDiaY: 20, meshBarSpacingY: 100 } },
 { name: "Lift Pit Footing", data: { footingId: "LPF1", lx: 2500, ly: 2500, depth: 750, meshBarDiaX: 16, meshBarSpacingX: 150, meshBarDiaY: 16, meshBarSpacingY: 150 } },
 { name: "Boundary Wall Fdn", data: { footingId: "BWF1", lx: 800, ly: 800, depth: 200, meshBarDiaX: 8, meshBarSpacingX: 200, meshBarDiaY: 8, meshBarSpacingY: 200 } }
];

export default function FoundationDetailing() {
 const fdnData = useAppStore(state => state.fdnData);
 const setFdnData = useAppStore(state => state.setFdnData);
 const dxfString = React.useMemo(() => exportFoundationSectionToDXF(fdnData), [fdnData]);

 const handleExport = () => {
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `Foundation_${fdnData.footingId}_${fdnData.lx}x${fdnData.ly}.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

  const [copied, setCopied] = React.useState(false);
  const handleCopyScript = () => {
    const scriptString = exportFoundationSectionToScript(fdnData);
    navigator.clipboard.writeText(scriptString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 return (
 <div className="p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Foundation Detailing</h1>
 <p className="text-muted-foreground mt-1 text-sm">Parametric footing plan and section with DXF export</p>
 </div>
 
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-card rounded border border-border p-6 space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-2">
 <h3 className="text-xl font-bold">Properties</h3>
 <ExampleSelector examples={foundationExamples} onSelect={setFdnData} />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Mark</label>
 <input type="text" value={fdnData.footingId} onChange={e => setFdnData({...fdnData, footingId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div />
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Lx (mm)</label>
 <input type="number" value={fdnData.lx} onChange={e => setFdnData({...fdnData, lx: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Ly (mm)</label>
 <input type="number" value={fdnData.ly} onChange={e => setFdnData({...fdnData, ly: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 </div>
   <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
 <button 
 onClick={() => {
 useAppStore.getState().setProjectModalData({ 
 defaultName: `Foundation_${fdnData.footingId}`, 
 type: 'foundation', 
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
