import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Settings2, Compass, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { PRESETS } from '@vastumandal/dwg-schemas/src/presets';

type SectionType = 'A' | 'B' | 'C' | 'D' | null;

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
  const { reqSpec, setReqSpec, setPlotSpec, setRates } = useAppStore();
  const vastu = reqSpec.vastu || {};
  const setVastu = (key: string, value: string) => {
    setReqSpec({ vastu: { ...vastu, [key]: value } });
  };
  const [sbc, setSbc] = useState(200);
  const [storeys, setStoreys] = useState(2); // G+1
  const [fSetback, setFSetback] = useState(3);
  const [rSetback, setRSetback] = useState(1.5);
  
  // New States for Section B and C
  const [soilType, setSoilType] = useState('Medium Soil');
  const [depth, setDepth] = useState(1.5);
  const [concreteGrade, setConcreteGrade] = useState('M25');
  const [steelGrade, setSteelGrade] = useState('Fe500');

  // Preset state
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESETS[1].label); // default: G+1 Residential
  const activePreset = PRESETS.find(p => p.label === selectedPreset);

  const handlePresetChange = (presetLabel: string) => {
    const preset = PRESETS.find(p => p.label === presetLabel);
    if (!preset) return;
    setSelectedPreset(presetLabel);
    // Hydrate store
    setPlotSpec(preset.plotSpec);
    setReqSpec(preset.reqSpec);
    // Map preset RateCard to UI rates shape
    setRates({
      steel: Math.round(preset.rates.steel / 1000), // per-MT → per-kg
      cement: Math.round(preset.rates.concrete * 0.3),
      sand: Math.round(preset.rates.concrete * 0.05),
      aggregate: Math.round(preset.rates.concrete * 0.04),
      brick: Math.round(preset.rates.masonry / 500),
      columnSize: '230x380',
    });
    // Update local accordion state
    setSbc(preset.soil.safeBearingCapacity);
    setFSetback(preset.plotSpec.setbacks.front);
    setRSetback(preset.plotSpec.setbacks.rear);
    const fc = preset.plotSpec.floorCount || 'G';
    const m = fc.match(/G\+(\d+)/i);
    setStoreys(m ? 1 + parseInt(m[1], 10) : 1);
  };

  // Accordion State
  const [openSection, setOpenSection] = useState<SectionType>('B');

  const triggerUpdate = () => {
    // legacy mock update
  };

  const isLowSBC = Boolean(sbc < 80);
  const isLargeSpan = false; // Mock for span > 7.5m

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg text-foreground">Workbench Controls</h2>
      </div>

      {/* ── Preset Selector ── */}
      <div className="p-4 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Zap size={12} className="text-primary" /> Quick Preset
        </label>
        <select
          value={selectedPreset}
          onChange={e => handlePresetChange(e.target.value)}
          className="w-full p-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm font-medium text-foreground transition"
        >
          {PRESETS.map(p => (
            <option key={p.label} value={p.label}>{p.label}</option>
          ))}
        </select>
        {activePreset && (
          <div className="mt-2 text-[11px] text-muted-foreground bg-muted/40 px-2.5 py-1.5 rounded-md flex items-center gap-1.5">
            <Info size={12} className="shrink-0 text-primary/70" />
            {activePreset.description}
          </div>
        )}
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

        {/* SECTION D: Vastu Purusha Mandala */}
        <div>
          <AccordionHeader title="Vastu Purusha Mandala" section="D" icon={Compass} openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === 'D' && (
            <div className="p-4 space-y-4 text-sm bg-card">
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Plot Facing</label>
                <select value={vastu.plotFacing || 'North'} onChange={e => setVastu('plotFacing', e.target.value)} className="w-full p-2 border border-border rounded bg-background outline-none">
                  <option>North</option><option>East</option><option>South</option><option>West</option>
                  <option>NE</option><option>NW</option><option>SE</option><option>SW</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Mandir</label>
                  <select value={vastu.mandirPosition || 'NE (Ishan)'} onChange={e => setVastu('mandirPosition', e.target.value)} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>NE (Ishan)</option><option>East</option><option>Center (Brahmasthan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Kitchen</label>
                  <select value={vastu.kitchenPosition || 'SE (Agni)'} onChange={e => setVastu('kitchenPosition', e.target.value)} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>SE (Agni)</option><option>NW (Vayu)</option><option>East</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Master Bed</label>
                  <select value={vastu.masterBedPosition || 'SW (Nairutya)'} onChange={e => setVastu('masterBedPosition', e.target.value)} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>SW (Nairutya)</option><option>South</option><option>West</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Main Gate</label>
                  <select value={vastu.entrancePada || 'Favorable'} onChange={e => setVastu('entrancePada', e.target.value)} className="w-full p-2 border border-border rounded bg-background outline-none">
                    <option>Favorable</option><option>Neutral</option><option>Unfavorable</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
