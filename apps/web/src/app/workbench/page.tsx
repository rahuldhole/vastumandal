"use client";

import { useState, useEffect } from "react";
import ControlPanel from "@/components/ControlPanel";
import CADViewport from "@/components/CADViewport";
import LiveBOQPanel from "@/components/LiveBOQPanel";
import { ChevronRight, ChevronLeft, Menu, FileText, X } from "lucide-react";

export default function Workbench() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setLeftOpen(false);
        setRightOpen(false);
      } else {
        setLeftOpen(true);
        setRightOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // Force the workbench to fill the remaining screen height exactly, ignoring the pb-10 and footer layout flow
    <div className="flex w-full bg-background overflow-hidden relative" style={{ height: "calc(100vh - 64px)" }}>
      {/* Left Panel */}
      <div 
        className={`transition-transform duration-300 flex-shrink-0 h-full border-r border-border bg-card
          ${isMobile ? 'absolute z-30 left-0 top-0 shadow-2xl' : 'relative z-10'}
          ${leftOpen ? 'translate-x-0' : '-translate-x-full absolute'}
        `}
        style={{ width: "340px" }}
      >
        <div className="h-full relative group">
          <ControlPanel />
          {leftOpen && (
            <button onClick={() => setLeftOpen(false)} className={`absolute top-4 right-4 z-40 bg-muted rounded-md p-1 ${isMobile ? 'block' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Left Toggle Button (Hidden when open on mobile) */}
      {!leftOpen && (
        <button 
          onClick={() => setLeftOpen(true)} 
          className="absolute left-0 top-4 z-20 bg-card border border-border p-2 rounded-r-md shadow-md text-foreground hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Center Viewport */}
      <div className="flex-1 relative z-0 w-full h-full flex flex-col">
        <CADViewport />
      </div>

      {/* Right Toggle Button (Hidden when open on mobile) */}
      {!rightOpen && (
        <button 
          onClick={() => setRightOpen(true)} 
          className="absolute right-0 top-4 z-20 bg-card border border-border p-2 rounded-l-md shadow-md text-foreground hover:bg-muted"
        >
          <FileText className="w-5 h-5" />
        </button>
      )}

      {/* Right Panel */}
      <div 
        className={`transition-transform duration-300 flex-shrink-0 h-full border-l border-border bg-card
          ${isMobile ? 'absolute z-30 right-0 top-0 shadow-2xl' : 'relative z-10'}
          ${rightOpen ? 'translate-x-0' : 'translate-x-full absolute'}
        `}
        style={{ width: "320px" }}
      >
        <div className="h-full relative group">
          <LiveBOQPanel />
          {rightOpen && (
            <button onClick={() => setRightOpen(false)} className={`absolute top-4 right-4 z-40 bg-muted rounded-md p-1 ${isMobile ? 'block' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      {isMobile && (leftOpen || rightOpen) && (
        <div 
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => {
            setLeftOpen(false);
            setRightOpen(false);
          }}
        />
      )}
    </div>
  );
}
