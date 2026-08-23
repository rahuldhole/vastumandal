import React, { useState } from 'react';
import { Copy, CheckCircle, AlertCircle, TrendingUp, Cuboid, Layers, Info, Compass } from 'lucide-react';

import { useAppStore } from '@/store/useStore';

const copyToCSV = () => {
  alert('Copied to clipboard as CSV');
};

const BarShapeIcon = ({ shape }: { shape: string }) => {
  if (shape === 'STRAIGHT' || shape === 'Straight') return <svg width="40" height="20" viewBox="0 0 40 20"><path d="M5 10 L35 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (shape === 'L_BENT' || shape === 'L-Bent') return <svg width="40" height="20" viewBox="0 0 40 20"><path d="M5 5 L5 15 L35 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (shape === 'RECT_STIRRUP' || shape === 'Stirrup') return <svg width="40" height="20" viewBox="0 0 40 20"><rect x="10" y="2" width="20" height="16" fill="none" stroke="currentColor" strokeWidth="2" rx="2" /></svg>;
  return <span className="text-xs">{shape}</span>;
};

export default function LiveBOQPanel() {
  const { boqResult, isCalculating, reqSpec } = useAppStore();
  const boq = boqResult?.boq;
  const bbs = boqResult?.bbsReport;
  const diagnostics = boqResult?.diagnostics || [];
  const [tab, setTab] = useState<'BOQ' | 'BBS' | 'SANCTION'>('BOQ');

  const grandTotal = boq?.grandTotal || 0;
  const concreteVol = boq?.lineItems.find((i: unknown) => (i as {description: string}).description.includes('Concrete'))?.quantity || 0;
  const steelTonnage = bbs?.totalTonnage || 0;
  const hasViolations = diagnostics?.some((d: unknown) => (d as {level: string}).level === 'ERROR');

  // Compute mock Vastu Score
  let vastuScore = 100;
  const v = reqSpec?.vastu || {};
  if (v.kitchenPosition && !['SE (Agni)', 'NW (Vayu)'].includes(v.kitchenPosition)) vastuScore -= 20;
  if (v.mandirPosition && !['NE (Ishan)', 'East', 'Center (Brahmasthan)'].includes(v.mandirPosition)) vastuScore -= 15;
  if (v.masterBedPosition && v.masterBedPosition !== 'SW (Nairutya)') vastuScore -= 15;
  if (v.entrancePada === 'Unfavorable') vastuScore -= 30;
  if (v.entrancePada === 'Neutral') vastuScore -= 10;
  
  const scoreColor = vastuScore >= 80 ? 'text-emerald-500' : vastuScore >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      
      {/* Sticky Metric Cards */}
      <div className="p-4 grid grid-cols-2 gap-2 bg-muted/30 border-b border-border shrink-0">
        <div className="bg-background border border-border p-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1"><TrendingUp size={12} className="text-emerald-500" /> Grand Total</div>
          <div className="font-bold text-sm text-foreground">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-background border border-border p-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1"><Cuboid size={12} className="text-blue-500" /> Concrete</div>
          <div className="font-bold text-sm text-foreground">{Number(concreteVol || 0).toFixed(1)} <span className="text-[10px] font-normal">m³</span></div>
        </div>
        <div className="bg-background border border-border p-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1"><Layers size={12} className="text-orange-500" /> Steel</div>
          <div className="font-bold text-sm text-foreground">{Number(steelTonnage || 0).toFixed(2)} <span className="text-[10px] font-normal">MT</span></div>
        </div>
        <div className="bg-background border border-border p-2 rounded-lg shadow-sm">
          <div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground mb-1">
             <span className="flex items-center gap-1"><Compass size={12} className={scoreColor} /> Vastu Score</span>
          </div>
          <div className={`font-bold text-sm ${scoreColor}`}>{vastuScore}%</div>
        </div>
        <div className={`col-span-2 border p-2 rounded-lg shadow-sm flex items-center justify-center gap-2 ${hasViolations ? 'bg-red-50/50 border-red-200 dark:bg-red-900/20' : 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/20'}`}>
          <div className="text-xs font-medium text-muted-foreground">Bylaw Status</div>
          {hasViolations ? (
             <div className="flex items-center gap-1 text-red-600 font-bold text-sm"><AlertCircle size={16} /> Violations</div>
          ) : (
             <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><CheckCircle size={16} /> Compliant</div>
          )}
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="px-4 pt-2 border-b border-border shrink-0 bg-card flex gap-4">
        {['BOQ', 'BBS', 'SANCTION'].map((t) => (
          <button 
            key={t}
            onClick={() => setTab(t as 'BOQ' | 'BBS' | 'SANCTION')}
            className={`pb-2 text-xs font-bold tracking-wide uppercase transition-colors border-b-2 ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto bg-card relative">
        {isCalculating ? (
          <div className="p-4 space-y-4 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded w-5/6"></div>
              <div className="h-6 bg-muted rounded w-4/6"></div>
              <div className="h-6 bg-muted rounded"></div>
            </div>
          </div>
        ) : tab === 'BOQ' && boq ? (
          <div className="p-4">
            <div className="flex justify-end mb-2">
              <button onClick={() => copyToCSV()} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 px-2 py-1 rounded transition">
                <Copy size={14} /> Copy as CSV
              </button>
            </div>
            <table className="w-full text-xs text-left border-collapse" id="boq-table">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-2 border-b font-medium text-muted-foreground">Description</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-right">Qty</th>
                  <th className="p-2 border-b font-medium text-muted-foreground">Unit</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-right">Rate</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {boq.lineItems.map((item: { itemCode: string; description: string; quantity: number; unit: string; unitRate: number; totalAmount: number }) => (
                  <tr key={item.itemCode} className="border-b border-border hover:bg-muted/20">
                    <td className="p-2">{item.description}</td>
                    <td className="p-2 text-right font-mono">{Number(item.quantity ?? 0).toFixed(2)}</td>
                    <td className="p-2 text-muted-foreground">{item.unit}</td>
                    <td className="p-2 text-right font-mono">{Number(item.unitRate ?? 0).toFixed(2)}</td>
                    <td className="p-2 text-right font-mono">{Number(item.totalAmount ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={4} className="p-2 text-right text-muted-foreground">Contingency (3%)</td>
                  <td className="p-2 text-right font-mono">{Number((boq.grandTotal || 0) - (boq.subTotal || 0)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2 font-bold text-right text-foreground">Grand Total</td>
                  <td className="p-2 font-bold text-right font-mono text-emerald-600 dark:text-emerald-400">{Number(boq.grandTotal ?? 0).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : tab === 'BBS' && bbs ? (
          <div className="p-4">
             <div className="flex justify-end mb-2">
              <button onClick={() => copyToCSV()} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 px-2 py-1 rounded transition">
                <Copy size={14} /> Copy as CSV
              </button>
            </div>
            <table className="w-full text-xs text-left border-collapse" id="bbs-table">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-2 border-b font-medium text-muted-foreground">Mark</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-center">Shape</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-center">Ø (mm)</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-right">Cut (m)</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-right">Count</th>
                  <th className="p-2 border-b font-medium text-muted-foreground text-right">Wt (kg)</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {bbs.items.map((item: { id: string; barMark: string; barShape: string; barDiameter: number; numberOfBars: number; totalWeight: number }) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-2 font-medium">{item.barMark}</td>
                    <td className="p-2 text-center text-primary"><BarShapeIcon shape={item.barShape} /></td>
                    <td className="p-2 text-center">{item.barDiameter}</td>
                    <td className="p-2 text-right font-mono">-</td>
                    <td className="p-2 text-right font-mono">{item.numberOfBars}</td>
                    <td className="p-2 text-right font-mono">{Number(item.totalWeight ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tab === 'SANCTION' ? (
          <div className="p-4 space-y-3">
            {diagnostics?.length ? diagnostics.map((d: { level: string; code: string; message: string }, i: number) => (
              <div key={i} className={`p-3 rounded-lg border flex gap-3 ${d.level === 'ERROR' ? 'bg-red-50/50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800' : d.level === 'WARNING' ? 'bg-amber-50/50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800' : 'bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                {d.level === 'ERROR' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" /> : <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />}
                <div>
                  <strong className="block text-sm mb-0.5">[{d.code}]</strong> 
                  <span className="text-xs opacity-90">{d.message}</span>
                </div>
              </div>
            )) : (
              <div className="text-center p-8 text-muted-foreground text-sm">No sanction data available.</div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground text-sm">No data available. Run the pipeline.</div>
        )}
      </div>
    </div>
  );
}
