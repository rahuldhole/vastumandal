"use client";

import React from "react";
import { useAppStore } from "@/store/useStore";
import { PieChart, List, FileText } from "lucide-react";

export default function LiveBOQPanel() {
  const { plotSpec, boqResult, isCalculating } = useAppStore();
  
  // Use worker calculations or fallback to defaults
  const plotArea = boqResult?.plotArea || (plotSpec.width * plotSpec.length);
  const bua = boqResult?.bua || (plotArea * 0.7); 
  const carpetArea = boqResult?.carpetArea || (bua * 0.85);

  const totalCost = boqResult?.totalCost || (bua * 1500); 
  
  const materials = boqResult?.materials || {
    steel: (bua * 4).toFixed(1),
    cement: (bua * 0.4).toFixed(0),
    sand: (bua * 1.8).toFixed(0),
    aggregate: (bua * 1.35).toFixed(0),
    bricks: (bua * 8.5).toFixed(0),
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={`w-[320px] flex-shrink-0 bg-card border-l border-border h-full overflow-y-auto flex flex-col custom-scrollbar transition-opacity ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
      <div className="p-4 font-semibold border-b border-border text-foreground sticky top-0 bg-card z-10 flex items-center gap-2">
        <PieChart className="w-4 h-4 text-primary" />
        Live Estimate & BOQ
      </div>

      <div className="p-4 space-y-6">
        {/* Project Metrics */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <List className="w-3.5 h-3.5" /> Project Metrics
          </h3>
          <div className="bg-muted/20 border border-border rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Plot Area:</span>
              <span className="font-medium text-foreground">{plotArea} sq.ft</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Built-Up Area:</span>
              <span className="font-medium text-emerald-500 dark:text-emerald-400">{bua.toFixed(0)} sq.ft</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Carpet Area:</span>
              <span className="font-medium text-foreground">{carpetArea.toFixed(0)} sq.ft</span>
            </div>
            <div className="pt-2 mt-2 border-t border-border flex justify-between items-center">
              <span className="text-sm font-medium">Est. Cost:</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(totalCost)}</span>
            </div>
          </div>
        </div>

        {/* Material Takeoff */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Material Takeoff
          </h3>
          <div className="bg-muted/20 border border-border rounded-lg p-3">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-muted-foreground">Steel</td>
                  <td className="py-2 text-right font-medium">{materials.steel} kg</td>
                </tr>
                <tr className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-muted-foreground">Cement</td>
                  <td className="py-2 text-right font-medium">{materials.cement} bags</td>
                </tr>
                <tr className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-muted-foreground">Sand</td>
                  <td className="py-2 text-right font-medium">{materials.sand} cft</td>
                </tr>
                <tr className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-muted-foreground">Aggregate</td>
                  <td className="py-2 text-right font-medium">{materials.aggregate} cft</td>
                </tr>
                <tr className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-muted-foreground">Bricks</td>
                  <td className="py-2 text-right font-medium">{materials.bricks} pcs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Phase Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Phase Breakdown</h3>
          <div className="space-y-3 bg-muted/20 border border-border rounded-lg p-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Substructure (15%)</span>
                <span>{formatCurrency(totalCost * 0.15)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>RCC Framing (25%)</span>
                <span>{formatCurrency(totalCost * 0.25)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Masonry (20%)</span>
                <span>{formatCurrency(totalCost * 0.20)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Plumbing & Elec (25%)</span>
                <span>{formatCurrency(totalCost * 0.25)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Finishing (15%)</span>
                <span>{formatCurrency(totalCost * 0.15)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
