import React, { useState } from 'react';
import { FileCode, Box, FileText, X, Archive, Copy, Check, Eye } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { exportVastumandalDXF, exportVastumandalScript } from '@vastumandal/dxf-exporter';
import { exportVastumandalIFC } from '@vastumandal/ifc-exporter';
import { IFCPreview } from './IFCPreview';
import DxfInspector from './DxfInspector';

export default function ExportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showIfcPreview, setShowIfcPreview] = useState(false);
  const [showDxfInspector, setShowDxfInspector] = useState(false);
  const [previewData, setPreviewData] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const getExportData = (format: string) => {
    const state = useAppStore.getState();
    const projectName = state.templateData?.projectName || 'Vastumandal';
    const layout = state.geometryResult;
    
    if (format === 'vastu') {
      const exportData = {
        schemaVersion: "1.0.0",
        project: {
          name: projectName,
          client: state.templateData?.clientName || '',
          date: state.templateData?.date || ''
        },
        spec: {
          plot: state.plotSpec,
          requirements: state.reqSpec
        },
        boq: state.boqResult,
        geometry: layout,
        metadata: {
          generatedBy: "Vastumandal Engine",
          isCalculating: false
        }
      };
      return JSON.stringify(exportData, null, 2);
    } else if (format === 'dxf') {
      return exportVastumandalDXF({
        layout: layout,
        req: state.reqSpec,
        isPreview: false
      });
    } else if (format === 'lsp') {
      return exportVastumandalScript({
        layout: layout,
        req: state.reqSpec
      });
    } else if (format === 'ifc') {
      return exportVastumandalIFC({});
    }
    return '';
  };

  const getMimeType = (format: string) => {
    if (format === 'vastu' || format === 'json') return 'application/json';
    if (format === 'pdf') return 'application/pdf';
    return 'text/plain';
  };

  const downloadFile = async (format: string) => {
    if (format === 'zip') {
      alert('Downloading ZIP not fully implemented yet...');
      return;
    }

    const state = useAppStore.getState();
    const projectName = state.templateData?.projectName || 'Vastumandal';
    
    if (format === 'pdf') {
      const { exportToPdf } = await import('@vastumandal/pdf-exporter');
      const blob = await exportToPdf({
        floorPlan: state.geometryResult,
        columns: [],
        boq: state.boqResult,
        printSetup: state.printSetup,
        projectMetadata: state.projectMetadata
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\\s+/g, '_')}_Drawings.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    
    const content = getExportData(format);
    if (!content) return;
    
    const blob = new Blob([content], { type: getMimeType(format) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\\s+/g, '_')}_Project.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (e: React.MouseEvent, format: string) => {
    e.stopPropagation(); // prevent triggering the download
    const content = getExportData(format);
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(format);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  const handlePreview = (e: React.MouseEvent, format: string) => {
    e.stopPropagation();
    if (format === 'ifc') {
      const content = getExportData(format);
      if (content) {
        setPreviewData(content);
        setShowIfcPreview(true);
      }
    } else if (format === 'dxf') {
      const content = getExportData(format);
      if (content) {
        setPreviewData(content);
        setShowDxfInspector(true);
      }
    }
  };

  const formats = [
    { id: 'pdf', title: 'PDF Sheet Set (.pdf)', desc: 'Direct-to-print vector architectural plans and structural schedules.', icon: FileText, color: 'text-red-500', canCopy: false },
    { id: 'dxf', title: 'AutoCAD Drawing (.dxf)', desc: 'Layer-separated CAD file with dimensions, grids, and isolated footing outlines.', icon: FileCode, color: 'text-blue-500', canCopy: true, canPreview: true },
    { id: 'ifc', title: 'BIM Model (.ifc)', desc: 'Standard IFC STEP model with IfcWall, IfcColumn, IfcSlab, and IfcFooting.', icon: Box, color: 'text-purple-500', canCopy: true, canPreview: true },
    { id: 'lsp', title: 'AutoLISP Script (.lsp)', desc: 'Direct command-line automation script for AutoCAD.', icon: FileText, color: 'text-amber-500', canCopy: true },
    { id: 'vastu', title: 'Vastumandal Project (.vastu)', desc: 'Native project format containing all specifications and parameters.', icon: FileCode, color: 'text-emerald-500', canCopy: false },
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
              <div key={fmt.id} className="relative group">
                <button 
                  onClick={() => downloadFile(fmt.id)}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-left w-full h-full"
                >
                  <div className={`p-3 rounded-lg bg-muted group-hover:bg-background transition-colors ${fmt.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="pr-10">
                    <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{fmt.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{fmt.desc}</p>
                  </div>
                </button>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  {'canPreview' in fmt && fmt.canPreview && (
                    <button 
                      onClick={(e) => handlePreview(e, fmt.id)}
                      className="p-2 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors flex flex-col items-center justify-center"
                      title={`Preview ${fmt.id.toUpperCase()}`}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {fmt.canCopy && (
                    <button 
                      onClick={(e) => copyToClipboard(e, fmt.id)}
                      className="p-2 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors flex flex-col items-center justify-center"
                      title={`Copy ${fmt.id.toUpperCase()} to clipboard`}
                    >
                      {copiedId === fmt.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>
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

      <IFCPreview 
        isOpen={showIfcPreview}
        onClose={() => setShowIfcPreview(false)}
        ifcData={previewData}
      />
      
      <DxfInspector
        isOpen={showDxfInspector}
        onClose={() => setShowDxfInspector(false)}
        dxfString={previewData}
      />
    </div>
  );
}
