'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box } from '@react-three/drei';
import { useAppStore } from '../store/useStore';
import { generateLayout } from '@/utils/generateLayout';

export default function IFCViewport() {
  const { plotSpec, reqSpec, selectedElementId } = useAppStore();

  const layout = useMemo(() => generateLayout(plotSpec, reqSpec), [plotSpec, reqSpec]);
  const { plotW, plotH, buildable, rooms, columns, fixtures } = layout;

  const floorCount = (() => {
    const fc = plotSpec.floorCount || 'G';
    if (fc === 'G') return 1;
    const match = fc.match(/G\+(\d+)/i);
    return match ? 1 + parseInt(match[1], 10) : 1;
  })();
  const floorH = 3.0;

  return (
    <div className="relative w-full h-full bg-neutral-100 dark:bg-neutral-900">
      <Canvas camera={{ position: [plotW * 1.5, floorH * floorCount * 1.5, plotH * 1.5], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[plotW, floorH * floorCount * 2, plotH]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        
        <Grid 
          position={[plotW / 2, 0, plotH / 2]} 
          infiniteGrid 
          fadeDistance={Math.max(plotW, plotH) * 2}
          sectionColor={'#a0a0a0'}
          cellColor={'#e0e0e0'}
        />

        <group>
          {/* Ground Plane */}
          <mesh position={[plotW / 2, -0.05, plotH / 2]} receiveShadow>
            <boxGeometry args={[plotW, 0.1, plotH]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>

          {/* Floors */}
          {Array.from({ length: floorCount }, (_, fi) => {
            const baseY = fi * floorH;
            return (
              <group key={`floor-${fi}`} position={[0, baseY, 0]}>
                {/* Floor slab */}
                <mesh position={[buildable.x + buildable.w / 2, 0.075, buildable.y + buildable.h / 2]} castShadow receiveShadow>
                  <boxGeometry args={[buildable.w, 0.15, buildable.h]} />
                  <meshStandardMaterial color="#94a3b8" />
                </mesh>

                {/* Columns */}
                {columns.map(c => {
                  const s = c.size / 1000;
                  const isSelected = selectedElementId === c.id;
                  return (
                    <Box key={`col-${fi}-${c.id}`} position={[c.x, floorH / 2, c.y]} args={[s, floorH, s]} castShadow>
                      <meshStandardMaterial color={isSelected ? '#a855f7' : '#ef4444'} />
                    </Box>
                  );
                })}

                {/* Fixtures (only on GF for now) */}
                {fi === 0 && fixtures?.map(f => {
                  const { width, length, height } = f.boundingBox;
                  return (
                    <Box key={`fix-${f.id}`} position={[f.position.x, height / 2, f.position.y]} args={[width, height, length]} castShadow rotation={[0, -f.rotation * Math.PI / 180, 0]}>
                      <meshStandardMaterial color="#f97316" />
                    </Box>
                  );
                })}
              </group>
            );
          })}

          {/* Footings */}
          {columns.map(c => {
            const footSize = 1.2;
            const footDepth = 0.45;
            return (
              <Box key={`ft-${c.id}`} position={[c.x, -footDepth / 2 - 0.1, c.y]} args={[footSize, footDepth, footSize]} receiveShadow>
                <meshStandardMaterial color="#4ade80" />
              </Box>
            );
          })}
        </group>

        <OrbitControls makeDefault target={[plotW / 2, (floorH * floorCount) / 2, plotH / 2]} />
      </Canvas>

      {/* Info badge */}
      <div className="absolute top-4 left-4 z-10 backdrop-blur-md bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white px-3 py-2 rounded-xl shadow-xl">
        <div className="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-wider">Mode</div>
        <div className="text-sm font-bold flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          Procedural IFC Preview
        </div>
      </div>
    </div>
  );
}
