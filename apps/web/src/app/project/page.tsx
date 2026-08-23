"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useStore";
import { Download, Trash2, FolderArchive, Plus, Pencil, Check, X, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import JSZip from "jszip";

const elementPages = [
 { href: "/beam", label: "Beam", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
 { href: "/column", label: "Column", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
 { href: "/slab", label: "Slab", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
 { href: "/foundation", label: "Foundation", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
 { href: "/tank", label: "Tank", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
 { href: "/stairs", label: "Stairs", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
];

export default function ProjectDashboard() {
 const projectItems = useAppStore(state => state.projectItems);
 const removeFromProject = useAppStore(state => state.removeFromProject);
 const clearProject = useAppStore(state => state.clearProject);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editName, setEditName] = useState("");

 const handleExportZip = async () => {
 if (projectItems.length === 0) return;
 
 const zip = new JSZip();
 
 projectItems.forEach(item => {
 zip.file(`${item.name}.dxf`, item.dxfString);
 });

 const blob = await zip.generateAsync({ type: "blob" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `RDCAD_Project_Export.zip`;
 a.click();
 URL.revokeObjectURL(url);
 };

 const handleExportSingle = (item: { name: string; dxfString: string }) => {
 const blob = new Blob([item.dxfString], { type: "application/dxf" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `${item.name}.dxf`;
 a.click();
 URL.revokeObjectURL(url);
 };

 const startRename = (id: string, currentName: string) => {
 setEditingId(id);
 setEditName(currentName);
 };

 const confirmRename = (id: string) => {
 if (editName.trim()) {
 const item = projectItems.find(i => i.id === id);
 if (item) {
 useAppStore.getState().removeFromProject(id);
 useAppStore.getState().addToProject({
 ...item,
 id: crypto.randomUUID(),
 name: editName.trim(),
 });
 }
 }
 setEditingId(null);
 setEditName("");
 };

 const totalSize = projectItems.reduce((acc, item) => acc + item.dxfString.length, 0);

 return (
 <div className="p-4 md:p-8">
 <div className="max-w-7xl mx-auto space-y-4">
 {/* Header */}
 <header className="pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Project Dashboard</h1>
 <p className="text-muted-foreground mt-1 text-sm">
 {projectItems.length === 0 
 ? "Configure structural elements, then add them here for batch export." 
 : `${projectItems.length} element${projectItems.length > 1 ? 's' : ''} · ${(totalSize / 1024).toFixed(1)} KB total`}
 </p>
 </div>
 {projectItems.length > 0 && (
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
 <button 
 onClick={handleExportZip} 
 className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-primary-foreground shadow-lg shadow-emerald-500/20"
 >
 <FolderArchive className="w-4 h-4" /> Export All (.zip)
 </button>
 <button 
 onClick={() => { if (confirm("Remove all items from this project?")) clearProject(); }}
 className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition whitespace-nowrap bg-muted hover:bg-red-900/50 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 border border-border hover:border-red-900/50"
 >
 <Trash2 className="w-4 h-4" /> Clear All
 </button>
 </div>
 )}
 </header>

 {/* Quick-add bar — always visible */}
 <div className="bg-card rounded-xl border border-border p-5">
 <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Add — configure an element & click &quot;Save&quot;</h3>
 <div className="flex flex-wrap gap-2">
 {elementPages.map(page => (
 <Link
 key={page.href}
 href={page.href}
 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${page.bg} hover:bg-muted transition-colors`}
 >
 <Plus className={`w-3.5 h-3.5 ${page.color}`} />
 <span className="text-sm text-foreground font-medium">{page.label}</span>
 </Link>
 ))}
 </div>
 </div>

 {/* Items list */}
 {projectItems.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border border-dashed">
 <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center text-muted-foreground mb-2">
 <FolderArchive className="w-10 h-10" />
 </div>
 <div className="max-w-md mx-auto p-8 text-center text-muted-foreground">
 <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
 <p>Your project is empty.</p>
 <p className="mt-2 text-sm">Use the buttons above to navigate to a detailing page. Configure your element&apos;s properties, then click <strong>&quot;Save&quot;</strong> to collect it here. Once you&apos;ve gathered all elements, export them as a single ZIP file.</p>
 </div>
 </div>
 ) : (
 <div className="space-y-3">
 {projectItems.map((item, index) => (
 <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-border transition group">
 {/* Index & Icon */}
 <div className="flex items-center gap-3 shrink-0">
 <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-mono text-muted-foreground">
 {index + 1}
 </div>
 <FileText className="w-5 h-5 text-primary" />
 </div>

 {/* Name & Type */}
 <div className="flex-1 min-w-0">
 {editingId === item.id ? (
 <div className="flex items-center gap-2">
 <input
 type="text"
 value={editName}
 onChange={e => setEditName(e.target.value)}
 className="flex-1 bg-background border border-blue-700 dark:border-blue-500 rounded px-3 py-1.5 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
 autoFocus
 onKeyDown={e => {
 if (e.key === "Enter") confirmRename(item.id);
 if (e.key === "Escape") setEditingId(null);
 }}
 />
 <button onClick={() => confirmRename(item.id)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 p-1"><Check className="w-4 h-4" /></button>
 <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground p-1"><X className="w-4 h-4" /></button>
 </div>
 ) : (
 <div>
 <p className="text-foreground font-medium font-mono text-sm truncate">{item.name}<span className="text-muted-foreground">.dxf</span></p>
 <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.type} · {(item.dxfString.length / 1024).toFixed(1)} KB</p>
 </div>
 )}
 </div>

 {/* Actions */}
 <div className="flex items-center gap-1 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
 <button 
 onClick={() => startRename(item.id, item.name)}
 className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition"
 title="Rename"
 >
 <Pencil className="w-4 h-4" />
 </button>
 <button 
 onClick={() => handleExportSingle(item)}
 className="p-2 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-muted rounded-lg transition"
 title="Download this file"
 >
 <Download className="w-4 h-4" />
 </button>
 <button 
 onClick={() => removeFromProject(item.id)}
 className="p-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-muted rounded-lg transition"
 title="Remove from project"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
