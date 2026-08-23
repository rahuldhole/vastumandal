"use client";

import React, { useState } from "react";
import { Download, FileDown, X } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Project
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select an export format for your current configuration.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-card hover:bg-muted hover:border-blue-500 transition-all group">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-semibold text-foreground">.DXF</span>
              <span className="text-xs text-muted-foreground mt-1">2D CAD Format</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-card hover:bg-muted hover:border-indigo-500 transition-all group">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="font-semibold text-foreground">.OBJ</span>
              <span className="text-xs text-muted-foreground mt-1">3D Mesh Data</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-card hover:bg-muted hover:border-emerald-500 transition-all group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-semibold text-foreground">.IFC</span>
              <span className="text-xs text-muted-foreground mt-1">BIM Model</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-card hover:bg-muted hover:border-rose-500 transition-all group">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileDown className="w-5 h-5 text-rose-500" />
              </div>
              <span className="font-semibold text-foreground">.PDF</span>
              <span className="text-xs text-muted-foreground mt-1">Reports & BOQ</span>
            </button>

            <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-card hover:bg-muted hover:border-amber-500 transition-all group sm:col-span-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5 text-amber-500" />
              </div>
              <span className="font-semibold text-foreground">.LSP</span>
              <span className="text-xs text-muted-foreground mt-1">AutoLISP Script</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
