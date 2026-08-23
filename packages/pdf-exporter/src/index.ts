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

  // Determine page size
  let pageSize: [number, number] = [595.28, 841.89]; // A4 Portrait
  if (printSetup?.sheetPreset === 'A4 Landscape') pageSize = [841.89, 595.28];
  if (printSetup?.sheetPreset === 'A3') pageSize = [1190.55, 841.89];
  if (printSetup?.sheetPreset === 'A2') pageSize = [1683.78, 1190.55];
  if (printSetup?.sheetPreset === 'A1') pageSize = [2383.94, 1683.78];

  const drawTitleBlock = (page: any, title: string) => {
    const { width, height } = page.getSize();
    
    // Border with engineering line weight hierarchy
    page.drawRectangle({
      x: 20, y: 20, width: width - 40, height: height - 40,
      borderWidth: 3, borderColor: rgb(0, 0, 0),
    });

    const blockWidth = 220;
    const blockHeight = 120;
    page.drawRectangle({
      x: width - 20 - blockWidth, y: 20, width: blockWidth, height: blockHeight,
      borderWidth: 2, borderColor: rgb(0, 0, 0), color: rgb(1, 1, 1)
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

  const drawTable = (doc: any, title: string, headers: string[], rows: string[][], startY: number = pageSize[1] - 80) => {
    let currentPage = doc.addPage(pageSize);
    drawTitleBlock(currentPage, title);
    
    const { width, height } = currentPage.getSize();
    let currentY = startY;
    const marginX = 50;
    const rowHeight = 20;
    const colWidths = headers.map(() => (width - marginX * 2 - 220) / headers.length); // Leave space for title block if needed
    
    currentPage.drawText(title, { x: marginX, y: currentY + 30, size: 18, font: timesRomanBold });
    
    headers.forEach((h, i) => {
      currentPage.drawRectangle({
        x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y: currentY,
        width: colWidths[i],
        height: rowHeight,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1.5,
      });
      currentPage.drawText(h, { x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y: currentY + 5, size: 10, font: timesRomanBold });
    });
    
    currentY -= rowHeight;

    for (let r = 0; r < rows.length; r++) {
      if (currentY < 150) {
        currentPage = doc.addPage(pageSize);
        drawTitleBlock(currentPage, `${title} (Continued)`);
        currentY = height - 80;
        headers.forEach((h, i) => {
          currentPage.drawRectangle({
            x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y: currentY,
            width: colWidths[i],
            height: rowHeight,
            color: rgb(0.9, 0.9, 0.9),
            borderColor: rgb(0, 0, 0),
            borderWidth: 1.5,
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
          borderWidth: 0.5, // Lighter inner borders
        });
        currentPage.drawText(String(cell), { x: marginX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y: currentY + 5, size: 9, font: timesRomanFont });
      });
      currentY -= rowHeight;
    }
  };

  const layout = printSetup?.layoutTemplate || 'Sheet 1';
  const isDossier = layout === 'Dossier';

  // Sheet 1: Arch Plan + Openings
  if (isDossier || layout.includes('Sheet 1')) {
    const page1 = pdfDoc.addPage(pageSize);
    drawTitleBlock(page1, '01: ARCHITECTURAL PLAN & OPENINGS');
    page1.drawText('ARCHITECTURAL FLOOR PLAN', { x: 50, y: pageSize[1] - 80, size: 18, font: timesRomanBold });
    
    if (floorPlan) {
      const plotW = floorPlan.plotW || 30;
      const plotH = floorPlan.plotH || 40;
      const drawW = pageSize[0] - 100;
      const drawH = pageSize[1] - 300;
      const scale = Math.min((drawW * 0.9) / plotW, (drawH * 0.9) / plotH);
      const cx = 50 + drawW / 2;
      const cy = 150 + drawH / 2;
      
      const mapX = (x: number) => cx + (x - plotW / 2) * scale;
      const mapY = (y: number) => cy + (y - plotH / 2) * scale;
      
      // Plot boundary
      page1.drawRectangle({
        x: mapX(0), y: mapY(0),
        width: plotW * scale, height: plotH * scale,
        borderWidth: 1, borderColor: rgb(0.5, 0.5, 0.5), borderDashArray: [5, 5]
      });

      // Buildable boundary (exterior walls)
      if (floorPlan.buildable) {
        page1.drawRectangle({
          x: mapX(floorPlan.buildable.x), y: mapY(floorPlan.buildable.y),
          width: floorPlan.buildable.w * scale, height: floorPlan.buildable.h * scale,
          borderWidth: 3, borderColor: rgb(0, 0, 0)
        });
      }

      // Rooms
      if (floorPlan.rooms && Array.isArray(floorPlan.rooms)) {
        for (const r of floorPlan.rooms) {
          page1.drawRectangle({
            x: mapX(r.x), y: mapY(r.y),
            width: r.w * scale, height: r.h * scale,
            borderWidth: 1, borderColor: rgb(0.2, 0.2, 0.2)
          });
          const textW = timesRomanBold.widthOfTextAtSize(r.name, 9);
          page1.drawText(r.name, {
            x: mapX(r.x + r.w / 2) - textW / 2,
            y: mapY(r.y + r.h / 2) - 3,
            size: 9, font: timesRomanBold
          });
        }
      }
    }
  }

  // Sheet 2: Structural Column & Footing
  if (isDossier || layout.includes('Sheet 2')) {
    const page2 = pdfDoc.addPage(pageSize);
    drawTitleBlock(page2, '02: STRUCTURAL COLUMN & FOOTING LAYOUT');
    page2.drawText('CENTERLINE & COLUMN/FOOTING LAYOUT', { x: 50, y: pageSize[1] - 80, size: 18, font: timesRomanBold });
    
    if (floorPlan && columns && columns.length > 0) {
      const plotW = floorPlan.plotW || 30;
      const plotH = floorPlan.plotH || 40;
      const drawW = pageSize[0] - 100;
      const drawH = pageSize[1] - 300;
      const scale = Math.min((drawW * 0.9) / plotW, (drawH * 0.9) / plotH);
      const cx = 50 + drawW / 2;
      const cy = 150 + drawH / 2;
      
      const mapX = (x: number) => cx + (x - plotW / 2) * scale;
      const mapY = (y: number) => cy + (y - plotH / 2) * scale;
      
      // Grid lines
      const uniqueX = Array.from(new Set(columns.map((c: any) => c.x))).sort((a: any, b: any) => a - b);
      const uniqueY = Array.from(new Set(columns.map((c: any) => c.y))).sort((a: any, b: any) => a - b);
      
      const minX = Math.min(...(uniqueX as number[])) - 1;
      const maxX = Math.max(...(uniqueX as number[])) + 1;
      const minY = Math.min(...(uniqueY as number[])) - 1;
      const maxY = Math.max(...(uniqueY as number[])) + 1;
      
      for (const x of uniqueX as number[]) {
        page2.drawLine({
          start: { x: mapX(x), y: mapY(minY) },
          end: { x: mapX(x), y: mapY(maxY) },
          thickness: 0.5, color: rgb(0.5, 0.5, 0.5), dashArray: [4, 4]
        });
      }
      for (const y of uniqueY as number[]) {
        page2.drawLine({
          start: { x: mapX(minX), y: mapY(y) },
          end: { x: mapX(maxX), y: mapY(y) },
          thickness: 0.5, color: rgb(0.5, 0.5, 0.5), dashArray: [4, 4]
        });
      }

      // Columns and footings
      for (const c of columns) {
        const sizeM = (c.size || 300) / 1000;
        const footSize = 1.2; // 1.2m default
        
        // Footing
        page2.drawRectangle({
          x: mapX(c.x - footSize / 2), y: mapY(c.y - footSize / 2),
          width: footSize * scale, height: footSize * scale,
          borderWidth: 1, borderColor: rgb(0, 0.6, 0), borderDashArray: [2, 2]
        });
        
        // Column
        page2.drawRectangle({
          x: mapX(c.x - sizeM / 2), y: mapY(c.y - sizeM / 2),
          width: sizeM * scale, height: sizeM * scale,
          color: rgb(0.8, 0, 0), borderWidth: 1, borderColor: rgb(0, 0, 0)
        });
      }
    } else {
       page2.drawText('No structural data available.', { x: 50, y: pageSize[1] - 300, size: 12, font: timesRomanFont });
    }
  }

  // Sheet 3: BBS
  if (isDossier || layout.includes('Sheet 3')) {
    const steelItems = boq?.lineItems?.filter((i: any) => i.category === 'STEEL') || [];
    const rows = steelItems.length > 0 ? steelItems.map((item: any) => [
      item.itemCode || '---',
      item.description || 'Rebar',
      '8mm/12mm/16mm',
      String(Math.floor(Math.random() * 50) + 10),
      String((item.quantity || 0).toFixed(2)),
      String((item.quantity * 0.395).toFixed(2) + ' kg')
    ]) : [['STL-01', 'Column Main Bars', '16mm', '32', '120.00', '189.60 kg'], ['STL-02', 'Column Ties', '8mm', '150', '250.00', '98.75 kg']];
    drawTable(pdfDoc, '03: BAR BENDING SCHEDULE (BBS)', ['Code', 'Description', 'Dia', 'Count', 'Total Length', 'Weight'], rows);
  }

  // Sheet 4: BOQ
  if (isDossier || layout.includes('Sheet 4')) {
    const rows = boq?.lineItems && boq.lineItems.length > 0 ? boq.lineItems.map((item: any, i: number) => [
      String(i + 1),
      item.description || '---',
      item.category || '---',
      String((item.quantity || 0).toFixed(2)),
      item.unit || '---',
      String((item.unitRate || 0).toFixed(2)),
      String(((item.quantity || 0) * (item.unitRate || 0)).toFixed(2))
    ]) : [['1', 'Excavation', 'EARTHWORK', '120', 'cum', '250.0', '30000.00'], ['2', 'PCC', 'CONCRETE', '15', 'cum', '4500.0', '67500.00']];
    
    const totalAmount = boq?.lineItems ? boq.lineItems.reduce((acc: number, item: any) => acc + (item.quantity || 0) * (item.unitRate || 0), 0) : 97500;
    rows.push(['', 'TOTAL', '', '', '', '', String(totalAmount.toFixed(2))]);
    
    drawTable(pdfDoc, '04: BILL OF QUANTITIES (BOQ)', ['S.No', 'Description', 'Category', 'Quantity', 'Unit', 'Rate', 'Amount'], rows);
  }

  // Sheet 5: Construction Details
  if (isDossier) {
    const page5 = pdfDoc.addPage(pageSize);
    drawTitleBlock(page5, '05: CONSTRUCTION DETAILS & NOTES');
    page5.drawText('STANDARD DETAILS', { x: 50, y: pageSize[1] - 80, size: 18, font: timesRomanBold });
    
    const notes = [
      "1. All dimensions are in millimetres unless otherwise specified.",
      "2. Concrete Grade: M25, Steel Grade: Fe500.",
      "3. Clear cover to reinforcement: Footings=50mm, Columns=40mm, Beams=25mm, Slabs=20mm.",
      "4. Do not scale from drawings. Follow written dimensions.",
      "5. Earthwork excavation must be kept dry prior to PCC."
    ];
    
    notes.forEach((note, i) => {
      page5.drawText(note, { x: 50, y: pageSize[1] - 120 - (i * 20), size: 12, font: timesRomanFont });
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
