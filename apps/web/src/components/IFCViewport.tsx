'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Grid } from '@react-three/drei';
import { useAppStore } from '../store/useStore';

export default function IFCViewport() {
  const boqResult = useAppStore(state => state.boqResult);
  const geometryResult = useAppStore(state => state.geometryResult);
  const result = boqResult || geometryResult;
  const selectedElementId = useAppStore(state => state.selectedElementId);

  // Parse the geometryBuffer from the worker result
  const geometries = useMemo(() => {
    if (!result || !result.geometryBuffer) return [];
    
    const buffer = new Float32Array(result.geometryBuffer);
    const numElements = buffer.length / 7;
    const items = [];
    
    for (let i = 0; i < numElements; i++) {
      const offset = i * 7;
      const x = buffer[offset];
      const y = buffer[offset + 1];
      const z = buffer[offset + 2];
      const sx = buffer[offset + 3];
      const sy = buffer[offset + 4];
      const sz = buffer[offset + 5];
      const typeId = buffer[offset + 6];
      
      const id = `${typeId === 1 ? 'F' : typeId === 2 ? 'C' : 'S'}${i}`;
      
      items.push({
        id,
        position: [x / 1000, y / 1000, z / 1000] as [number, number, number],
        args: [sx / 1000, sy / 1000, sz / 1000] as [number, number, number],
        typeId
      });
    }
    return items;
  }, [result]);

  return (
    <div className="relative w-full h-full bg-neutral-100 dark:bg-neutral-900">
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        
        <Grid 
          position={[0, 0, 0]} 
          infiniteGrid 
          fadeDistance={50}
          sectionColor={'#a0a0a0'}
          cellColor={'#e0e0e0'}
        />

        <group position={[-5, 0, -5]}>
          {geometries.map((geom) => {
            let color = '#ccc'; // default
            if (geom.typeId === 1) color = '#8B8C89'; // Footing
            else if (geom.typeId === 2) color = '#A8A9A5'; // Column
            else if (geom.typeId === 3) color = '#D3D4D0'; // Slab
            
            const isSelected = selectedElementId === geom.id;
            if (isSelected) color = '#a855f7'; // Purple highlight
            
            return (
              <Box 
                key={geom.id} 
                position={geom.position} 
                args={geom.args}
                castShadow 
                receiveShadow
              >
                <meshStandardMaterial 
                  color={color} 
                  transparent={geom.typeId === 3} 
                  opacity={geom.typeId === 3 ? 0.8 : 1}
                  roughness={0.7}
                />
              </Box>
            );
          })}
        </group>

        <OrbitControls makeDefault />
      </Canvas>

      {/* Info badge */}
      <div className="absolute top-4 left-4 z-10 backdrop-blur-md bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white px-3 py-2 rounded-xl shadow-xl">
        <div className="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-wider">Mode</div>
        <div className="text-sm font-bold flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          3D Preview
        </div>
      </div>
    </div>
  );
}
