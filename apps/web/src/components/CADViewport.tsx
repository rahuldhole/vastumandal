"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useStore";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Edges, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { ZoomIn, ZoomOut, Maximize, Layers, X, Printer, BoxSelect, Square, AppWindow } from "lucide-react";
import { useEngineWorker } from "../hooks/useEngineWorker";
import type { PlotSpec, TitleBlockRow } from '@vastumandal/dwg-schemas';

interface DrawingContentProps {
  plotSpec: PlotSpec;
  layers: { zones?: boolean; grid?: boolean; dims?: boolean; openings?: boolean };
  zoom: number;
  isPrint: boolean;
  templateData: TitleBlockRow;
  geomWidth: number;
  geomLength: number;
}

const DrawingContent = ({ plotSpec, layers, zoom, isPrint, templateData, geomWidth, geomLength }: DrawingContentProps) => {
  const bW = geomWidth - plotSpec.setbacks.left - plotSpec.setbacks.right;
  const bL = geomLength - plotSpec.setbacks.front - plotSpec.setbacks.rear;
  const bX = -geomWidth/2 + plotSpec.setbacks.left;
  const bY = -geomLength/2 + plotSpec.setbacks.rear;
  
  const wallThick = 0.75;
  const colSize = 1;
  
  const gridX = [bX, bX + bW/2, bX + bW];
  const gridY = [bY, bY + bL/2, bY + bL];
  
  // Use a fixed zoom of 1 for print to avoid scaling issues, but maintain relative strokes
  const z = isPrint ? 1 : zoom;

  return (
    <>
      {isPrint && (
        <>
          <rect x={-geomWidth/2 - 10} y={-geomLength/2 - 10} width={geomWidth + 20} height={geomLength + 20} fill="white" />
          <rect x={-geomWidth/2 - 8} y={-geomLength/2 - 8} width={geomWidth + 16} height={geomLength + 16} fill="none" stroke="black" strokeWidth={0.5} />
        </>
      )}

      {/* Grid Layer */}
      {layers.grid && (
        <g stroke="#94a3b8" strokeWidth={1 / z} strokeDasharray={`${4/z} ${4/z}`}>
          {gridX.map((x, i) => (
            <g key={`gx-${i}`}>
              <line x1={x} y1={-geomLength/2 - 5} x2={x} y2={geomLength/2 + 5} />
              <circle cx={x} cy={geomLength/2 + 7} r={2/z} fill="white" stroke="#64748b" strokeWidth={1/z} />
              <text x={x} y={-geomLength/2 - 7} transform={`translate(${x}, ${-geomLength/2 - 7}) scale(1, -1) translate(${-x}, ${-(-geomLength/2 - 7)})`} textAnchor="middle" style={{fontSize: `${2/z}px`}} className="fill-slate-500 font-sans">{String.fromCharCode(65 + i)}</text>
            </g>
          ))}
          {gridY.map((y, i) => (
            <g key={`gy-${i}`}>
              <line x1={-geomWidth/2 - 5} y1={y} x2={geomWidth/2 + 5} y2={y} />
              <circle cx={-geomWidth/2 - 7} cy={y} r={2/z} fill="white" stroke="#64748b" strokeWidth={1/z} />
              <text x={-geomWidth/2 - 7} y={y - 0.7/z} transform={`translate(${-geomWidth/2 - 7}, ${y}) scale(1, -1) translate(${-(-geomWidth/2 - 7)}, ${-y})`} textAnchor="middle" style={{fontSize: `${2/z}px`}} className="fill-slate-500 font-sans">{i + 1}</text>
            </g>
          ))}
        </g>
      )}

      {/* Walls Layer */}
      {layers.zones && (
        <g stroke="#0f172a" strokeWidth={1.5 / z} fill="none">
          {/* Outer Wall */}
          <rect x={bX} y={bY} width={bW} height={bL} />
          <rect x={bX + wallThick} y={bY + wallThick} width={bW - 2*wallThick} height={bL - 2*wallThick} />
          {/* Inner partition crossing */}
          <line x1={bX + bW/2} y1={bY} x2={bX + bW/2} y2={bY + bL} />
          <line x1={bX + bW/2 + wallThick} y1={bY} x2={bX + bW/2 + wallThick} y2={bY + bL} />
          <line x1={bX} y1={bY + bL/2} x2={bX + bW/2} y2={bY + bL/2} />
          <line x1={bX} y1={bY + bL/2 + wallThick} x2={bX + bW/2} y2={bY + bL/2 + wallThick} />
        </g>
      )}

      {/* Columns Layer */}
      {layers.zones && (
        <g fill="#334155" stroke="#0f172a" strokeWidth={1/z}>
          {gridX.map((x, ix) => 
            gridY.map((y, iy) => (
              <rect key={`c-${ix}-${iy}`} x={x - colSize/2} y={y - colSize/2} width={colSize} height={colSize} />
            ))
          )}
        </g>
      )}

      {/* Dimensions Layer */}
      {layers.dims && (
        <g className="fill-slate-600 stroke-slate-400 font-sans" strokeWidth={1/z}>
          <line x1={bX} y1={bY - 3} x2={bX + bW} y2={bY - 3} />
          <line x1={bX} y1={bY - 2.5} x2={bX} y2={bY - 3.5} />
          <line x1={bX + bW} y1={bY - 2.5} x2={bX + bW} y2={bY - 3.5} />
          <text x={bX + bW/2} y={bY - 4} transform={`translate(${bX + bW/2}, ${bY - 4}) scale(1, -1) translate(${-bX - bW/2}, ${-bY + 4})`} textAnchor="middle" style={{fontSize: `${2.5/z}px`}}>{bW}&apos; Width</text>
          
          <line x1={bX + bW + 3} y1={bY} x2={bX + bW + 3} y2={bY + bL} />
          <line x1={bX + bW + 2.5} y1={bY} x2={bX + bW + 3.5} y2={bY} />
          <line x1={bX + bW + 2.5} y1={bY + bL} x2={bX + bW + 3.5} y2={bY + bL} />
          <text x={bX + bW + 4} y={bY + bL/2} transform={`translate(${bX + bW + 4}, ${bY + bL/2}) scale(1, -1) rotate(-90) translate(${-bX - bW - 4}, ${-bY - bL/2})`} textAnchor="middle" style={{fontSize: `${2.5/z}px`}}>{bL}&apos; Length</text>
        </g>
      )}

      {/* Title Block */}
      {layers.grid && (
        <g transform={`translate(${geomWidth/2 - 15}, ${-geomLength/2 + 2})`}>
          <rect x={0} y={0} width={25} height={10} fill="white" stroke="#0f172a" strokeWidth={1/z} />
          <line x1={0} y1={5} x2={25} y2={5} stroke="#0f172a" strokeWidth={1/z} />
          <text x={2} y={8} transform={`translate(2, 8) scale(1, -1) translate(-2, -8)`} style={{fontSize: `${1.5/z}px`, fontWeight: 'bold'}} className="fill-black font-sans">{templateData?.projectName || 'Project Title'}</text>
          <text x={2} y={6} transform={`translate(2, 6) scale(1, -1) translate(-2, -6)`} style={{fontSize: `${1.2/z}px`}} className="fill-black font-sans">Client: {templateData?.clientName || 'Client'}</text>
          <text x={2} y={3} transform={`translate(2, 3) scale(1, -1) translate(-2, -3)`} style={{fontSize: `${1/z}px`}} className="fill-black font-sans">Date: {templateData?.date}</text>
          <text x={15} y={3} transform={`translate(15, 3) scale(1, -1) translate(-15, -3)`} style={{fontSize: `${1/z}px`}} className="fill-black font-sans">By: {templateData?.drawnBy}</text>
        </g>
      )}
    </>
  );
};

