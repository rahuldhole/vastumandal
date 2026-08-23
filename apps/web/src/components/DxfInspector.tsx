import React, { useState, useEffect, useMemo } from 'react';
import { X, Layers, CheckSquare, Square } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { exportVastumandalDXF } from '@vastumandal/dxf-exporter';
import { generateLayout } from '@/utils/generateLayout';
import DxfParser from 'dxf-parser';
import DXFPreview from './DXFPreview';
export default function DxfInspector() {
  const { plotSpec, reqSpec } = useAppStore();
  const dxfString = useMemo(() => {
    try {
      const layout = generateLayout(plotSpec, reqSpec);
      return exportVastumandalDXF({
        layout: layout,
        req: reqSpec,
        isPreview: true
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [plotSpec, reqSpec]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedDxf, setParsedDxf] = useState<any>(null);
  const [layers, setLayers] = useState<{name: string, color: number, visible: boolean}[]>([]);

  useEffect(() => {
    if (dxfString) {
      try {
        const parser = new DxfParser();
        const dxf = parser.parseSync(dxfString);
        setParsedDxf(dxf);
        
        if (dxf && dxf.tables && dxf.tables.layer && dxf.tables.layer.layers) {
          const layerList = Object.keys(dxf.tables.layer.layers).map(name => {
            const l = dxf.tables.layer.layers[name];
            return {
              name: l.name,
              color: l.color,
              visible: true
            };
          });
          setLayers(layerList);
        }
      } catch (err) {
        console.error("Failed to parse DXF:", err);
      }
    }
  }, [dxfString]);

  const toggleLayer = (name: string) => {
    setLayers(layers.map(l => l.name === name ? { ...l, visible: !l.visible } : l));
  };

  const [isLayersOpen, setIsLayersOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-hidden text-sm relative">
        <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-2">
            <Layers className="text-primary" size={18} />
            <h2 className="font-bold text-foreground">DXF Layer Inspector (Audit Mode)</h2>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden h-full relative">
          {/* Audit View Panel */}
          <div className="flex-1 bg-background flex flex-col relative overflow-hidden">
             {dxfString ? (
               <div className="w-full h-full bg-muted/5 relative overflow-hidden">
                 <DXFPreview 
                   dxfString={dxfString} 
                   toolbarActions={
                     <div className="relative">
                       <button 
                         onClick={() => setIsLayersOpen(!isLayersOpen)}
                         className={`p-1.5 rounded transition-colors ${isLayersOpen ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                         title="Toggle Layers"
                       >
                         <Layers className="w-4 h-4" />
                       </button>

                       {isLayersOpen && (
                         <div className="absolute top-full right-0 mt-2 bg-popover text-popover-foreground border border-border p-3 rounded-lg shadow-xl flex flex-col gap-2 w-48 max-h-64 overflow-y-auto z-50">
                           <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Layers Detected</h4>
                           {layers.length === 0 ? (
                             <p className="text-xs text-muted-foreground">No layers found.</p>
                           ) : (
                             layers.map(l => (
                               <label key={l.name} onClick={() => toggleLayer(l.name)} className="flex items-center gap-3 cursor-pointer group">
                                 <div className={`relative w-8 h-4 rounded-full transition-colors ${l.visible ? 'bg-primary' : 'bg-muted'}`}>
                                   <div className={`absolute top-0.5 left-0.5 bg-background w-3 h-3 rounded-full transition-transform ${l.visible ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                 </div>
                                 <div className="flex items-center gap-2 flex-1">
                                   <span className="text-sm truncate group-hover:text-foreground transition-colors text-muted-foreground">{l.name}</span>
                                 </div>
                               </label>
                             ))
                           )}
                         </div>
                       )}
                     </div>
                   }
                 />
               </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                 Loading DXF data...
               </div>
             )}
          </div>
        </div>
    </div>
  );
}
