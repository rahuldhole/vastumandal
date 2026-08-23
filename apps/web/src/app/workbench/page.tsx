'use client';
import { useState } from 'react';
import { PlotSpec, RequirementSpec } from '@vastumandal/dwg-schemas';
import { generateFloorPlan } from '@vastumandal/core-spatial';
// import { solveStructural } from '@vastumandal/core-structural';
// import { computeBOQ } from '@vastumandal/core-estimator';
// import { exportDXF } from '@vastumandal/dxf-exporter';
import { exportToObj } from '@vastumandal/mesh-exporter';
import { exportToPdf } from '@vastumandal/pdf-exporter';

export default function Workbench() {
  const [plotSpec, setPlotSpec] = useState<PlotSpec>({
    width: 30,
    length: 40,
    facing: 'E',
    setbacks: { front: 5, rear: 3, left: 3, right: 3 },
    roadWidth: 20,
    floorCount: 'G',
  });

  const [reqSpec, setReqSpec] = useState<RequirementSpec>({
    bhk: '2BHK',
    pujaRoom: true,
    toilets: { attached: true, common: true, type: 'Western' },
    parking: true,
    porch: true,
  });

  const handleGenerate = () => {
    const floorPlan = generateFloorPlan(plotSpec, reqSpec);
    // const columnGrid = solveStructural(floorPlan);
    // const boqReport = computeBOQ(floorPlan.bua, 1500); // 1500 INR/sqft
    // const dxfString = exportDXF(floorPlan, columnGrid);
    
    // Using empty arrays/mocks for columns/boq to satisfy the interface for now
    const objMesh = exportToObj(floorPlan, []);
    exportToPdf(floorPlan, [], { quantities: { steelMT: 0, cementBags: 0, sandCuFt: 0, aggregateCuFt: 0, bricksCount: 0 }, phases: { substructure: 0, rccFraming: 0, masonry: 0, plumbingElectrical: 0, finishing: 0 }, totalCost: 0 }).then((pdfBlob) => {
        console.log('PDF Generated', pdfBlob.size);
    });

    console.log('Generated Mesh:', objMesh);
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      <div className="w-80 p-6 border-r border-neutral-700">
        <h1 className="text-xl font-bold mb-6">VastuMandal</h1>
        <button 
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
        >
          Generate Layout
        </button>
      </div>
      <div className="flex-1 p-6 relative flex items-center justify-center">
        {/* SVG Canvas Here */}
        <p className="text-neutral-400">Canvas Preview</p>
      </div>
    </div>
  );
}
