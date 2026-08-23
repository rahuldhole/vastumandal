"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useStore";
import { useProjectImport } from "@/hooks/useProjectImport";
import { Download, Upload, Check, FolderOpen, Save } from "lucide-react";
import ExportModal from "./ExportModal";

export default function WorkbenchHeader() {
  const { 
    leftPanelOpen, 
    setLeftPanelOpen, 
    rightPanelOpen, 
    setRightPanelOpen, 
    activeTab, 
    setActiveTab, 
    isCalculating 
  } = useAppStore();
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // File System Access API handle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileHandle, setFileHandle] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importFile } = useProjectImport();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importFile(file);
        setActiveMenu(null);
        setFileHandle(null); // Clear handle as it's a new legacy import
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import file.");
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenProject = async () => {
    try {
      if ('showOpenFilePicker' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [handle] = await (window as any).showOpenFilePicker({
          types: [{
            description: 'Vastumandal Project',
            accept: { 'application/json': ['.vastu', '.json'] }
          }],
          multiple: false
        });
        const file = await handle.getFile();
        await importFile(file);
        setFileHandle(handle);
        setActiveMenu(null);
      } else {
        // Fallback to legacy import
        handleImportClick();
        setActiveMenu(null);
      }
    } catch (error) {
      // User cancelled or error occurred
      console.error(error);
    }
  };

  const handleSaveProject = async () => {
    const state = useAppStore.getState();
    const exportData = {
      schemaVersion: "1.0.0",
      meta: {
        projectName: state.templateData?.projectName || 'Vastumandal',
        createdAt: new Date().toISOString(),
      },
      state: {
        ...state,
        boqResult: null,
        geometryResult: null,
        isCalculating: false
      }
    };
    
    const jsonStr = JSON.stringify(exportData, null, 2);
    const defaultFileName = `${(state.templateData?.projectName || 'Vastumandal').replace(/\s+/g, '_')}_Project.vastu`;

    try {
      if ('showSaveFilePicker' in window) {
        let currentHandle = fileHandle;
        if (!currentHandle) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          currentHandle = await (window as any).showSaveFilePicker({
            suggestedName: defaultFileName,
            types: [{
              description: 'Vastumandal Project',
              accept: { 'application/json': ['.vastu'] }
            }]
          });
          setFileHandle(currentHandle);
        }
        
        const writable = await currentHandle.createWritable();
        await writable.write(jsonStr);
        await writable.close();
        alert('Project saved successfully!');
      } else {
        // Fallback to standard download link if File System Access API is not supported
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = defaultFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Save failed", err);
      // Don't alert if user just cancelled the picker
      if (err instanceof Error && err.name !== 'AbortError') {
        alert('Failed to save file.');
      }
    }
    setActiveMenu(null);
  };

  return (
    <header className="bg-card border-b border-border h-12 flex items-center shrink-0 z-50 text-sm select-none relative">
      {/* Click outside catcher */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveMenu(null)}
        />
      )}
      
      <div className="flex items-center px-2 w-full gap-2 sm:gap-4 relative z-50">
        
        {/* App Icon */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity ml-1">
          <Image src="/logo.jpg" alt="Vastumandal Logo" width={24} height={24} className="w-6 h-6 rounded-md" />
        </Link>

        {/* Menu Bar */}
        <div className="flex items-center font-medium text-muted-foreground">
          {/* File Menu */}
          <div className="relative">
            <button 
              className={`px-3 py-1 rounded-md hover:bg-muted hover:text-foreground transition-colors ${activeMenu === 'File' ? 'bg-muted text-foreground' : ''}`}
              onClick={() => setActiveMenu(activeMenu === 'File' ? null : 'File')}
            >
              File
            </button>
            {activeMenu === 'File' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border shadow-lg rounded-md py-1 z-50 flex flex-col">
                <button 
                  onClick={handleOpenProject}
                  className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors"
                >
                  <FolderOpen className="w-4 h-4" /> Open Project...
                </button>
                <button 
                  onClick={handleSaveProject}
                  className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Project
                </button>
                <button 
                  onClick={() => { handleImportClick(); setActiveMenu(null); }}
                  className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors"
                >
                  <Upload className="w-4 h-4" /> Import Project (.vastu)
                </button>
                <button 
                  onClick={() => { setIsExportModalOpen(true); setActiveMenu(null); }}
                  className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors"
                >
                  <Download className="w-4 h-4" /> Export...
                </button>
                <div className="h-px bg-border my-1 mx-2"></div>
                <Link href="/" className="px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors block">
                  Exit Workbench
                </Link>
              </div>
            )}
          </div>
          
          {/* View Menu */}
          <div className="relative">
            <button 
              className={`px-3 py-1 rounded-md hover:bg-muted hover:text-foreground transition-colors ${activeMenu === 'View' ? 'bg-muted text-foreground' : ''}`}
              onClick={() => setActiveMenu(activeMenu === 'View' ? null : 'View')}
            >
              View
            </button>
            {activeMenu === 'View' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border shadow-lg rounded-md py-1 z-50 flex flex-col">
                <button onClick={() => { setLeftPanelOpen(!leftPanelOpen); }} className="px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors flex items-center justify-between">
                  <span>Control Panel</span>
                  {leftPanelOpen && <Check className="w-4 h-4" />}
                </button>
                <button onClick={() => { setRightPanelOpen(!rightPanelOpen); }} className="px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors flex items-center justify-between">
                  <span>Live BOQ</span>
                  {rightPanelOpen && <Check className="w-4 h-4" />}
                </button>
                <div className="h-px bg-border my-1 mx-2"></div>
                <button onClick={() => { setActiveTab('2D'); }} className="px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors flex items-center justify-between">
                  <span>2D Plan</span>
                  {activeTab === '2D' && <Check className="w-4 h-4" />}
                </button>
                <button onClick={() => { setActiveTab('3D'); }} className="px-3 py-1.5 text-left hover:bg-muted hover:text-foreground w-full transition-colors flex items-center justify-between">
                  <span>3D Isometric</span>
                  {activeTab === '3D' && <Check className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          <Link href="/guide" className="px-3 py-1 rounded-md hover:bg-muted hover:text-foreground transition-colors">
            Help
          </Link>
        </div>
        
        {/* Quick Access Actions & Compute Status (Right Aligned) */}
        <div className="flex-1 flex justify-end items-center gap-2">
           <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] md:text-xs font-medium shadow-sm transition-all ${isCalculating ? 'bg-amber-50/50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800' : 'bg-emerald-50/50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800'}`}>
             <div className="relative flex h-2 w-2">
               {isCalculating && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>}
               <span className={`relative inline-flex rounded-full h-2 w-2 ${isCalculating ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
             </div>
             {isCalculating ? 'Computing...' : 'Ready'}
           </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        accept=".vastu,.json" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </header>
  );
}
