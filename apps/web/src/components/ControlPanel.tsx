import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Settings2, Compass, Printer, Map, Building, DraftingCompass } from 'lucide-react';
import { useAppStore } from '@/store/useStore';

type SectionType = 'SITE' | 'ARCH' | 'STRUCT' | 'PRINT' | null;

const AccordionHeader = ({ title, section, openSection, setOpenSection, icon: Icon }: { title: string, section: NonNullable<SectionType>, openSection: SectionType, setOpenSection: React.Dispatch<React.SetStateAction<SectionType>>, icon: React.ElementType<{ size?: number; className?: string }> }) => (
  <button 
    onClick={() => setOpenSection(openSection === section ? null : section)}
    className="flex items-center justify-between w-full p-3 font-semibold text-sm bg-muted/50 hover:bg-muted transition-colors border-b border-border text-foreground"
  >
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-primary" />
      {title}
    </div>
    {openSection === section ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>
);

export default function ControlPanel() {
  const { 
    plotSpec, setPlotSpec, 
    architecturalOverrides, setArchitecturalOverrides,
    structuralOverrides, setStructuralOverrides,
    printSetup, setPrintSetup,
    projectMetadata, setProjectMetadata
  } = useAppStore();

  const [openSection, setOpenSection] = useState<SectionType>('SITE');

  // Helpers
  const triggerUpdate = () => { /* legacy mock update */ };

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg text-foreground">Workbench Controls</h2>
      </div>

      <div className="flex-1 overflow-auto">
        
        {/* SECTION 1: Site, Setbacks & Bylaws */}
        <div>
          <AccordionHeader title="Site, Setbacks & Bylaws" section="SITE" icon={Map} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'SITE' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Front Setback</label>
                  <div className="relative">
                    <input type="number" value={plotSpec.setbacks?.front || 0} onChange={e => setPlotSpec({ setbacks: { ...plotSpec.setbacks!, front: Number(e.target.value) } })} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">m</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Rear Setback</label>
                  <div className="relative">
                    <input type="number" value={plotSpec.setbacks?.rear || 0} onChange={e => setPlotSpec({ setbacks: { ...plotSpec.setbacks!, rear: Number(e.target.value) } })} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">m</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Left Setback</label>
                  <div className="relative">
                    <input type="number" value={plotSpec.setbacks?.left || 0} onChange={e => setPlotSpec({ setbacks: { ...plotSpec.setbacks!, left: Number(e.target.value) } })} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">m</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Right Setback</label>
                  <div className="relative">
                    <input type="number" value={plotSpec.setbacks?.right || 0} onChange={e => setPlotSpec({ setbacks: { ...plotSpec.setbacks!, right: Number(e.target.value) } })} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">m</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                 <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Road Width</label>
                  <div className="relative">
                    <input type="number" value={plotSpec.roadWidth || 0} onChange={e => setPlotSpec({ roadWidth: Number(e.target.value) })} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">m</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Ground Coverage</label>
                  <div className="relative">
                    <input type="number" value={50} readOnly className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Architectural & Spatial Overrides */}
        <div>
          <AccordionHeader title="Architectural & Spatial Overrides" section="ARCH" icon={Building} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'ARCH' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Ext. Wall Thickness</label>
                  <select value={architecturalOverrides.exteriorWallThickness} onChange={e => setArchitecturalOverrides({ exteriorWallThickness: Number(e.target.value) })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option value={230}>230 mm</option>
                    <option value={150}>150 mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Partition Wall</label>
                  <select value={architecturalOverrides.partitionWallThickness} onChange={e => setArchitecturalOverrides({ partitionWallThickness: Number(e.target.value) })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option value={115}>115 mm</option>
                    <option value={100}>100 mm</option>
                  </select>
                </div>
              </div>
              <div>
                 <label className="block text-xs font-medium mb-1 text-muted-foreground">Vastu Strictness</label>
                 <select value={architecturalOverrides.vastuStrictness} onChange={e => setArchitecturalOverrides({ vastuStrictness: e.target.value as any })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>Strict</option>
                    <option>Moderate</option>
                    <option>Relaxed</option>
                 </select>
              </div>
              <button className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded text-xs font-medium transition">
                Room Dimensional Tuning...
              </button>
            </div>
          )}
        </div>

        {/* SECTION 3: Structural Detailing & Member Overrides */}
        <div>
          <AccordionHeader title="Structural Detailing" section="STRUCT" icon={DraftingCompass} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'STRUCT' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div className="grid grid-cols-2 gap-3">
                 <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Column Size</label>
                  <select value={structuralOverrides.columnSize} onChange={e => setStructuralOverrides({ columnSize: e.target.value })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>230x230</option>
                    <option>230x380</option>
                    <option>230x450</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Rebar Config</label>
                  <select value={structuralOverrides.columnRebar} onChange={e => setStructuralOverrides({ columnRebar: e.target.value })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>4-#16 + 2-#12</option>
                    <option>4-#16 + 4-#12</option>
                    <option>8-#16</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Concrete Grade</label>
                  <select value={structuralOverrides.concreteGrade} onChange={e => setStructuralOverrides({ concreteGrade: e.target.value })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>M20</option>
                    <option>M25</option>
                    <option>M30</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Steel Grade</label>
                  <select value={structuralOverrides.steelGrade} onChange={e => setStructuralOverrides({ steelGrade: e.target.value })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>Fe500</option>
                    <option>Fe550D</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Footing Depth (Df)</label>
                <div className="relative w-full">
                  <input type="number" step="0.1" value={structuralOverrides.footingDepth} onChange={e => setStructuralOverrides({ footingDepth: Number(e.target.value) })} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                  <span className="absolute right-2 top-2 text-muted-foreground text-xs">m</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Drawing Sheet & Print Setup */}
        <div>
          <AccordionHeader title="Drawing Sheet & Print Setup" section="PRINT" icon={Printer} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'PRINT' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div className="grid grid-cols-2 gap-3">
                 <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Sheet Preset</label>
                  <select value={printSetup.sheetPreset} onChange={e => setPrintSetup({ sheetPreset: e.target.value as any })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>A4 Portrait</option>
                    <option>A4 Landscape</option>
                    <option>A3</option>
                    <option>A2</option>
                    <option>A1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">View Scale</label>
                  <select value={printSetup.viewScale} onChange={e => setPrintSetup({ viewScale: e.target.value as any })} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>1:50</option>
                    <option>1:100</option>
                    <option>1:200</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Layout Template</label>
                <select value={printSetup.layoutTemplate} onChange={e => setPrintSetup({ layoutTemplate: e.target.value as any })} className="w-full p-2 border border-border rounded bg-background outline-none">
                  <option value="Sheet 1">Sheet 1 (Arch Plan + Dims + Schedule)</option>
                  <option value="Sheet 2">Sheet 2 (Column & Footing Layout)</option>
                  <option value="Sheet 3">Sheet 3 (BBS Table + Stock)</option>
                  <option value="Sheet 4">Sheet 4 (Live BOQ Cost Sheet)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-border space-y-3">
                <h3 className="text-xs font-bold text-foreground">Title Block Metadata</h3>
                <div className="space-y-2">
                   <input type="text" placeholder="Project Name" value={projectMetadata.projectName} onChange={e => setProjectMetadata({ projectName: e.target.value })} className="w-full p-2 text-xs border border-border rounded bg-background outline-none" />
                   <input type="text" placeholder="Client Name" value={projectMetadata.clientName} onChange={e => setProjectMetadata({ clientName: e.target.value })} className="w-full p-2 text-xs border border-border rounded bg-background outline-none" />
                   <input type="text" placeholder="Structural Engineer" value={projectMetadata.structuralEngineer} onChange={e => setProjectMetadata({ structuralEngineer: e.target.value })} className="w-full p-2 text-xs border border-border rounded bg-background outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
