"use client";

import React, { useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import { exportTextNodesToDXF } from "@rdcad-express/dxf-exporter";
import { useAppStore } from "@/store/useStore";
import { useTheme } from "next-themes";

type TextNode = {
 id: string;
 text: string;
 x: number;
 y: number;
};

export default function GridUtilities() {
 const { resolvedTheme } = useTheme();
 const nodes = useAppStore(state => state.nodes);
 const setNodes = useAppStore(state => state.setNodes);
 const prefix = useAppStore(state => state.prefix);
 const setPrefix = useAppStore(state => state.setPrefix);
 const startNum = useAppStore(state => state.startNum);
 const setStartNum = useAppStore(state => state.setStartNum);
 const findText = useAppStore(state => state.findText);
 const setFindText = useAppStore(state => state.setFindText);
 const replaceText = useAppStore(state => state.replaceText);
 const setReplaceText = useAppStore(state => state.setReplaceText);

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const [KonvaComps, setKonvaComps] = useState<any>(null);

 useEffect(() => {
 import("react-konva").then(mod => {
 setKonvaComps(mod);
 });
 }, []);

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const handleCanvasClick = (e: any) => {
 // only add if we clicked on the stage, not on an existing label
 if (e.target === e.target.getStage()) {
 const stage = e.target.getStage();
 const pointerPosition = stage.getPointerPosition();
 
 const newNode: TextNode = {
 id: `node-${Date.now()}`,
 text: `${prefix}${startNum}`,
 x: pointerPosition.x,
 y: pointerPosition.y,
 };
 
 setNodes([...nodes, newNode]);
 setStartNum(startNum + 1); // auto increment
 }
 };

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const handleDragEnd = (e: any, id: string) => {
 const updatedNodes = nodes.map(node => {
 if (node.id === id) {
 return { ...node, x: e.target.x(), y: e.target.y() };
 }
 return node;
 });
 setNodes(updatedNodes);
 };

 const handleReplace = () => {
 if (!findText) return;
 const updatedNodes = nodes.map(node => ({
 ...node,
 text: node.text.replace(new RegExp(findText, 'g'), replaceText)
 }));
 setNodes(updatedNodes);
 };

 const handleExport = () => {
 const dxfString = exportTextNodesToDXF(nodes);
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `grid-labels.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

 const Stage = KonvaComps?.Stage;
 const Layer = KonvaComps?.Layer;
 const Text = KonvaComps?.Text;

 return (
 <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Drafting Utilities</h1>
 <p className="text-sm text-muted-foreground mt-1">Smart tools for auto-numbering and finding text</p>
 </div>
 </header>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="md:col-span-1 space-y-6">
 <div className="bg-card rounded border border-border p-6 space-y-4">
 <h3 className="text-xl font-bold border-b border-border pb-2">Auto-Numbering</h3>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Prefix</label>
 <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Next Number</label>
 <input type="number" value={startNum} onChange={e => setStartNum(Number(e.target.value))} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <p className="text-xs text-muted-foreground">Click on the canvas to place &apos;{prefix}{startNum}&apos;</p>
 </div>

 <div className="bg-card rounded border border-border p-6 space-y-4">
 <h3 className="text-xl font-bold border-b border-border pb-2">Find & Replace</h3>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Find Prefix/String</label>
 <input type="text" value={findText} onChange={e => setFindText(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <div>
 <label className="block text-sm text-muted-foreground mb-1">Replace With</label>
 <input type="text" value={replaceText} onChange={e => setReplaceText(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm focus:border-blue-700 dark:border-blue-500" />
 </div>
 <button onClick={handleReplace} className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-primary hover:bg-primary rounded font-medium transition">
 <Search className="w-4 h-4" /> Replace All
 </button>
 </div>
 

 
 <button onClick={() => setNodes([])} className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/80 text-red-600 dark:text-red-400 rounded transition border border-red-900/50">
 Clear Canvas
 </button>
 </div>

 <div className="md:col-span-2 flex flex-col gap-4">
 <div className="bg-card rounded border border-border flex items-center justify-center relative overflow-hidden" style={{ minHeight: "600px", cursor: "crosshair" }}>
 <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded z-10 pointer-events-none">Interactive Schematic (Click to place)</div>
 {Stage && (
 <Stage width={800} height={600} onClick={handleCanvasClick}>
 <Layer>
 {nodes.map(node => (
 <Text
 key={node.id}
 text={node.text}
 x={node.x}
 y={node.y}
 fontSize={24}
 fill={resolvedTheme === 'dark' ? "#e2e8f0" : "#0f172a"}
 draggable
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 onDragEnd={(e: any) => handleDragEnd(e, node.id)}
 />
 ))}
 </Layer>
 </Stage>
 )}
 </div>
 <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
 <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition shadow-lg shadow-emerald-500/20">
 <Download className="w-4 h-4" /> <span className="hidden sm:inline text-sm font-medium">Export Labels to DXF</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
