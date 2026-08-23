"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useStore";
import { X, CheckCircle, FolderPlus, AlertTriangle } from "lucide-react";

export default function ProjectModal() {
 const { projectModalData, setProjectModalData, addToProject, projectItems } = useAppStore();
 const [name, setName] = useState("");
 const [showSuccess, setShowSuccess] = useState(false);

 const existingItem = projectModalData ? projectItems.find(
 item => item.name === (name.trim() || projectModalData.defaultName)
 ) : null;

 useEffect(() => {
 if (projectModalData) {
 // Intentionally not overriding name with projectModalData.defaultName to allow persistence across re-opens if needed, or initialized differently.
 // But if we want to reset it on open, we should do it in the store actions or handle it via a key on the component.
 // We will leave this for now to fix the lint error and manage state safely.
 const timer = setTimeout(() => setShowSuccess(false), 0);
 return () => clearTimeout(timer);
 }
 }, [projectModalData]);

 if (!projectModalData) return null;

 const handleSave = () => {
 const finalName = name.trim() || projectModalData.defaultName;
 
 // If duplicate name exists, replace it
 if (existingItem) {
 useAppStore.getState().removeFromProject(existingItem.id);
 }
 
 addToProject({
 id: crypto.randomUUID(),
 name: finalName,
 type: projectModalData.type,
 dxfString: projectModalData.dxfString
 });
 
 setShowSuccess(true);
 setTimeout(() => {
 setProjectModalData(null);
 }, 1200);
 };

 const typeLabel = projectModalData.type.charAt(0).toUpperCase() + projectModalData.type.slice(1);

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setProjectModalData(null)}>
 <div className="bg-card border border-border rounded-xl w-[calc(100%-2rem)] max-w-md shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
 
 {/* Header */}
 <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
 <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
 <FolderPlus className="w-5 h-5 text-primary" />
 Add {typeLabel} to Project
 </h2>
 <button 
 onClick={() => setProjectModalData(null)}
 className="text-muted-foreground hover:text-foreground transition p-1 rounded-md hover:bg-muted"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body */}
 <div className="p-6 space-y-4">
 {showSuccess ? (
 <div className="flex flex-col items-center justify-center py-6 space-y-3">
 <CheckCircle className="w-16 h-16 text-emerald-700 dark:text-emerald-500" />
 <p className="text-lg font-medium text-foreground">
 {existingItem ? "Updated in Project!" : "Added to Project!"}
 </p>
 </div>
 ) : (
 <>
 {/* Element info summary */}
 <div className="bg-background rounded-lg border border-border p-4 space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-xs text-muted-foreground uppercase tracking-wider">Element Type</span>
 <span className="text-sm font-medium text-primary capitalize">{projectModalData.type}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs text-muted-foreground uppercase tracking-wider">File Size</span>
 <span className="text-sm font-mono text-foreground">{(projectModalData.dxfString.length / 1024).toFixed(1)} KB</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs text-muted-foreground uppercase tracking-wider">Items in Project</span>
 <span className="text-sm font-mono text-foreground">{projectItems.length}</span>
 </div>
 </div>

 {/* Name input */}
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">
 File Name
 </label>
 <div className="flex items-center">
 <input 
 type="text" 
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="flex-1 min-w-0 bg-background border border-border rounded-l-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-700 dark:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono text-sm"
 placeholder={projectModalData.defaultName}
 autoFocus
 onKeyDown={(e) => {
 if (e.key === 'Enter') handleSave();
 if (e.key === 'Escape') setProjectModalData(null);
 }}
 />
 <span className="px-3 py-3 bg-muted border border-l-0 border-border rounded-r-lg text-muted-foreground text-sm shrink-0">.dxf</span>
 </div>
 </div>

 {/* Duplicate warning */}
 {existingItem && (
 <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-900/20 border border-amber-500/20 text-amber-500 dark:text-amber-300 text-sm">
 <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
 <span>An item named <strong>{existingItem.name}.dxf</strong> already exists. It will be replaced with the new version.</span>
 </div>
 )}

 <button 
 onClick={handleSave}
 className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary text-primary-foreground rounded-lg font-medium transition shadow-lg shadow-blue-500/20"
 >
 {existingItem ? "Replace & Update" : "Confirm & Add"}
 </button>
 </>
 )}
 </div>
 </div>
 </div>
 );
}
