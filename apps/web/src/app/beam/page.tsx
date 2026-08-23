"use client";

import React from "react";
import { Download, Copy, Check, Save } from "lucide-react";
import {  exportBeamSectionToDXF, exportBeamSectionToScript  } from "@rdcad-express/dxf-exporter";
import { useAppStore } from "@/store/useStore";
import DXFPreview from "@/components/DXFPreview";
import ExampleSelector, { Example } from "@/components/ExampleSelector";
import type { BeamScheduleRow } from "@rdcad-express/dwg-schemas";

const beamExamples: Example<BeamScheduleRow>[] = [
 { name: "Standard Plinth Beam", data: { elementId: "PB1", width: 230, depth: 300, bottomBarDia: 12, bottomBarCount: 3, topExtraLeft: 2, topExtraRight: 2, stirrupDia: 8, stirrupSpacing: 150 } },
 { name: "Heavy Transfer Beam", data: { elementId: "TB1", width: 450, depth: 750, bottomBarDia: 25, bottomBarCount: 5, topExtraLeft: 4, topExtraRight: 4, stirrupDia: 10, stirrupSpacing: 100 } },
 { name: "Wide Shallow Beam", data: { elementId: "WB1", width: 600, depth: 300, bottomBarDia: 16, bottomBarCount: 6, topExtraLeft: 3, topExtraRight: 3, stirrupDia: 8, stirrupSpacing: 125 } },
 { name: "Lintel Beam (Small)", data: { elementId: "LB1", width: 230, depth: 200, bottomBarDia: 10, bottomBarCount: 2, topExtraLeft: 0, topExtraRight: 0, stirrupDia: 8, stirrupSpacing: 200 } },
 { name: "Roof Beam (Light)", data: { elementId: "RB1", width: 230, depth: 400, bottomBarDia: 12, bottomBarCount: 3, topExtraLeft: 2, topExtraRight: 2, stirrupDia: 8, stirrupSpacing: 150 } },
 { name: "Primary Girder (Deep)", data: { elementId: "G1", width: 300, depth: 900, bottomBarDia: 20, bottomBarCount: 4, topExtraLeft: 3, topExtraRight: 3, stirrupDia: 10, stirrupSpacing: 125 } },
 { name: "Secondary Beam (Narrow)", data: { elementId: "SB1", width: 200, depth: 450, bottomBarDia: 16, bottomBarCount: 2, topExtraLeft: 1, topExtraRight: 1, stirrupDia: 8, stirrupSpacing: 150 } },
 { name: "Ground Beam", data: { elementId: "GB1", width: 300, depth: 450, bottomBarDia: 16, bottomBarCount: 3, topExtraLeft: 2, topExtraRight: 2, stirrupDia: 8, stirrupSpacing: 175 } }
];

export default function BeamDetailing() {
 const beamData = useAppStore(state => state.beamData);
 const setBeamData = useAppStore(state => state.setBeamData);
 const dxfString = React.useMemo(() => exportBeamSectionToDXF(beamData), [beamData]);

 const handleExport = () => {
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `Beam_${beamData.elementId}_${beamData.width}x${beamData.depth}.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

  const [copied, setCopied] = React.useState(false);
  const handleCopyScript = () => {
    const scriptString = exportBeamSectionToScript(beamData);
    navigator.clipboard.writeText(scriptString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 return (
 <div className="p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Beam Detailing</h1>
 <p className="text-muted-foreground mt-1 text-sm">Parametric beam sections with real-time 2D preview</p>
 </div>
 
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-card rounded border border-border p-6 space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-2">
 <h3 className="text-xl font-bold">Properties</h3>
 <ExampleSelector examples={beamExamples} onSelect={setBeamData} />
 </div>
 
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Mark</label>
 <input type="text" value={beamData.elementId} onChange={e => setBeamData({...beamData, elementId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div />
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Width (mm)</label>
 <input type="number" value={beamData.width} onChange={e => setBeamData({...beamData, width: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Depth (mm)</label>
 <input type="number" value={beamData.depth} onChange={e => setBeamData({...beamData, depth: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Bottom Bars Count</label>
 <input type="number" value={beamData.bottomBarCount} onChange={e => setBeamData({...beamData, bottomBarCount: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Bottom Bar Dia (mm)</label>
 <input type="number" value={beamData.bottomBarDia} onChange={e => setBeamData({...beamData, bottomBarDia: Number(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 </div>
   <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
 <button 
 onClick={() => {
 useAppStore.getState().setProjectModalData({ 
 defaultName: `Beam_${beamData.elementId}_${beamData.width}x${beamData.depth}`, 
 type: 'beam', 
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
 {dxfString && <DXFPreview dxfString={dxfString} />}
 </div>
 </div>
 </div>
 </div>
 );
}
