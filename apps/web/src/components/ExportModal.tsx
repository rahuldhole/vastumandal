import React from 'react';
import { FileCode, Box, FileText, X, Archive } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function ExportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const downloadFile = (format: string) => {
    if (format === 'vastu') {
      const state = useAppStore.getState();
      const exportData = {
        schemaVersion: "1.0.0",
        meta: {
          projectName: state.templateData?.projectName || 'Vastumandal',
          createdAt: new Date().toISOString(),
        },
        state: {
          ...state,
          boqResult: null,
          geometryResult: null,
          isCalculating: false
        }
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(state.templateData?.projectName || 'Vastumandal').replace(/\s+/g, '_')}_Project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    alert(`Downloading model in ${format.toUpperCase()} format...`);
  };

  const formats = [
    { id: 'dxf', title: 'AutoCAD Drawing (.dxf)', desc: 'Layer-separated CAD file with dimensions, grids, and isolated footing outlines.', icon: FileCode, color: 'text-blue-500' },
    { id: 'ifc', title: 'BIM Model (.ifc)', desc: 'Standard IFC STEP model with IfcWall, IfcColumn, IfcSlab, and IfcFooting.', icon: Box, color: 'text-purple-500' },
    { id: 'lsp', title: 'AutoLISP Script (.lsp)', desc: 'Direct command-line automation script for AutoCAD.', icon: FileText, color: 'text-amber-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-xl font-bold text-foreground">Export Project</h2>
            <p className="text-sm text-muted-foreground mt-1">Select standard interoperability format for downstream processing</p>
          </div>
          <button onClick={onClose} className="p-2 bg-muted hover:bg-muted/80 rounded-full transition text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        
        {/* Format Cards */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background">
          {formats.map(fmt => {
            const Icon = fmt.icon;
            return (
              <button 
                key={fmt.id} 
                onClick={() => downloadFile(fmt.id)}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-left group"
              >
                <div className={`p-3 rounded-lg bg-muted group-hover:bg-background transition-colors ${fmt.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{fmt.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{fmt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer Action */}
        <div className="p-5 border-t border-border bg-muted/30 flex flex-col sm:flex-row gap-3 justify-end items-center">
          <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition">
            Cancel
          </button>
          <button 
            onClick={() => downloadFile('zip')} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-lg shadow-md transition-all active:scale-95"
          >
            <Archive size={18} />
            Download All (.zip)
          </button>
        </div>

      </div>
    </div>
  );
}
