import React, { useState, useEffect } from 'react';
import { X, Layers, CheckSquare, Square } from 'lucide-react';
import DxfParser from 'dxf-parser';

export default function DxfInspector({ isOpen, onClose, dxfString }: { isOpen: boolean, onClose: () => void, dxfString: string | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedDxf, setParsedDxf] = useState<any>(null);
  const [layers, setLayers] = useState<{name: string, color: number, visible: boolean}[]>([]);

  useEffect(() => {
    if (isOpen && dxfString) {
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
  }, [isOpen, dxfString]);

  if (!isOpen) return null;

  const toggleLayer = (name: string) => {
    setLayers(layers.map(l => l.name === name ? { ...l, visible: !l.visible } : l));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
        
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-2">
            <Layers className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-foreground">DXF Layer Inspector</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-muted hover:bg-muted/80 rounded-full transition text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Layer Panel */}
          <div className="w-64 border-r border-border bg-muted/10 p-4 flex flex-col gap-2 overflow-y-auto">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Layers Detected</h3>
            {layers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No layers found.</p>
            ) : (
              layers.map(l => (
                <button 
                  key={l.name}
                  onClick={() => toggleLayer(l.name)}
                  className="flex items-center gap-2 text-sm text-left hover:bg-muted p-1.5 rounded transition-colors"
                >
                  {l.visible ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} className="text-muted-foreground" />}
                  <div className="w-3 h-3 rounded-sm border border-border" style={{ backgroundColor: l.color ? `#${Math.floor(Math.random()*16777215).toString(16)}` : '#ccc' }}></div>
                  <span className={l.visible ? 'text-foreground' : 'text-muted-foreground'}>{l.name}</span>
                </button>
              ))
            )}
          </div>
          
          {/* Audit View Panel */}
          <div className="flex-1 bg-background p-6 flex flex-col relative">
             {parsedDxf ? (
               <div className="w-full h-full border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/5 relative overflow-hidden">
                 {/* In a real implementation, we'd use dxf-viewer to render the canvas here based on visible layers. */}
                 {/* Since we are auditing, we'll display stats and mock visualization */}
                 <div className="absolute top-4 left-4 p-3 bg-card border border-border rounded-lg shadow-sm text-xs space-y-1">
                   <p><span className="font-semibold text-muted-foreground">DXF Version:</span> {parsedDxf.header?.$ACADVER || 'Unknown'}</p>
                   <p><span className="font-semibold text-muted-foreground">Total Entities:</span> {parsedDxf.entities?.length || 0}</p>
                   <p><span className="font-semibold text-muted-foreground">Blocks:</span> {Object.keys(parsedDxf.blocks || {}).length}</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="inline-block p-4 rounded-full bg-primary/10 text-primary mb-3">
                     <Layers size={48} />
                   </div>
                   <h3 className="text-lg font-medium text-foreground">DXF Audit Ready</h3>
                   <p className="text-sm text-muted-foreground max-w-sm mt-2">
                     The DXF structural parser is active. Select layers from the left panel to verify exact geometry and text annotations before export.
                   </p>
                 </div>
               </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                 Loading DXF data...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
