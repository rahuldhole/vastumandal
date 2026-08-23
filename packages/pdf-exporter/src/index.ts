import { FloorPlan, Column, BOQReport } from '@vastumandal/dwg-schemas';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function exportToPdf(floorPlan: FloorPlan, columns: Column[], boq: BOQReport): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const drawTitleBlock = (page: any, title: string) => {
    const { width, height } = page.getSize();
    
    // Border
    page.drawRectangle({
      x: 20, y: 20, width: width - 40, height: height - 40,
      borderWidth: 2, borderColor: rgb(0, 0, 0),
    });

    // Title Block Area (Bottom Right)
    page.drawRectangle({
      x: width - 200, y: 20, width: 180, height: 80,
      borderWidth: 1, borderColor: rgb(0, 0, 0),
    });

    page.drawText('VastuMandal Generated Set', { x: width - 190, y: 80, size: 10, font: timesRomanBold });
    page.drawText(title, { x: width - 190, y: 60, size: 12, font: timesRomanBold });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: width - 190, y: 40, size: 10, font: timesRomanFont });
  };

  // Sheet 1: Cover / Location
  const coverPage = pdfDoc.addPage([595.28, 841.89]); // A4
  drawTitleBlock(coverPage, '01: COVER & LOCATION');
  coverPage.drawText('PROJECT LOCATION PLAN', { x: 50, y: 750, size: 24, font: timesRomanBold });
  coverPage.drawText('Project Details Here', { x: 50, y: 720, size: 14, font: timesRomanFont });

  // Sheet 2: Centerline Layout
  const centerlinePage = pdfDoc.addPage([595.28, 841.89]);
  drawTitleBlock(centerlinePage, '02: CENTERLINE LAYOUT');
  centerlinePage.drawText('CENTERLINE GRID & COLUMNS', { x: 50, y: 750, size: 18, font: timesRomanBold });
  
  let currentY = 700;
  for (const col of columns.slice(0, 10)) { // limit for demo
    centerlinePage.drawText(`C${col.id} - W:${col.width} D:${col.depth} at (${col.center.x.toFixed(1)}, ${col.center.y.toFixed(1)})`, {
      x: 50, y: currentY, size: 12, font: timesRomanFont
    });
    currentY -= 15;
  }

  // Sheet 3: Footing Schedule
  const footingPage = pdfDoc.addPage([595.28, 841.89]);
  drawTitleBlock(footingPage, '03: FOOTING SCHEDULE');
  footingPage.drawText('FOUNDATION SCHEDULE', { x: 50, y: 750, size: 18, font: timesRomanBold });
  footingPage.drawText('Details generated from core-structural.', { x: 50, y: 720, size: 12, font: timesRomanFont });

  // Sheet 4: BBS
  const bbsPage = pdfDoc.addPage([595.28, 841.89]);
  drawTitleBlock(bbsPage, '04: BAR BENDING SCHEDULE');
  bbsPage.drawText('BAR BENDING SCHEDULE', { x: 50, y: 750, size: 18, font: timesRomanBold });
  
  if (boq && boq.lineItems) {
    let bbsY = 700;
    const steelItems = boq.lineItems.filter(item => item.category === 'STEEL');
    for (const item of steelItems) {
      bbsPage.drawText(`${item.itemCode}: ${item.description}`, { x: 50, y: bbsY, size: 10, font: timesRomanBold });
      bbsPage.drawText(`${item.quantity.toFixed(2)} ${item.unit} @ Rate ${item.unitRate}`, { x: 50, y: bbsY - 15, size: 10, font: timesRomanFont });
      bbsY -= 40;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
