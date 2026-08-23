"use client";

import React from "react";
import { Download, Copy, Check, Save } from "lucide-react";
import {  exportColumnSectionToDXF, exportColumnSectionToScript  } from "@rdcad-express/dxf-exporter";
import { useAppStore } from "@/store/useStore";
import DXFPreview from "@/components/DXFPreview";
import ExampleSelector, { Example } from "@/components/ExampleSelector";
import type { ColumnScheduleRow } from "@rdcad-express/dwg-schemas";

const columnExamples: Example<ColumnScheduleRow>[] = [
 { name: "Standard Square", data: { columnId: "C1", level: "GF", concreteGrade: "M30", width: 400, depth: 400, mainBarCount: 8, mainBarDia: 20, tieDia: 8, tieSpacing: 150 } },
 { name: "Heavy Rectangular", data: { columnId: "C2", level: "Basement", concreteGrade: "M40", width: 400, depth: 900, mainBarCount: 14, mainBarDia: 25, tieDia: 10, tieSpacing: 100 } },
 { name: "Circular (Simulated)", data: { columnId: "C3", level: "First", concreteGrade: "M30", width: 600, depth: 600, mainBarCount: 12, mainBarDia: 16, tieDia: 8, tieSpacing: 150 } },
 { name: "Slender Column", data: { columnId: "C4", level: "Top", concreteGrade: "M25", width: 230, depth: 450, mainBarCount: 6, mainBarDia: 16, tieDia: 8, tieSpacing: 200 } },
 { name: "Massive Pedestal", data: { columnId: "P1", level: "Foundation", concreteGrade: "M35", width: 1000, depth: 1000, mainBarCount: 20, mainBarDia: 32, tieDia: 12, tieSpacing: 150 } },
 { name: "L-Shaped Corner (Sim)", data: { columnId: "C5", level: "GF", concreteGrade: "M30", width: 600, depth: 600, mainBarCount: 16, mainBarDia: 20, tieDia: 10, tieSpacing: 150 } },
 { name: "Edge Column", data: { columnId: "C6", level: "GF", concreteGrade: "M30", width: 300, depth: 600, mainBarCount: 10, mainBarDia: 20, tieDia: 8, tieSpacing: 150 } },
 { name: "Boundary Wall Pillar", data: { columnId: "BP1", level: "GL", concreteGrade: "M20", width: 230, depth: 230, mainBarCount: 4, mainBarDia: 12, tieDia: 8, tieSpacing: 200 } }
];

export default function ColumnDetailing() {
 const colData = useAppStore(state => state.colData);
 const setColData = useAppStore(state => state.setColData);
 const dxfString = React.useMemo(() => exportColumnSectionToDXF(colData), [colData]);

 const handleExport = () => {
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `Column_${colData.columnId}_${colData.width}x${colData.depth}.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

  const [copied, setCopied] = React.useState(false);
  const handleCopyScript = () => {
    const scriptString = exportColumnSectionToScript(colData);
    navigator.clipboard.writeText(scriptString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 return (
 <div className="p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Column Detailing</h1>
 <p className="text-muted-foreground mt-1 text-sm">Parametric column sections with real-time 2D preview</p>
 </div>
 
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-card rounded border border-border p-6 space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-2">
 <h3 className="text-xl font-bold">Properties</h3>
 <ExampleSelector examples={columnExamples} onSelect={setColData} />
 </div>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Mark</label>
 <input type="text" value={colData.columnId} onChange={e => setColData({...colData, columnId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Width (mm)</label>
 <input type="number" value={colData.width ?? 400} onChange={e => setColData({...colData, width: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Depth (mm)</label>
 <input type="number" value={colData.depth ?? 400} onChange={e => setColData({...colData, depth: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Main Bar Count</label>
 <input type="number" value={colData.mainBarCount} onChange={e => setColData({...colData, mainBarCount: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Main Bar Dia (mm)</label>
 <input type="number" value={colData.mainBarDia} onChange={e => setColData({...colData, mainBarDia: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 </div>
   <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
 <button 
 onClick={() => {
 useAppStore.getState().setProjectModalData({ 
 defaultName: `Column_${colData.columnId}_${colData.width}x${colData.depth}`, 
 type: 'column', 
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
