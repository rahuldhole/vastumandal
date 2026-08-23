import type { BOQSummary, BBSReport } from '@vastumandal/dwg-schemas';

export function exportBBSReportToCSV(bbsReport: BBSReport): string {
  let csv = 'Member ID,Bar Mark,Diameter (mm),No. of Bars,Cutting Length (m),Bend Shape Code,Total Weight (kg)\n';
  
  if (bbsReport.items) {
    for (const item of bbsReport.items) {
      csv += `${item.memberId || ''},${item.barMark || ''},${item.diameter || ''},${item.numberOfBars || ''},${item.cuttingLength || ''},${item.shapeCode || ''},${item.totalWeight || ''}\n`;
    }
  }
  
  return csv;
}

export function exportBOQToCSV(boqSummary: BOQSummary): string {
  let csv = 'Item Description,Unit,Quantity,Unit Rate,Amount\n';
  
  for (const item of boqSummary.lineItems) {
    csv += `"${item.description}",${item.unit},${item.quantity.toFixed(2)},${item.unitRate.toFixed(2)},${item.totalAmount.toFixed(2)}\n`;
  }
  
  csv += `,,,Sub Total,${boqSummary.subTotal.toFixed(2)}\n`;
  csv += `,,,Contingency (${boqSummary.contingencyPercent}%),${(boqSummary.subTotal * boqSummary.contingencyPercent / 100).toFixed(2)}\n`;
  csv += `,,,Grand Total,${boqSummary.grandTotal.toFixed(2)}\n`;
  
  return csv;
}
