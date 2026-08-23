import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Settings2 } from 'lucide-react';

const AccordionHeader = ({ title, section, openSection, setOpenSection, icon: Icon }: { title: string, section: 'A' | 'B' | 'C', openSection: 'A' | 'B' | 'C' | null, setOpenSection: (s: 'A' | 'B' | 'C' | null) => void, icon: React.ElementType }) => (
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

export default function ControlPanel({ onParamsChange = () => {} }: { onParamsChange?: (params: unknown) => void }) {
  const [sbc, setSbc] = useState(200);
  const [storeys, setStoreys] = useState(2); // G+1
  const [fSetback, setFSetback] = useState(3);
  const [rSetback, setRSetback] = useState(1.5);
  
  // New States for Section B and C
  const [soilType, setSoilType] = useState('Medium Soil');
  const [depth, setDepth] = useState(1.5);
  const [concreteGrade, setConcreteGrade] = useState('M25');
  const [steelGrade, setSteelGrade] = useState('Fe500');

  // Accordion State
  const [openSection, setOpenSection] = useState<'A' | 'B' | 'C' | null>('B');

  const triggerUpdate = () => {
    onParamsChange({ sbc, storeys, setbacks: { front: fSetback, rear: rSetback }, soilType, depth, concreteGrade, steelGrade });
  };

  const isLowSBC = sbc < 80;
  const isLargeSpan = false; // Mock for span > 7.5m

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg text-foreground">Workbench Controls</h2>
      </div>

      <div className="flex-1 overflow-auto">
        
        {/* SECTION A: Building Envelope */}
        <div>
          <AccordionHeader title="Building Envelope & Geometry" section="A" icon={Settings2} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'A' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div>
                <label className="block font-medium mb-1.5 flex items-center gap-1">Storey Level</label>
                <div className="flex bg-muted p-1 rounded-lg">
                  {[1, 2, 3, 4, 5].map((val, idx) => (
                    <button
                      key={val}
                      onClick={() => { setStoreys(val); triggerUpdate(); }}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${storeys === val ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {idx === 0 ? 'G' : `G+${idx}`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Front Setback</label>
                  <div className="relative">
                    <input type="number" value={fSetback} onChange={e => { setFSetback(Number(e.target.value)); triggerUpdate(); }} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">m</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Rear Setback</label>
                  <div className="relative">
                    <input type="number" value={rSetback} onChange={e => { setRSetback(Number(e.target.value)); triggerUpdate(); }} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                    <span className="absolute right-2 top-1.5 text-muted-foreground text-xs font-medium">m</span>
                  </div>
                </div>
              </div>
              {isLargeSpan && (
                <div className="mt-2 flex gap-2 p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Large span detected. Verify deflection in ETABS.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION B: Soil & Geotechnical */}
        <div>
          <AccordionHeader title="Soil & Geotechnical" section="B" icon={Settings2} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'B' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div>
                <label className="block font-medium mb-1.5 flex justify-between items-center">
                  <span className="flex items-center gap-1">Safe Bearing Capacity <span title="Standard SBC for residential footing design"><Info size={14} className="text-muted-foreground cursor-help" /></span></span>
                </label>
                <div className="flex gap-2 items-center mb-2">
                  <input 
                    type="range" min="50" max="400" step="10" 
                    value={sbc} onChange={e => { setSbc(Number(e.target.value)); triggerUpdate(); }}
                    className="flex-1 accent-primary"
                  />
                  <div className="relative w-24">
                    <input type="number" value={sbc} onChange={e => { setSbc(Number(e.target.value)); triggerUpdate(); }} className="w-full p-1.5 pr-10 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none text-right font-mono text-xs" />
                    <span className="absolute right-2 top-2 text-muted-foreground text-[10px]">kN/m²</span>
                  </div>
                </div>
                {isLowSBC && (
                  <div className="mt-1 flex gap-2 p-2 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs items-start">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>Low bearing capacity: Isolated footings unsafe. Consider raft/pile foundation export.</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block font-medium mb-1.5">Soil Type</label>
                <select value={soilType} onChange={e => { setSoilType(e.target.value); triggerUpdate(); }} className="w-full p-2 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none">
                  <option>Soft Clay</option>
                  <option>Medium Soil</option>
                  <option>Hard Strata / Murrum</option>
                  <option>Rock</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-muted-foreground text-xs">Depth of Foundation (Df)</label>
                <div className="relative w-1/2">
                  <input type="number" step="0.1" value={depth} onChange={e => { setDepth(Number(e.target.value)); triggerUpdate(); }} className="w-full p-2 pr-6 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none" />
                  <span className="absolute right-2 top-2 text-muted-foreground text-xs">m</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION C: Materials & Rates */}
        <div>
          <AccordionHeader title="Materials & Regional Rates" section="C" icon={Settings2} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'C' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Concrete</label>
                  <select value={concreteGrade} onChange={e => { setConcreteGrade(e.target.value); triggerUpdate(); }} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>M20</option>
                    <option>M25</option>
                    <option>M30</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Steel</label>
                  <select value={steelGrade} onChange={e => { setSteelGrade(e.target.value); triggerUpdate(); }} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>Fe500</option>
                    <option>Fe550</option>
                  </select>
                </div>
              </div>
              <button className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded text-xs font-medium transition">
                Configure Regional Rates...
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
