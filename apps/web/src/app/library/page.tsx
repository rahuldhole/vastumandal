"use client";

import React, { useState } from "react";
import { Download, Search, Maximize, X, Copy, Check } from "lucide-react";
import { 
  exportDoorDXF, exportWindowDXF, exportNorthSymbolDXF,
  exportDoubleDoorDXF, exportSlidingDoorDXF, exportGarageDoorDXF,
  exportSectionMarkerDXF, exportElevationTargetDXF, exportRevisionCloudDXF, exportGridBubbleDXF,
  exportDeskDXF, exportConferenceTableDXF, exportToiletDXF, exportSinkDXF,
  exportTreeDXF, exportShrubDXF, exportParkingBaysDXF, exportVehicleDXF,
  exportLightFixtureDXF, exportSocketSwitchDXF, exportDistributionBoardDXF, exportHVACVentDXF
} from "@rdcad-express/dxf-exporter";
import DXFPreview from "@/components/DXFPreview";

const ASSETS = [
  { id: "door", name: "Standard Door (900mm)", category: "Architectural", generate: exportDoorDXF },
  { id: "double-door", name: "Double Swing Door (1800mm)", category: "Architectural", generate: exportDoubleDoorDXF },
  { id: "sliding-door", name: "Sliding Glass Door (2000mm)", category: "Architectural", generate: exportSlidingDoorDXF },
  { id: "garage-door", name: "Garage Roller Door (2400mm)", category: "Architectural", generate: exportGarageDoorDXF },
  { id: "window", name: "Standard Window (1200mm)", category: "Architectural", generate: exportWindowDXF },
  { id: "north", name: "North Symbol", category: "Drafting", generate: exportNorthSymbolDXF },
  { id: "section-marker", name: "Section Callout", category: "Drafting", generate: exportSectionMarkerDXF },
  { id: "elevation-target", name: "Elevation Target", category: "Drafting", generate: exportElevationTargetDXF },
  { id: "revision-cloud", name: "Revision Cloud", category: "Drafting", generate: exportRevisionCloudDXF },
  { id: "grid-bubble", name: "Grid Line Bubble", category: "Drafting", generate: exportGridBubbleDXF },
  { id: "desk", name: "Standard Desk (1500x750)", category: "Furniture", generate: exportDeskDXF },
  { id: "conference-table", name: "Conference Table (3000x1200)", category: "Furniture", generate: exportConferenceTableDXF },
  { id: "toilet", name: "Water Closet (WC)", category: "Plumbing", generate: exportToiletDXF },
  { id: "sink", name: "Wash Basin (600x450)", category: "Plumbing", generate: exportSinkDXF },
  { id: "tree", name: "Algorithmic Tree (Plan)", category: "Landscaping & Site", generate: exportTreeDXF },
  { id: "shrub", name: "Shrub / Hedge (Plan)", category: "Landscaping & Site", generate: exportShrubDXF },
  { id: "parking", name: "Parking Bays (x5)", category: "Landscaping & Site", generate: exportParkingBaysDXF },
  { id: "vehicle", name: "Standard Sedan", category: "Landscaping & Site", generate: exportVehicleDXF },
  { id: "light-fixture", name: "Ceiling Troffer Light (1200x600)", category: "Electrical & Mechanical", generate: exportLightFixtureDXF },
  { id: "socket-switch", name: "Double Wall Socket", category: "Electrical & Mechanical", generate: exportSocketSwitchDXF },
  { id: "distribution-board", name: "Distribution Board (DB)", category: "Electrical & Mechanical", generate: exportDistributionBoardDXF },
  { id: "hvac-vent", name: "HVAC Supply Diffuser", category: "Electrical & Mechanical", generate: exportHVACVentDXF },
];

type AssetType = { id: string; name: string; category: string; generate: () => string };

export default function AssetLibrary() {
  const [search, setSearch] = useState("");
  const [previewAsset, setPreviewAsset] = useState<AssetType | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAssets = ASSETS.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedAssets = filteredAssets.reduce((acc, asset) => {
    if (!acc[asset.category]) acc[asset.category] = [];
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, AssetType[]>);

  const handleExport = (asset: AssetType) => {
    const dxfString = asset.generate();
    const blob = new Blob([dxfString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${asset.id}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (asset: AssetType) => {
    const dxfString = asset.generate();
    try {
      await navigator.clipboard.writeText(dxfString);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy DXF", err);
    }
  };

  return (
    <div className="p-4 md:p-8 pt-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end pb-6 border-b border-border gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Architectural Asset Library</h1>
            <p className="text-muted-foreground mt-1 text-sm">Browse and download standard DXF blocks for your drawings.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-md pl-10 pr-4 py-2 text-sm text-foreground focus:border-blue-700 dark:border-blue-500 outline-none"
            />
          </div>
        </header>

        <div className="space-y-12">
          {Object.entries(groupedAssets).map(([category, assets]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-foreground mb-6 border-b border-border pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map(asset => {
                  const dxfString = asset.generate();
                  return (
                    <div 
                      key={asset.id} 
                      className="bg-card rounded-lg border border-border overflow-hidden flex flex-col group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all"
                    >
                      <div className="h-48 bg-background p-0 relative flex items-center justify-center pointer-events-none">
                        <DXFPreview dxfString={dxfString} staticMode={true} />
                      </div>
                      <div className="p-4 border-t border-border bg-card flex justify-between items-center">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate pr-2">{asset.name}</h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewAsset(asset);
                            }}
                            className="p-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
                            title="Preview Fullscreen"
                          >
                            <Maximize className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(asset);
                            }}
                            className="p-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
                            title="Copy DXF"
                          >
                            {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport(asset);
                            }}
                            className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors"
                            title="Download DXF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {filteredAssets.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No assets found matching &quot;{search}&quot;.
          </div>
        )}
      </div>

      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{previewAsset.name}</h2>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">{previewAsset.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleCopy(previewAsset)}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
              >
                {copiedId === previewAsset.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />} Copy
              </button>
              <button 
                onClick={() => handleExport(previewAsset)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button 
                onClick={() => setPreviewAsset(null)} 
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full h-full p-4 md:p-8">
             <div className="w-full h-full border border-border rounded-lg overflow-hidden bg-background shadow-2xl relative">
                <DXFPreview dxfString={previewAsset.generate()} staticMode={false} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
