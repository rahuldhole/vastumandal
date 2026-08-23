"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useStore";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

export default function CADViewport() {
  const { activeTab, setActiveTab, plotSpec, layers } = useAppStore();
  const [zoom, setZoom] = useState(1);

  // Mock viewport drawing scale and offset
  const scale = 5 * zoom; 
  const width = plotSpec.width * scale;
  const length = plotSpec.length * scale;
  
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

      {/* Floating Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <div className="bg-card/90 backdrop-blur border border-border rounded-lg shadow-lg flex flex-col overflow-hidden">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Zoom In">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="h-px bg-border"></div>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Zoom Out">
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="h-px bg-border"></div>
          <button onClick={() => setZoom(1)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Reset View">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        {activeTab === '2D' ? (
          // 2D SVG Canvas
          <svg className="w-full h-full cursor-grab active:cursor-grabbing" style={{ touchAction: 'none' }}>
            <g transform={`translate(500, 300)`}>
              {/* Plot Boundary */}
              <rect 
                x={-width/2} 
                y={-length/2} 
                width={width} 
                height={length} 
                fill="none" 
                stroke="#64748b" 
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              
              {/* Buildable Area (accounting for setbacks) */}
              <rect 
                x={-width/2 + plotSpec.setbacks.left * scale} 
                y={-length/2 + plotSpec.setbacks.rear * scale} 
                width={width - (plotSpec.setbacks.left + plotSpec.setbacks.right) * scale} 
                height={length - (plotSpec.setbacks.front + plotSpec.setbacks.rear) * scale} 
                fill="rgba(59, 130, 246, 0.1)" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />

              {/* Grid Layer */}
              {layers.grid && (
                <g stroke="#334155" strokeWidth={1} strokeDasharray="2 2">
                  <line x1={-width/2} y1={0} x2={width/2} y2={0} />
                  <line x1={0} y1={-length/2} x2={0} y2={length/2} />
                </g>
              )}

              {/* Dimensions Layer */}
              {layers.dims && (
                <g className="text-[10px] fill-muted-foreground" textAnchor="middle">
                  <text x={0} y={length/2 + 20}>{plotSpec.width}&apos; Wide</text>
                  <text x={-width/2 - 20} y={0} transform={`rotate(-90, ${-width/2 - 20}, 0)`}>{plotSpec.length}&apos; Long</text>
                </g>
              )}

              {/* Mock Rooms */}
              <rect x={-50 * zoom} y={-50 * zoom} width={100 * zoom} height={100 * zoom} fill="#1e293b" stroke="#475569" strokeWidth={2} />
              <text x={0} y={5} className="text-xs fill-slate-300 font-medium" textAnchor="middle">Living Room</text>
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
                  <planeGeometry args={[plotSpec.width, plotSpec.length]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>

                {/* Mock Building Mass */}
                <Box 
                  args={[
                    plotSpec.width - plotSpec.setbacks.left - plotSpec.setbacks.right, 
                    10, // Height
                    plotSpec.length - plotSpec.setbacks.front - plotSpec.setbacks.rear
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
