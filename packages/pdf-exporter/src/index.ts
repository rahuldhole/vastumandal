import { FloorPlan, Column, BOQReport } from '@vastumandal/dwg-schemas';
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';

export interface PDFExportOptions {
  floorPlan: any;
  columns: any[];
  boq: any;
  printSetup: {
    sheetPreset: string;
    viewScale: string;
    layoutTemplate: string;
  };
  projectMetadata: {
    projectName: string;
    clientName: string;
    siteLocation: string;
    structuralEngineer: string;
    revisionNumber: string;
    date: string;
    northArrowOrientation: number;
  };
}

export async function exportToPdf(options: PDFExportOptions): Promise<Blob> {
  const { floorPlan, columns, boq, printSetup, projectMetadata } = options;
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Determine page size based on printSetup
  let pageSize: [number, number] = [595.28, 841.89]; // A4 Portrait
  if (printSetup?.sheetPreset === 'A4 Landscape') pageSize = [841.89, 595.28];
  if (printSetup?.sheetPreset === 'A3') pageSize = [1190.55, 841.89]; // A3 Landscape
  if (printSetup?.sheetPreset === 'A2') pageSize = [1683.78, 1190.55]; // A2 Landscape
  if (printSetup?.sheetPreset === 'A1') pageSize = [2383.94, 1683.78]; // A1 Landscape

  const drawTitleBlock = (page: any, title: string) => {
    const { width, height } = page.getSize();
    
    // Border
    page.drawRectangle({
      x: 20, y: 20, width: width - 40, height: height - 40,
      borderWidth: 2, borderColor: rgb(0, 0, 0),
    });

    // Title Block Area (Bottom Right)
    const blockWidth = 220;
    const blockHeight = 120;
    page.drawRectangle({
      x: width - 20 - blockWidth, y: 20, width: blockWidth, height: blockHeight,
      borderWidth: 1.5, borderColor: rgb(0, 0, 0), color: rgb(1, 1, 1)
    });

    const textX = width - 20 - blockWidth + 10;
    
    page.drawText('VASTUMANDAL STUDIO SET', { x: textX, y: 120, size: 10, font: timesRomanBold });
    page.drawLine({
      start: { x: width - 20 - blockWidth, y: 110 },
      end: { x: width - 20, y: 110 },
      thickness: 1, color: rgb(0, 0, 0)
    });
    
    page.drawText(`Project: ${projectMetadata?.projectName || 'N/A'}`, { x: textX, y: 95, size: 10, font: timesRomanBold });
    page.drawText(`Client: ${projectMetadata?.clientName || 'N/A'}`, { x: textX, y: 80, size: 10, font: timesRomanFont });
    page.drawText(`Engineer: ${projectMetadata?.structuralEngineer || 'N/A'}`, { x: textX, y: 65, size: 10, font: timesRomanFont });
    page.drawText(`Rev: ${projectMetadata?.revisionNumber || 'R0'} | Date: ${projectMetadata?.date || new Date().toLocaleDateString()}`, { x: textX, y: 50, size: 9, font: timesRomanFont });
    
    page.drawLine({
      start: { x: width - 20 - blockWidth, y: 40 },
      end: { x: width - 20, y: 40 },
      thickness: 1, color: rgb(0, 0, 0)
    });
    
    page.drawText(title, { x: textX, y: 25, size: 11, font: timesRomanBold, color: rgb(0.2, 0.2, 0.6) });
  };

  // Helper for Auto-Paginated Tables
  const drawTable = (doc: any, title: string, headers: string[], rows: string[][], startY: number = pageSize[1] - 80) => {
    let currentPage = doc.addPage(pageSize);
    drawTitleBlock(currentPage, title);
    
    const { width, height } = currentPage.getSize();
    let currentY = startY;
    const marginX = 50;
    const rowHeight = 20;
    const colWidths = headers.map(() => (width - marginX * 2) / headers.length);
    
    // Draw Title
    currentPage.drawText(title, { x: marginX, y: currentY + 30, size: 18, font: timesRomanBold });
    
    // Draw Headers
    headers.forEach((h, i) => {
      currentPage.drawRectangle({
        x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y: currentY,
        width: colWidths[i],
        height: rowHeight,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      currentPage.drawText(h, { x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y: currentY + 5, size: 10, font: timesRomanBold });
    });
    
    currentY -= rowHeight;

    // Draw Rows
    for (let r = 0; r < rows.length; r++) {
      if (currentY < 150) {
        currentPage = doc.addPage(pageSize);
        drawTitleBlock(currentPage, `${title} (Continued)`);
        currentY = height - 80;
        // Redraw Headers
        headers.forEach((h, i) => {
          currentPage.drawRectangle({
            x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y: currentY,
            width: colWidths[i],
            height: rowHeight,
            color: rgb(0.9, 0.9, 0.9),
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
          });
          currentPage.drawText(h, { x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y: currentY + 5, size: 10, font: timesRomanBold });
        });
        currentY -= rowHeight;
      }
      
      const row = rows[r];
      row.forEach((cell, i) => {
        currentPage.drawRectangle({
          x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y: currentY,
          width: colWidths[i],
          height: rowHeight,
          color: r % 2 === 0 ? rgb(1, 1, 1) : rgb(0.97, 0.97, 0.97),
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
        currentPage.drawText(String(cell), { x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y: currentY + 5, size: 9, font: timesRomanFont });
      });
      currentY -= rowHeight;
    }
  };

  const layout = printSetup?.layoutTemplate || 'Sheet 1';

  if (layout.includes('Sheet 1') || layout.includes('Sheet 2')) {
    const page = pdfDoc.addPage(pageSize);
    drawTitleBlock(page, layout.includes('Sheet 1') ? '01: ARCHITECTURAL PLAN' : '02: STRUCTURAL LAYOUT');
    page.drawText(layout.includes('Sheet 1') ? 'ARCHITECTURAL FLOOR PLAN' : 'CENTERLINE & COLUMN LAYOUT', { x: 50, y: pageSize[1] - 80, size: 18, font: timesRomanBold });
    
    // Draw vectors (Mocked for now, needs actual layout geometry parsing)
    page.drawText('(Vector Drafting Pipeline output goes here)', { x: 50, y: pageSize[1] - 120, size: 12, font: timesRomanFont });
    page.drawRectangle({
      x: 50, y: pageSize[1] - 400, width: 300, height: 200,
      borderWidth: 1, borderColor: rgb(0.1, 0.1, 0.1)
    });
    page.drawLine({
      start: { x: 50, y: pageSize[1] - 200 },
      end: { x: 350, y: pageSize[1] - 400 },
      thickness: 1, color: rgb(0, 0, 1)
    });
  }

  if (layout.includes('Sheet 3') || layout.includes('Sheet 4')) {
    // Schedule sheets
    if (boq && boq.lineItems) {
      if (layout.includes('Sheet 3')) {
        const steelItems = boq.lineItems.filter((i: any) => i.category === 'STEEL');
        const headers = ['Code', 'Description', 'Dia', 'Count', 'Total Length', 'Weight'];
        const rows = steelItems.map((item: any) => [
          item.itemCode || '---',
          item.description || 'Rebar',
          '8mm', // placeholder
          String(Math.floor(Math.random() * 50) + 10),
          String((item.quantity || 0).toFixed(2)),
          String((item.quantity * 0.395).toFixed(2) + ' kg') // Mock weight
        ]);
        drawTable(pdfDoc, '03: BAR BENDING SCHEDULE (BBS)', headers, rows);
      } else {
        const headers = ['S.No', 'Description', 'Category', 'Quantity', 'Unit', 'Rate', 'Amount'];
        const rows = boq.lineItems.map((item: any, i: number) => [
          String(i + 1),
          item.description || '---',
          item.category || '---',
          String((item.quantity || 0).toFixed(2)),
          item.unit || '---',
          String((item.unitRate || 0).toFixed(2)),
          String(((item.quantity || 0) * (item.unitRate || 0)).toFixed(2))
        ]);
        // Add Total Row
        const totalAmount = boq.lineItems.reduce((acc: number, item: any) => acc + (item.quantity || 0) * (item.unitRate || 0), 0);
        rows.push(['', 'TOTAL', '', '', '', '', String(totalAmount.toFixed(2))]);
        
        drawTable(pdfDoc, '04: BILL OF QUANTITIES (BOQ)', headers, rows);
      }
    } else {
      const page = pdfDoc.addPage(pageSize);
      drawTitleBlock(page, 'SCHEDULE');
      page.drawText('No BOQ data available for this schedule.', { x: 50, y: pageSize[1] - 80, size: 14, font: timesRomanFont });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
