import React, { useState } from 'react';
import type { BOQSummary } from '@vastumandal/dwg-schemas/src/estimator';
import type { BBSReport } from '@vastumandal/dwg-schemas/src/bbs';

interface LiveBOQPanelProps {
  boq: BOQSummary | null;
  bbs: BBSReport | null;
  diagnostics: any[];
}

export function LiveBOQPanel({ boq, bbs, diagnostics }: LiveBOQPanelProps) {
  const [tab, setTab] = useState<'BOQ' | 'BBS' | 'SANCTION'>('BOQ');

  return (
    <div className="flex flex-col h-full bg-white shadow rounded p-4">
      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button className={`font-bold ${tab === 'BOQ' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setTab('BOQ')}>Live BOQ</button>
        <button className={`font-bold ${tab === 'BBS' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setTab('BBS')}>BBS</button>
        <button className={`font-bold ${tab === 'SANCTION' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setTab('SANCTION')}>Sanction</button>
      </div>

      <div className="flex-1 overflow-auto">
        {tab === 'BOQ' && boq && (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Rate</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {boq.lineItems.map(item => (
                <tr key={item.itemCode} className="border-b">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.quantity.toFixed(2)}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">{item.unitRate.toFixed(2)}</td>
                  <td className="p-2">{item.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="p-2 font-bold text-right">Subtotal</td>
                <td className="p-2 font-bold">{boq.subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className="p-2 font-bold text-right">Grand Total (+3%)</td>
                <td className="p-2 font-bold text-green-600">{boq.grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        {tab === 'BBS' && bbs && (
          <div>
            <h3 className="font-bold text-lg mb-2">Total Steel: {bbs.totalTonnage.toFixed(2)} MT</h3>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Mark</th>
                  <th className="p-2">Shape</th>
                  <th className="p-2">Dia (mm)</th>
                  <th className="p-2">Count</th>
                  <th className="p-2">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {bbs.items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.barMark}</td>
                    <td className="p-2">{item.barShape}</td>
                    <td className="p-2">{item.barDiameter}</td>
                    <td className="p-2">{item.numberOfBars}</td>
                    <td className="p-2">{item.totalWeight.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'SANCTION' && (
          <div className="space-y-2">
            {diagnostics.map((d, i) => (
              <div key={i} className={`p-3 rounded border ${d.level === 'ERROR' ? 'bg-red-50 border-red-200 text-red-800' : d.level === 'WARNING' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                <strong>[{d.code}]</strong> {d.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