interface Scene3DProps {
  geomWidth: number;
  geomLength: number;
  plotSpec: PlotSpec;
  layers: { zones?: boolean; grid?: boolean; dims?: boolean; openings?: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: any;
}

const Scene3D = ({ geomWidth, geomLength, plotSpec, layers, controlsRef }: Scene3DProps) => {
  const bW = geomWidth - plotSpec.setbacks.left - plotSpec.setbacks.right;
  const bL = geomLength - plotSpec.setbacks.front - plotSpec.setbacks.rear;
  const bX = (plotSpec.setbacks.left - plotSpec.setbacks.right) / 2;
  const bY = (plotSpec.setbacks.front - plotSpec.setbacks.rear) / 2;
  
  const colSize = 1;
  const height = 10;

  const gridX = [-bW/2, 0, bW/2];
  const gridY = [-bL/2, 0, bL/2];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 30, 10]} intensity={1.5} castShadow />
      <OrbitControls ref={controlsRef} makeDefault dampingFactor={0.1} />
      
      <group position={[0, 0, 0]}>
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[geomWidth * 2, geomLength * 2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {layers.grid && (
          <gridHelper args={[geomWidth * 2, 40, "#94a3b8", "#e2e8f0"]} position={[0, 0.01, 0]} />
        )}

        <group position={[bX, 0, bY]}>
          {/* Main Building Mass - Clay style walls */}
          {layers.zones && (
            <Box args={[bW, height, bL]} position={[0, height/2, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
              <Edges threshold={15} color="#0f172a" />
            </Box>
          )}

          {/* Columns */}
          {layers.zones && gridX.map((x, ix) => 
            gridY.map((y, iy) => (
              <Box key={`col-${ix}-${iy}`} args={[colSize + 0.1, height + 0.2, colSize + 0.1]} position={[x, height/2, y]} castShadow>
                <meshStandardMaterial color="#334155" roughness={0.7} />
                <Edges threshold={15} color="#000000" />
              </Box>
            ))
          )}
        </group>

        <ContactShadows position={[0, 0.05, 0]} opacity={0.4} scale={50} blur={2} far={15} />
      </group>
    </>
  );
};

export default function CADViewport() {
  const { activeTab, plotSpec, reqSpec, rates, layers, setLayers, templateData } = useAppStore();
  const { isCalculating, result, calculate } = useEngineWorker();
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    calculate(plotSpec, reqSpec, rates);
  }, [plotSpec, reqSpec, rates, calculate]);

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
    if (e.button === 0 || e.button === 1) {
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
    
    const padding = 40;
    const scaleX = (clientWidth - padding * 2) / geomWidth;
    const scaleY = (clientHeight - padding * 2) / geomLength;
    const minScale = Math.min(scaleX, scaleY);
    
    setZoom(minScale);
    setPan({ x: clientWidth / 2, y: clientHeight / 2 });
  };

  useEffect(() => {
    handleFitScreen();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set3DView = (view: 'top' | 'front' | 'iso') => {
    if (!controlsRef.current) return;
    const camera = controlsRef.current.object;
    
    if (view === 'top') {
      camera.position.set(0, 50, 0);
    } else if (view === 'front') {
      camera.position.set(0, 5, 50);
    } else if (view === 'iso') {
      camera.position.set(30, 30, 30);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-neutral-900 flex flex-col relative overflow-hidden h-full">
      {isCalculating && (
        <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-2 print:hidden">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Calculating...
        </div>
      )}

      {/* Top Right Controls (Layers) */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20 print:hidden">
        {activeTab === '2D' && (
          <button 
            onClick={handlePrint}
            className="p-2 rounded-md border border-border shadow-md bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Print Sheet"
          >
            <Printer className="w-5 h-5" />
          </button>
        )}
        <div className="relative">
          <button 
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className={`p-2 rounded-md border border-border shadow-md transition ${isLayersOpen ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Layers className="w-5 h-5" />
          </button>
          
          {isLayersOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
                <span className="font-semibold text-sm">Visible Layers</span>
                <button onClick={() => setIsLayersOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <label className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition">
                  <input type="checkbox" checked={layers.zones} onChange={() => setLayers({ zones: !layers.zones })} className="rounded bg-muted border-border text-primary focus:ring-primary h-4 w-4" />
                  <span className="text-sm font-medium">Structure</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition">
                  <input type="checkbox" checked={layers.grid} onChange={() => setLayers({ grid: !layers.grid })} className="rounded bg-muted border-border text-primary focus:ring-primary h-4 w-4" />
                  <span className="text-sm font-medium">Grid & Meta</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition">
                  <input type="checkbox" checked={layers.dims} onChange={() => setLayers({ dims: !layers.dims })} className="rounded bg-muted border-border text-primary focus:ring-primary h-4 w-4" />
                  <span className="text-sm font-medium">Dimensions</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10 print:hidden">
        {activeTab === '3D' && (
          <div className="bg-card/90 backdrop-blur border border-border rounded-lg shadow-lg flex flex-col overflow-hidden mb-2">
            <button onClick={() => set3DView('top')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Top View">
              <Square className="w-5 h-5" />
            </button>
            <div className="h-px bg-border"></div>
            <button onClick={() => set3DView('front')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Front View">
              <AppWindow className="w-5 h-5" />
            </button>
            <div className="h-px bg-border"></div>
            <button onClick={() => set3DView('iso')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition" title="Isometric View">
              <BoxSelect className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-card/90 backdrop-blur border border-border rounded-lg shadow-lg flex flex-col overflow-hidden">
          {activeTab === '2D' && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Print-only layout */}
      {activeTab === '2D' && (
        <div className="hidden print:flex w-full h-full items-center justify-center bg-white m-0 p-0 absolute inset-0 z-50">
          <svg 
            className="w-full h-full max-w-full max-h-full"
            viewBox={`${-geomWidth/2 - 12} ${-geomLength/2 - 12} ${geomWidth + 24} ${geomLength + 24}`}
          >
            <DrawingContent 
              plotSpec={plotSpec} 
              layers={layers} 
              zoom={1} 
              isPrint={true} 
              templateData={templateData} 
              geomWidth={geomWidth} 
              geomLength={geomLength} 
            />
          </svg>
        </div>
      )}

      {/* Screen Canvas Area */}
      <div className="flex-1 w-full h-full flex items-center justify-center print:hidden" ref={containerRef}>
        {activeTab === '2D' ? (
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
              <DrawingContent 
                plotSpec={plotSpec} 
                layers={layers} 
                zoom={zoom} 
                isPrint={false} 
                templateData={templateData} 
                geomWidth={geomWidth} 
                geomLength={geomLength} 
              />
            </g>
          </svg>
        ) : (
          <div className="w-full h-full">
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[30, 30, 30]} fov={50} ref={cameraRef} />
              <Scene3D 
                geomWidth={geomWidth} 
                geomLength={geomLength} 
                plotSpec={plotSpec} 
                layers={layers}
                controlsRef={controlsRef}
              />
            </Canvas>
          </div>
        )}
      </div>
    </div>
  );
}
