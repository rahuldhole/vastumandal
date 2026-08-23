import React, { useState, useRef, MouseEvent, WheelEvent } from 'react';
import { Plus, Minus, Maximize, Compass, Info } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useAppStore } from '@/store/useStore';

export default function CADViewport() {
  const { activeTab } = useAppStore();
  const [layers, setLayers] = useState({
    vastu: false,
    grid: true,
    walls: true,
    columns: true,
    footings: true,
    dims: true,
    beams: true,
  });

  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<{ id: string, type: string, x: number, y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setTransform(prev => ({ ...prev, scale: Math.max(0.1, Math.min(prev.scale + delta, 10)) }));
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 1 || e.button === 0) { // Middle or left click to pan
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
  const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 10) }));
  const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(0.1, prev.scale - 0.2) }));

  const layerColors = { vastu: 'bg-purple-500', grid: 'bg-gray-500', walls: 'bg-white', columns: 'bg-red-500', footings: 'bg-green-400', dims: 'bg-yellow-400', beams: 'bg-blue-400' };

  return (
    <div 
      className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col font-sans select-none"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Floating Layer Visibility Dock (Glassmorphism) */}
      <div className="absolute top-4 right-4 z-10 backdrop-blur-md bg-white/10 border border-white/20 text-white p-3 rounded-2xl shadow-xl flex flex-col gap-2 w-40">
        <h4 className="font-semibold text-xs text-white/70 uppercase tracking-wider mb-1">Layers</h4>
        {Object.keys(layers).map(layer => (
          <label key={layer} onClick={() => toggleLayer(layer as keyof typeof layers)} className="flex items-center gap-3 cursor-pointer group">
            <div className={`relative w-8 h-4 rounded-full transition-colors ${layers[layer as keyof typeof layers] ? 'bg-primary' : 'bg-white/20'}`}>
              <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${layers[layer as keyof typeof layers] ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className={`w-2 h-2 rounded-full ${layerColors[layer as keyof typeof layerColors]}`}></span>
              <span className="text-sm capitalize group-hover:text-white transition-colors text-white/80">{layer}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Navigation HUD */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-1 shadow-xl">
        <button onClick={zoomIn} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition" title="Zoom In (+)"><Plus size={20} /></button>
        <button onClick={zoomOut} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition" title="Zoom Out (-)"><Minus size={20} /></button>
        <div className="w-full h-px bg-white/20 my-1"></div>
        <button onClick={resetView} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition" title="Zoom Extents (Z+E)"><Maximize size={20} /></button>
        <button onClick={resetView} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition" title="Reset North"><Compass size={20} /></button>
      </div>

      {/* Tooltip */}
      {hoveredElement && (
        <div 
          className="absolute z-20 backdrop-blur-md bg-slate-900/90 border border-slate-700 text-white p-3 rounded-lg shadow-2xl pointer-events-none"
          style={{ left: hoveredElement.x + 15, top: hoveredElement.y + 15 }}
        >
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
            <Info size={16} className="text-blue-400" />
            <strong className="text-sm">{hoveredElement.id}</strong>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded uppercase">{hoveredElement.type}</span>
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            {hoveredElement.type === 'Column' && (
              <>
                <p>Load (Pu): <span className="text-white font-mono">1250 kN</span></p>
                <p>Size: <span className="text-white font-mono">400x400 mm</span></p>
                <p>Main Rebar: <span className="text-white font-mono">8-20Ø</span></p>
              </>
            )}
            {hoveredElement.type === 'Footing' && (
              <>
                <p>SBC Used: <span className="text-white font-mono">200 kN/m²</span></p>
                <p>Size: <span className="text-white font-mono">2m x 2m x 0.45m</span></p>
                <p>Bottom Mesh: <span className="text-white font-mono">T12 @ 150 c/c</span></p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Canvas / 3D Viewport */}
      <div className="flex-1 w-full h-full relative">
        {activeTab === '3D' ? (
          <Canvas camera={{ position: [200, 200, 400], fov: 60 }} className="w-full h-full bg-slate-900">
            <ambientLight intensity={0.6} />
            <directionalLight position={[100, 200, 100]} intensity={1} castShadow />
            <OrbitControls makeDefault />
            
            {layers.grid && <Grid infiniteGrid fadeDistance={1000} sectionColor="#6b7280" cellColor="#374151" />}
            
            {/* Base coordinate system translation to match SVG roughly (centered around 200,200) */}
            <group position={[-200, 0, -200]}>
              {layers.footings && (
                <mesh position={[50, -10, 50]}>
                  <boxGeometry args={[50, 20, 50]} />
                  <meshStandardMaterial color="#4ade80" opacity={0.6} transparent />
                </mesh>
              )}
              {layers.columns && (
                <mesh position={[50, 60, 50]}>
                  <boxGeometry args={[20, 120, 20]} />
                  <meshStandardMaterial color="#ef4444" />
                </mesh>
              )}
              {layers.walls && (
                <group>
                  {/* Outer hollow box mocked by 4 walls */}
                  <mesh position={[200, 60, 50]}><boxGeometry args={[300, 120, 4]} /><meshStandardMaterial color="white" /></mesh>
                  <mesh position={[200, 60, 350]}><boxGeometry args={[300, 120, 4]} /><meshStandardMaterial color="white" /></mesh>
                  <mesh position={[50, 60, 200]}><boxGeometry args={[4, 120, 300]} /><meshStandardMaterial color="white" /></mesh>
                  <mesh position={[350, 60, 200]}><boxGeometry args={[4, 120, 300]} /><meshStandardMaterial color="white" /></mesh>
                </group>
              )}
              {layers.beams && (
                <mesh position={[200, 120, 50]}>
                  <boxGeometry args={[300, 10, 10]} />
                  <meshStandardMaterial color="#60a5fa" />
                </mesh>
              )}
            </group>
          </Canvas>
        ) : (
          <svg 
            width="100%" height="100%" 
            style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
          >
            {layers.grid && (
              <path d="M0 50 L 400 50 M50 0 L 50 400" stroke="gray" strokeWidth="1" strokeDasharray="10 5" />
            )}
            {layers.footings && (
              <rect 
                x="25" y="25" width="50" height="50" 
                fill="rgba(74, 222, 128, 0.1)" stroke="#4ade80" strokeDasharray="4" strokeWidth="2" 
                className="transition-all duration-200 hover:fill-green-400/30 hover:stroke-green-300 cursor-pointer"
                onMouseEnter={(e) => setHoveredElement({ id: 'F1', type: 'Footing', x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHoveredElement(null)}
                onMouseMove={(e) => hoveredElement && setHoveredElement({ ...hoveredElement, x: e.clientX, y: e.clientY })}
              />
            )}
            {layers.columns && (
              <rect 
                x="40" y="40" width="20" height="20" 
                fill="#ef4444" 
                className="transition-all duration-200 hover:fill-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] cursor-pointer"
                onMouseEnter={(e) => setHoveredElement({ id: 'C1', type: 'Column', x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHoveredElement(null)}
                onMouseMove={(e) => hoveredElement && setHoveredElement({ ...hoveredElement, x: e.clientX, y: e.clientY })}
              />
            )}
            {layers.walls && (
              <path d="M50 50 L 350 50 L 350 350 L 50 350 Z" fill="none" stroke="white" strokeWidth="4" />
            )}
            {layers.dims && (
              <text x="200" y="30" fill="#facc15" fontSize="12" textAnchor="middle">3000 mm</text>
            )}
            {layers.beams && (
              <path d="M50 50 L 350 50" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
            )}
            {layers.vastu && (
              <g opacity="0.6">
                {/* Vastu 3x3 Grid Overlay over 300x300 plot */}
                <rect x="50" y="50" width="300" height="300" fill="none" stroke="#a855f7" strokeWidth="2" />
                <path d="M150 50 L 150 350 M250 50 L 250 350 M50 150 L 350 150 M50 250 L 350 250" stroke="#a855f7" strokeWidth="1" strokeDasharray="5 5" />
                <text x="100" y="100" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">Vayu (NW)</text>
                <text x="200" y="100" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">North</text>
                <text x="300" y="100" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">Ishan (NE)</text>
                
                <text x="100" y="200" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">West</text>
                <text x="200" y="200" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle" fontWeight="bold">Brahmasthan</text>
                <text x="300" y="200" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">East</text>
                
                <text x="100" y="300" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">Nairutya (SW)</text>
                <text x="200" y="300" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">South</text>
                <text x="300" y="300" fill="#d8b4fe" fontSize="12" textAnchor="middle" alignmentBaseline="middle">Agni (SE)</text>
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
