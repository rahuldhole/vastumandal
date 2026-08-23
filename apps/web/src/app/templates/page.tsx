"use client";

import React, { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { exportTemplateToDXF } from "@rdcad-express/dxf-exporter";
import { useAppStore } from "@/store/useStore";
import DXFPreview from "@/components/DXFPreview";

export default function TemplatesDetailing() {
 const templateData = useAppStore(state => state.templateData);
 const setTemplateData = useAppStore(state => state.setTemplateData);
 const dxfString = React.useMemo(() => exportTemplateToDXF(templateData), [templateData]);
 const [copied, setCopied] = useState(false);

 const handleExport = () => {
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `${templateData.projectName.replace(/\s+/g, "_")}-TitleBlock.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

 const handleCopy = async () => {
   try {
     await navigator.clipboard.writeText(dxfString);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
   } catch (err) {
     console.error("Failed to copy DXF", err);
   }
 };

 return (
 <div className="p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Drawing Templates</h1>
 <p className="text-sm text-muted-foreground mt-1">Generate standard title blocks and sheet borders</p>
 </div>
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-card rounded border border-border p-6 space-y-4">
 <h3 className="text-xl font-bold border-b border-border pb-2">Properties</h3>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Sheet Size</label>
 <select 
 value={templateData.sheetSize} 
 onChange={e => setTemplateData({...templateData, sheetSize: e.target.value as 'A1' | 'A2' | 'A3'})} 
 className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500"
 >
 <option value="A1">A1 (841 x 594)</option>
 <option value="A2">A2 (594 x 420)</option>
 <option value="A3">A3 (420 x 297)</option>
 </select>
 </div>
 <div />
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Project Name</label>
 <input type="text" value={templateData.projectName} onChange={e => setTemplateData({...templateData, projectName: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Client Name</label>
 <input type="text" value={templateData.clientName} onChange={e => setTemplateData({...templateData, clientName: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Drawing Title</label>
 <input type="text" value={templateData.drawingTitle} onChange={e => setTemplateData({...templateData, drawingTitle: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Drawn By</label>
 <input type="text" value={templateData.drawnBy} onChange={e => setTemplateData({...templateData, drawnBy: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Date</label>
 <input type="date" value={templateData.date} onChange={e => setTemplateData({...templateData, date: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 </div>
  <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
  <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded font-medium transition shadow-sm border border-border">
  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />} <span className="hidden sm:inline text-sm font-medium">Copy DXF</span>
  </button>
  <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition shadow-lg shadow-emerald-500/20">
  <Download className="w-4 h-4" /> <span className="hidden sm:inline text-sm font-medium">Export DXF</span>
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
