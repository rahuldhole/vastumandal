"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useStore";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { useEngineWorker } from "../hooks/useEngineWorker";

export default function CADViewport() {
  const { activeTab, setActiveTab, plotSpec, reqSpec, rates, layers } = useAppStore();
  const { isCalculating, result, calculate } = useEngineWorker();
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger calculation when parameters change
    calculate(plotSpec, reqSpec, rates);
  }, [plotSpec, reqSpec, rates, calculate]);

  // Use worker geometry if available, else fallback to raw plotSpec
  const geomWidth = result?.geometry?.width || plotSpec.width;
  const geomLength = result?.geometry?.length || plotSpec.length;
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      setZoom(z => Math.min(z * zoomFactor, 10));
    } else {
      setZoom(z => Math.max(z / zoomFactor, 0.1));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 0 || e.button === 1) { // Left or middle click
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleFitScreen = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    // Base scale to fit screen with padding
    const padding = 40;
    const scaleX = (clientWidth - padding * 2) / geomWidth;
    const scaleY = (clientHeight - padding * 2) / geomLength;
    const minScale = Math.min(scaleX, scaleY);
    
    setZoom(minScale);
    setPan({ x: clientWidth / 2, y: clientHeight / 2 });
  };

  // Initial fit screen
  useEffect(() => {
    handleFitScreen();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 bg-neutral-900 flex flex-col relative overflow-hidden h-full">
      {/* Viewport Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur border border-border rounded-lg p-1 flex items-center z-10 shadow-lg">
        <button 
          onClick={() => setActiveTab('2D')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === '2D' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          2D Plan
        </button>
        <button 
          onClick={() => setActiveTab('3D')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === '3D' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          3D Isometric
        </button>
      </div>

      {isCalculating && (
        <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Calculating...
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <div className="bg-card/90 backdrop-blur border border-border rounded-lg shadow-lg flex flex-col overflow-hidden">
          <button onClick={() => setZoom(z => Math.min(z * 1.2, 10))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Zoom In">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="h-px bg-border"></div>
          <button onClick={() => setZoom(z => Math.max(z / 1.2, 0.1))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Zoom Out">
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="h-px bg-border"></div>
          <button onClick={handleFitScreen} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Fit to Screen">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full h-full flex items-center justify-center" ref={containerRef}>
        {activeTab === '2D' ? (
          // 2D SVG Canvas
          <svg 
            className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ touchAction: 'none' }}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom}, ${-zoom})`}>
              {/* Note: scale(zoom, -zoom) fixes Y-up coordinate inversion. Positive Y is now up. */}
              
              {/* Plot Boundary */}
              <rect 
                x={-geomWidth/2} 
                y={-geomLength/2} 
                width={geomWidth} 
                height={geomLength} 
                fill="none" 
                stroke="#64748b" 
                strokeWidth={2 / zoom} // Keep stroke width constant relative to screen
                strokeDasharray={`${4/zoom} ${4/zoom}`}
              />
              
              {/* Buildable Area (accounting for setbacks) */}
              <rect 
                x={-geomWidth/2 + plotSpec.setbacks.left} 
                y={-geomLength/2 + plotSpec.setbacks.rear} 
                width={geomWidth - (plotSpec.setbacks.left + plotSpec.setbacks.right)} 
                height={geomLength - (plotSpec.setbacks.front + plotSpec.setbacks.rear)} 
                fill="rgba(59, 130, 246, 0.1)" 
                stroke="#3b82f6" 
                strokeWidth={2 / zoom}
              />

              {/* Grid Layer */}
              {layers.grid && (
                <g stroke="#334155" strokeWidth={1 / zoom} strokeDasharray={`${2/zoom} ${2/zoom}`}>
                  <line x1={-geomWidth/2} y1={0} x2={geomWidth/2} y2={0} />
                  <line x1={0} y1={-geomLength/2} x2={0} y2={geomLength/2} />
                </g>
              )}

              {/* Dimensions Layer */}
              {layers.dims && (
                <g className="fill-muted-foreground font-sans" textAnchor="middle" style={{ fontSize: `${12/zoom}px` }}>
                  {/* Because of Y inversion, text needs to be scale(1, -1) to not render upside down */}
                  <text x={0} y={-geomLength/2 - 5} transform={`scale(1, -1)`}>{plotSpec.width}&apos; Wide</text>
                  <text x={0} y={0} transform={`translate(${-geomWidth/2 - 15}, 0) scale(1, -1) rotate(-90)`}>{plotSpec.length}&apos; Long</text>
                </g>
              )}

              {/* Mock Rooms */}
              <rect x={-10} y={-10} width={20} height={20} fill="#1e293b" stroke="#475569" strokeWidth={2 / zoom} />
              <text x={0} y={-2} className="fill-slate-300 font-medium font-sans" textAnchor="middle" transform={`scale(1, -1)`} style={{ fontSize: `${6/zoom}px` }}>Living Room</text>
            </g>
          </svg>
        ) : (
          // 3D Viewport
          <div className="w-full h-full">
            <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 20, 10]} intensity={1} />
              <OrbitControls makeDefault />
              
              <group position={[0, 0, 0]}>
                {/* Ground */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                  <planeGeometry args={[geomWidth, geomLength]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>

                {/* Mock Building Mass */}
                <Box 
                  args={[
                    geomWidth - plotSpec.setbacks.left - plotSpec.setbacks.right, 
                    10, // Height
                    geomLength - plotSpec.setbacks.front - plotSpec.setbacks.rear
                  ]} 
                  position={[
                    (plotSpec.setbacks.left - plotSpec.setbacks.right) / 2,
                    5,
                    (plotSpec.setbacks.front - plotSpec.setbacks.rear) / 2
                  ]}
                >
                  <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
                </Box>
                
                {/* Grid */}
                {layers.grid && <gridHelper args={[50, 50, "#475569", "#1e293b"]} />}
              </group>
            </Canvas>
          </div>
        )}
      </div>
    </div>
  );
}
