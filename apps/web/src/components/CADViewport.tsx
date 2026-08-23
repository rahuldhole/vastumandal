import React, { useState, useRef, useMemo, useEffect, MouseEvent } from 'react';
import { Plus, Minus, Maximize, Compass, Info, Layers } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { BoxGeometry } from 'three';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/store/useStore';
import { generateLayout, type LayoutRoom, type ColumnPos } from '@/utils/generateLayout';
import dynamic from 'next/dynamic';

const IFCViewport = dynamic(() => import('./IFCViewport'), { ssr: false });
import DxfInspector from './DxfInspector';

// Scale factor: 1 metre = SCALE px in SVG
const SCALE = 28;
const SVG_PAD = 40; // padding around the plot in SVG
const WALL_THICKNESS = 0.23; // 230mm in metres

export default function CADViewport() {
  const { activeTab, plotSpec, reqSpec } = useAppStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Generate layout from live store data
  const layout = useMemo(() => generateLayout(plotSpec, reqSpec), [plotSpec, reqSpec]);

  const [layers, setLayers] = useState({
    vastu: false,
    grid: true,
    walls: true,
    columns: true,
    footings: true,
    dims: true,
    beams: true,
    rooms: true,
    fixtures: true,
  });
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<{
    id: string;
    type: string;
    x: number;
    y: number;
    details?: Record<string, string>;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleNativeWheel = (e: globalThis.WheelEvent) => {
      if (activeTab === '2D') {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setTransform(prev => ({ ...prev, scale: Math.max(0.2, Math.min(prev.scale + delta, 6)) }));
      }
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleNativeWheel);
  }, [activeTab]);

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
    }
  };
  const handleMouseUp = () => setIsDragging(false);
  const resetView = () => setTransform({ scale: 1, x: 0, y: 0 });
  const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.25, 6) }));
  const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(0.2, prev.scale - 0.25) }));

  const layerColors: Record<string, string> = {
    vastu: 'bg-purple-500', grid: 'bg-gray-500', walls: 'bg-white',
    columns: 'bg-red-500', footings: 'bg-green-400', dims: 'bg-yellow-400',
    beams: 'bg-blue-400', rooms: 'bg-cyan-400', fixtures: 'bg-orange-400',
  };

  // Derived SVG values
  const { plotW, plotH, buildable, rooms, columns, fixtures } = layout;
  const svgW = plotW * SCALE + SVG_PAD * 2;
  const svgH = plotH * SCALE + SVG_PAD * 2;

  // Coordinate helpers: model (m) → SVG px. Y is flipped so "front" (y=0) is at bottom.
  const mx = (m: number) => SVG_PAD + m * SCALE;
  const my = (m: number) => SVG_PAD + (plotH - m) * SCALE; // flip Y

  // Floor count for 3D
  const floorCount = (() => {
    const fc = plotSpec.floorCount || 'G';
    if (fc === 'G') return 1;
    const match = fc.match(/G\+(\d+)/i);
    return match ? 1 + parseInt(match[1], 10) : 1;
  })();

  return (
    <div
      className="relative w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col font-sans select-none"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* ── Layer Visibility Dock ── */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <button 
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className={`p-2.5 backdrop-blur-md border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white rounded-xl shadow-xl transition-colors ${isLayersOpen ? 'bg-white/80 dark:bg-white/20' : 'bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20'}`}
          title="Toggle Layers"
        >
          <Layers size={20} />
        </button>

        {isLayersOpen && (
          <div className="backdrop-blur-md bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white p-3 rounded-2xl shadow-xl flex flex-col gap-2 w-40">
            <h4 className="font-semibold text-xs text-slate-500 dark:text-white/70 uppercase tracking-wider mb-1">Layers</h4>
            {Object.keys(layers).map(layer => (
              <label key={layer} onClick={() => toggleLayer(layer as keyof typeof layers)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative w-8 h-4 rounded-full transition-colors ${layers[layer as keyof typeof layers] ? 'bg-primary' : 'bg-white/20'}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${layers[layer as keyof typeof layers] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className={`w-2 h-2 rounded-full ${layerColors[layer] || 'bg-gray-400'}`}></span>
                  <span className="text-sm capitalize group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-slate-700 dark:text-white/80">{layer}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ── Navigation HUD ── */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2 backdrop-blur-md bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl p-1 shadow-xl">
        <button onClick={zoomIn} className="p-2 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition" title="Zoom In (+)"><Plus size={20} /></button>
        <button onClick={zoomOut} className="p-2 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition" title="Zoom Out (-)"><Minus size={20} /></button>
        <div className="w-full h-px bg-slate-300 dark:bg-white/20 my-1"></div>
        <button onClick={resetView} className="p-2 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition" title="Zoom Extents (Z+E)"><Maximize size={20} /></button>
        <button onClick={resetView} className="p-2 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition" title="Reset North"><Compass size={20} /></button>
      </div>

      {/* ── Plot Info Badge ── */}
      <div className="absolute top-4 left-4 z-10 backdrop-blur-md bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white px-3 py-2 rounded-xl shadow-xl">
        <div className="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-wider">Plot</div>
        <div className="text-sm font-bold">{plotW}m × {plotH}m</div>
        <div className="text-[10px] text-slate-600 dark:text-white/60 mt-0.5">{plotSpec.floorCount || 'G'} • {reqSpec.bhk || '2BHK'}</div>
      </div>

      {/* ── Tooltip ── */}
      {hoveredElement && (
        <div
          className="absolute z-20 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-lg shadow-2xl pointer-events-none max-w-[220px]"
          style={{ left: hoveredElement.x + 15, top: hoveredElement.y + 15 }}
        >
          <div className="flex items-center gap-2 mb-1.5 border-b border-slate-200 dark:border-slate-700 pb-1.5">
            <Info size={14} className="text-blue-500 dark:text-blue-400" />
            <strong className="text-sm">{hoveredElement.id}</strong>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase">{hoveredElement.type}</span>
          </div>
          {hoveredElement.details && (
            <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-300">
              {Object.entries(hoveredElement.details).map(([k, v]) => (
                <p key={k}>{k}: <span className="text-slate-900 dark:text-white font-mono">{v}</span></p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 w-full h-full relative">
        {activeTab === 'DXF' ? (
          <DxfInspector />
        ) : activeTab === 'IFC' ? (
          <IFCViewport />
        ) : activeTab === '3D' ? (
          <ThreeView
            layout={layout}
            layers={layers}
            floorCount={floorCount}
            isDark={isDark}
          />
        ) : (
          <svg
            width="100%" height="100%"
            viewBox={`0 0 ${svgW} ${svgH}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: '50% 50%',
            }}
          >
            {/* Background grid */}
            {layers.grid && (
              <g>
                {/* Vertical gridlines every 1m */}
                {Array.from({ length: Math.ceil(plotW) + 1 }, (_, i) => (
                  <line key={`gx${i}`} x1={mx(i)} y1={my(0)} x2={mx(i)} y2={my(plotH)} stroke={isDark ? "#374151" : "#cbd5e1"} strokeWidth="0.5" strokeDasharray="4 6" />
                ))}
                {/* Horizontal gridlines every 1m */}
                {Array.from({ length: Math.ceil(plotH) + 1 }, (_, i) => (
                  <line key={`gy${i}`} x1={mx(0)} y1={my(i)} x2={mx(plotW)} y2={my(i)} stroke={isDark ? "#374151" : "#cbd5e1"} strokeWidth="0.5" strokeDasharray="4 6" />
                ))}
              </g>
            )}

            {/* Plot boundary */}
            <rect
              x={mx(0)} y={my(plotH)} width={plotW * SCALE} height={plotH * SCALE}
              fill="none" stroke={isDark ? "#6b7280" : "#94a3b8"} strokeWidth="2"
            />

            {/* Setback envelope (dashed) */}
            <rect
              x={mx(buildable.x)} y={my(buildable.y + buildable.h)}
              width={buildable.w * SCALE} height={buildable.h * SCALE}
              fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"
            />

            {/* Room fills */}
            {layers.rooms && rooms.map((r: LayoutRoom) => (
              <g key={r.id}>
                <rect
                  x={mx(r.x)} y={my(r.y + r.h)}
                  width={r.w * SCALE} height={r.h * SCALE}
                  fill={r.color} stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} strokeWidth="1"
                  className="transition-all duration-150 hover:brightness-125 cursor-pointer"
                  onMouseEnter={(e) => setHoveredElement({
                    id: r.id, type: r.name, x: e.clientX, y: e.clientY,
                    details: { 'Size': `${r.w.toFixed(1)}m × ${r.h.toFixed(1)}m`, 'Area': `${(r.w * r.h).toFixed(1)} m²` },
                  })}
                  onMouseLeave={() => setHoveredElement(null)}
                  onMouseMove={(e) => hoveredElement && setHoveredElement({ ...hoveredElement, x: e.clientX, y: e.clientY })}
                />
                <text
                  x={mx(r.x + r.w / 2)} y={my(r.y + r.h / 2)}
                  fill={isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)"} fontSize="10" textAnchor="middle" dominantBaseline="central"
                  className="pointer-events-none"
                >
                  {r.name}
                </text>
              </g>
            ))}

            {layers.walls && (
              <rect
                x={mx(buildable.x)} y={my(buildable.y + buildable.h)}
                width={buildable.w * SCALE} height={buildable.h * SCALE}
                fill="none" stroke={isDark ? "white" : "#1e293b"} strokeWidth="3"
              />
            )}

            {/* Footings (dashed squares under columns) */}
            {layers.footings && columns.map((c: ColumnPos) => {
              const footSize = 1.2; // 1.2m pad footing
              return (
                <rect
                  key={`f-${c.id}`}
                  x={mx(c.x - footSize / 2)} y={my(c.y + footSize / 2)}
                  width={footSize * SCALE} height={footSize * SCALE}
                  fill="rgba(74, 222, 128, 0.08)" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 3"
                  className="transition-all duration-150 hover:fill-green-400/25 cursor-pointer"
                  onMouseEnter={(e) => setHoveredElement({
                    id: c.id, type: 'Footing', x: e.clientX, y: e.clientY,
                    details: { 'Pad Size': '1.2m × 1.2m × 0.45m', 'Mesh': 'T12 @ 150 c/c' },
                  })}
                  onMouseLeave={() => setHoveredElement(null)}
                  onMouseMove={(e) => hoveredElement && setHoveredElement({ ...hoveredElement, x: e.clientX, y: e.clientY })}
                />
              );
            })}

            {/* Columns */}
            {layers.columns && columns.map((c: ColumnPos) => {
              const s = (c.size / 1000) * SCALE; // mm → m → px
              return (
                <rect
                  key={c.id}
                  x={mx(c.x) - s / 2} y={my(c.y) - s / 2}
                  width={s} height={s}
                  fill="#ef4444"
                  className="transition-all duration-150 hover:fill-red-400 cursor-pointer"
                  onMouseEnter={(e) => setHoveredElement({
                    id: c.id, type: 'Column', x: e.clientX, y: e.clientY,
                    details: { 'Size': `${c.size}×${c.size} mm`, 'Rebar': '8-16Ø', 'Ties': '8Ø @ 150 c/c' },
                  })}
                  onMouseLeave={() => setHoveredElement(null)}
                  onMouseMove={(e) => hoveredElement && setHoveredElement({ ...hoveredElement, x: e.clientX, y: e.clientY })}
                />
              );
            })}

            {/* Beams — connect columns horizontally at each unique Y */}
            {layers.beams && (() => {
              const ySet = new Set(columns.map(c => c.y));
              const xArr = [...new Set(columns.map(c => c.x))].sort((a, b) => a - b);
              const lines: React.ReactElement[] = [];
              ySet.forEach(yVal => {
                for (let i = 0; i < xArr.length - 1; i++) {
                  lines.push(
                    <line
                      key={`bm-${yVal}-${i}`}
                      x1={mx(xArr[i])} y1={my(yVal)}
                      x2={mx(xArr[i + 1])} y2={my(yVal)}
                      stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 3"
                    />
                  );
                }
              });
              return lines;
            })()}

            {/* Dimension annotations */}
            {layers.dims && (
              <g>
                {/* Plot width — top */}
                <DimLine
                  x1={mx(0)} y1={my(plotH) - 18}
                  x2={mx(plotW)} y2={my(plotH) - 18}
                  label={`${plotW.toFixed(1)} m`}
                />
                {/* Plot height — right */}
                <DimLine
                  x1={mx(plotW) + 18} y1={my(0)}
                  x2={mx(plotW) + 18} y2={my(plotH)}
                  label={`${plotH.toFixed(1)} m`}
                  vertical
                />
                {/* Front setback */}
                {plotSpec.setbacks?.front > 0 && (
                  <DimLine
                    x1={mx(plotW / 2)} y1={my(0)}
                    x2={mx(plotW / 2)} y2={my(plotSpec.setbacks.front)}
                    label={`${plotSpec.setbacks.front}m`}
                    vertical color="#facc15"
                  />
                )}
              </g>
            )}

            {/* Vastu 9×9 grid overlay (81-Pada) */}
            {layers.vastu && (
              <g opacity="0.55">
                <rect x={mx(0)} y={my(plotH)} width={plotW * SCALE} height={plotH * SCALE} fill="none" stroke="#a855f7" strokeWidth="2" />
                {/* 8 vertical + 8 horizontal dividers */}
                {Array.from({ length: 8 }, (_, i) => {
                  const f = (i + 1) / 9;
                  return (
                    <React.Fragment key={`vgrid-${i}`}>
                      <line x1={mx(plotW * f)} y1={my(0)} x2={mx(plotW * f)} y2={my(plotH)} stroke="#a855f7" strokeWidth="1" strokeDasharray="2 4" />
                      <line x1={mx(0)} y1={my(plotH * f)} x2={mx(plotW)} y2={my(plotH * f)} stroke="#a855f7" strokeWidth="1" strokeDasharray="2 4" />
                    </React.Fragment>
                  );
                })}
                {/* Highlight Brahmasthana (central 3x3) */}
                <rect 
                  x={mx(plotW * 3/9)} y={my(plotH * 6/9)} 
                  width={plotW * 3/9 * SCALE} height={plotH * 3/9 * SCALE} 
                  fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="1.5" 
                />
                <text
                  x={mx(plotW * 4.5/9)} y={my(plotH * 4.5/9)}
                  fill="#d8b4fe" fontSize="10" textAnchor="middle" dominantBaseline="central" fontWeight="bold"
                >
                  Brahmasthana
                </text>
                
                {/* 16-Zone labels (Simplified representation at boundaries) */}
                {[
                  ['N', 4.5/9, 8.5/9], ['NE', 8.5/9, 8.5/9], ['E', 8.5/9, 4.5/9], ['SE', 8.5/9, 0.5/9],
                  ['S', 4.5/9, 0.5/9], ['SW', 0.5/9, 0.5/9], ['W', 0.5/9, 4.5/9], ['NW', 0.5/9, 8.5/9]
                ].map(([text, fx, fy]) => (
                  <text
                    key={text as string}
                    x={mx(plotW * (fx as number))}
                    y={my(plotH * (fy as number))}
                    fill="#d8b4fe" fontSize="8" textAnchor="middle" dominantBaseline="central"
                  >
                    {text as string}
                  </text>
                ))}
              </g>
            )}

            {/* Fixtures overlay */}
            {layers.fixtures && fixtures?.map((f: any) => {
              const { width, length } = f.boundingBox;
              return (
                <g key={f.id} transform={`translate(${mx(f.position.x)}, ${my(f.position.y)}) rotate(${f.rotation})`}>
                  <rect
                    x={-width * SCALE / 2}
                    y={-length * SCALE / 2}
                    width={width * SCALE}
                    height={length * SCALE}
                    fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="1.5"
                  />
                  {f.clearanceEnvelope && (
                    <rect
                      x={-f.clearanceEnvelope.width * SCALE / 2}
                      y={-f.clearanceEnvelope.length * SCALE / 2}
                      width={f.clearanceEnvelope.width * SCALE}
                      height={f.clearanceEnvelope.length * SCALE}
                      fill="none" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"
                    />
                  )}
                  <text fill="#f97316" fontSize="8" textAnchor="middle" dominantBaseline="central" fontWeight="bold">
                    {f.type}
                  </text>
                </g>
              );
            })}

            {/* Direction indicator */}
            <g transform={`translate(${svgW - 30}, ${svgH - 30})`}>
              <circle cx="0" cy="0" r="14" fill={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} strokeWidth="1" />
              <text x="0" y="-3" fill={isDark ? "white" : "black"} fontSize="8" textAnchor="middle" dominantBaseline="central" fontWeight="bold">N</text>
              <line x1="0" y1="2" x2="0" y2="10" stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} strokeWidth="1" />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SVG Dimension-line helper component
// ---------------------------------------------------------------------------
function DimLine({ x1, y1, x2, y2, label, vertical, color = '#facc15' }: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; vertical?: boolean; color?: string;
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text
        x={midX + (vertical ? 10 : 0)}
        y={midY + (vertical ? 0 : -6)}
        fill={color} fontSize="10" textAnchor="middle" dominantBaseline="central"
        transform={vertical ? `rotate(-90, ${midX + 10}, ${midY})` : undefined}
      >
        {label}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Three.js 3D View  — data-driven from layout + plotSpec
// ---------------------------------------------------------------------------
function ThreeView({ layout, layers, floorCount, isDark }: {
  layout: ReturnType<typeof generateLayout>;
  layers: Record<string, boolean>;
  floorCount: number;
  isDark: boolean;
}) {
  const { plotW, plotH, buildable, rooms: layoutRooms, columns } = layout;
  const floorH = 3.0; // 3m per floor

  // Camera distance based on plot size
  const camDist = Math.max(plotW, plotH) * 2.5;

  return (
    <Canvas camera={{ position: [camDist * 0.6, camDist * 0.5, camDist * 0.8], fov: 50 }} className={`w-full h-full ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[plotW, floorH * floorCount * 2, plotH]} intensity={1} castShadow />
      <hemisphereLight args={['#b1e1ff', '#b97a20', 0.3]} />
      <OrbitControls makeDefault target={[plotW / 2, (floorH * floorCount) / 2, plotH / 2]} />

      {layers.grid && <Grid infiniteGrid fadeDistance={Math.max(plotW, plotH) * 4} sectionColor={isDark ? "#6b7280" : "#94a3b8"} cellColor={isDark ? "#374151" : "#cbd5e1"} />}

      {/* Ground plane */}
      <mesh position={[plotW / 2, -0.06, plotH / 2]} receiveShadow>
        <boxGeometry args={[plotW, 0.1, plotH]} />
        <meshStandardMaterial color={isDark ? "#1e293b" : "#e2e8f0"} />
      </mesh>

      {/* Plot boundary outline on ground */}
      <lineSegments position={[plotW / 2, -0.005, plotH / 2]}>
        <edgesGeometry args={[new BoxGeometry(plotW, 0.01, plotH)]} />
        <lineBasicMaterial color="#6b7280" />
      </lineSegments>

      {/* Room zones on ground floor (semi-transparent) */}
      {layoutRooms.map(r => (
        <mesh key={`room3d-${r.id}`} position={[r.x + r.w / 2, 0.01, r.y + r.h / 2]}>
          <boxGeometry args={[r.w, 0.01, r.h]} />
          <meshStandardMaterial color={r.color.includes('210') ? '#60a5fa' : r.color.includes('260') ? '#a78bfa' : r.color.includes('30,') ? '#fb923c' : r.color.includes('180') ? '#2dd4bf' : '#94a3b8'} opacity={0.4} transparent depthWrite={false} />
        </mesh>
      ))}

      {/* For each floor */}
      {Array.from({ length: floorCount }, (_, fi) => {
        const baseY = fi * floorH;
        return (
          <group key={`floor-${fi}`} position={[0, baseY, 0]}>
            {/* Floor slab */}
            <mesh position={[buildable.x + buildable.w / 2, 0, buildable.y + buildable.h / 2]}>
              <boxGeometry args={[buildable.w, 0.15, buildable.h]} />
              <meshStandardMaterial color="#94a3b8" opacity={0.3} transparent />
            </mesh>

            {/* Walls — outer envelope */}
            {layers.walls && (
              <group>
                {/* Front */}
                <mesh position={[buildable.x + buildable.w / 2, floorH / 2, buildable.y]}>
                  <boxGeometry args={[buildable.w, floorH, WALL_THICKNESS]} />
                  <meshStandardMaterial color="#e2e8f0" opacity={0.7} transparent />
                </mesh>
                {/* Rear */}
                <mesh position={[buildable.x + buildable.w / 2, floorH / 2, buildable.y + buildable.h]}>
                  <boxGeometry args={[buildable.w, floorH, WALL_THICKNESS]} />
                  <meshStandardMaterial color="#e2e8f0" opacity={0.7} transparent />
                </mesh>
                {/* Left */}
                <mesh position={[buildable.x, floorH / 2, buildable.y + buildable.h / 2]}>
                  <boxGeometry args={[WALL_THICKNESS, floorH, buildable.h]} />
                  <meshStandardMaterial color="#e2e8f0" opacity={0.7} transparent />
                </mesh>
                {/* Right */}
                <mesh position={[buildable.x + buildable.w, floorH / 2, buildable.y + buildable.h / 2]}>
                  <boxGeometry args={[WALL_THICKNESS, floorH, buildable.h]} />
                  <meshStandardMaterial color="#e2e8f0" opacity={0.7} transparent />
                </mesh>
              </group>
            )}

            {/* Columns */}
            {layers.columns && columns.map(c => {
              const s = c.size / 1000; // mm → m
              return (
                <mesh key={`col-${fi}-${c.id}`} position={[c.x, floorH / 2, c.y]}>
                  <boxGeometry args={[s, floorH, s]} />
                  <meshStandardMaterial color="#ef4444" />
                </mesh>
              );
            })}

            {/* Beams — connect columns at ceiling level */}
            {layers.beams && (() => {
              const ySet = [...new Set(columns.map(c => c.y))];
              const xArr = [...new Set(columns.map(c => c.x))].sort((a, b) => a - b);
              const meshes: React.ReactElement[] = [];
              ySet.forEach(yVal => {
                for (let i = 0; i < xArr.length - 1; i++) {
                  const span = xArr[i + 1] - xArr[i];
                  meshes.push(
                    <mesh key={`bm3-${fi}-${yVal}-${i}`} position={[(xArr[i] + xArr[i + 1]) / 2, floorH - 0.15, yVal]}>
                      <boxGeometry args={[span, 0.295, 0.235]} />
                      <meshStandardMaterial color="#60a5fa" />
                    </mesh>
                  );
                }
              });
              // Also connect along X (transverse beams)
              const xSet = [...new Set(columns.map(c => c.x))];
              const yArrSorted = [...new Set(columns.map(c => c.y))].sort((a, b) => a - b);
              xSet.forEach(xVal => {
                for (let i = 0; i < yArrSorted.length - 1; i++) {
                  const span = yArrSorted[i + 1] - yArrSorted[i];
                  meshes.push(
                    <mesh key={`bmt3-${fi}-${xVal}-${i}`} position={[xVal, floorH - 0.145, (yArrSorted[i] + yArrSorted[i + 1]) / 2]}>
                      <boxGeometry args={[0.225, 0.285, span]} />
                      <meshStandardMaterial color="#60a5fa" />
                    </mesh>
                  );
                }
              });
              return meshes;
            })()}

            {/* Fixtures */}
            {layers.fixtures && layout.fixtures?.map(f => {
              const { width, length, height } = f.boundingBox;
              return (
                <mesh key={`f3-${fi}-${f.id}`} position={[f.position.x, height / 2, f.position.y]} rotation={[0, -f.rotation * Math.PI / 180, 0]}>
                  <boxGeometry args={[width, height, length]} />
                  <meshStandardMaterial color="#f97316" />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Footings — below ground level */}
      {layers.footings && columns.map(c => {
        const footSize = 1.2;
        const footDepth = 0.45;
        return (
          <mesh key={`ft-${c.id}`} position={[c.x, -footDepth / 2 - 0.011, c.y]}>
            <boxGeometry args={[footSize, footDepth, footSize]} />
            <meshStandardMaterial color="#4ade80" opacity={0.6} transparent depthWrite={false} />
          </mesh>
        );
      })}

      {/* Roof slab */}
      <mesh position={[buildable.x + buildable.w / 2, floorCount * floorH + 0.075, buildable.y + buildable.h / 2]}>
        <boxGeometry args={[buildable.w + 0.3, 0.15, buildable.h + 0.3]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </Canvas>
  );
}
