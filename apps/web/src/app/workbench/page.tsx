"use client";

import { useEffect, useState } from "react";
import ControlPanel from "@/components/ControlPanel";
import LiveBOQPanel from "@/components/LiveBOQPanel";
import dynamic from "next/dynamic";

const CADViewport = dynamic(() => import("@/components/CADViewport"), { ssr: false });
import { X } from "lucide-react";
import { useAppStore } from "@/store/useStore";

export default function Workbench() {
  const { leftPanelOpen, setLeftPanelOpen, rightPanelOpen, setRightPanelOpen } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setLeftPanelOpen(isDesktop);
      setRightPanelOpen(isDesktop);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setLeftPanelOpen, setRightPanelOpen]);

  if (!mounted) {
    return <div className="flex w-full bg-background overflow-hidden relative" style={{ height: "calc(100vh - 64px)" }}></div>;
  }

  return (
    <div className="flex w-full bg-background overflow-hidden relative" style={{ height: "calc(100vh - 64px)" }}>
      {/* Left Panel */}
      <div 
        className={`transition-all duration-300 flex-shrink-0 h-full border-r border-border bg-card
          absolute z-30 left-0 top-0 shadow-2xl lg:shadow-none
          ${leftPanelOpen ? 'translate-x-0 lg:relative lg:z-10' : '-translate-x-full lg:absolute'}
        `}
        style={{ width: "340px" }}
      >
        <div className="h-full relative group">
          <ControlPanel />
          {leftPanelOpen && (
            <button onClick={() => setLeftPanelOpen(false)} className="absolute top-4 right-4 z-40 bg-muted rounded-md p-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Center Viewport */}
      <div className="flex-1 relative z-0 w-full h-full flex flex-col">
        <CADViewport />
      </div>

      {/* Right Panel */}
      <div 
        className={`transition-all duration-300 flex-shrink-0 h-full border-l border-border bg-card
          absolute z-30 right-0 top-0 shadow-2xl lg:shadow-none
          ${rightPanelOpen ? 'translate-x-0 lg:relative lg:z-10' : 'translate-x-full lg:absolute'}
        `}
        style={{ width: "320px" }}
      >
        <div className="h-full relative group">
          <LiveBOQPanel />
          {rightPanelOpen && (
            <button onClick={() => setRightPanelOpen(false)} className="absolute top-4 right-4 z-40 bg-muted rounded-md p-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      {(leftPanelOpen || rightPanelOpen) && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => {
            setLeftPanelOpen(false);
            setRightPanelOpen(false);
          }}
        />
      )}
    </div>
  );
}
