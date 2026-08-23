import DXFWriter from 'dxf-writer';
import type { BeamScheduleRow, ColumnScheduleRow, SlabScheduleRow, FoundationScheduleRow, TankScheduleRow, StairsScheduleRow, TitleBlockRow } from '@rdcad-express/dwg-schemas';


export class ScriptWriter {
  commands: string[] = [];
  
  addLayer(name: string, color: number, lineType: string) {
    let c = 7;
    if (color === 1) c = 1;
    else if (color === 2) c = 2;
    else if (color === 3) c = 3;
    else if (color === 4) c = 4;
    else if (color === 5) c = 5;
    else if (color === 6) c = 6;
    this.commands.push(`_-LAYER M ${name} C ${c}  `);
  }
  setActiveLayer(name: string) {
    this.commands.push(`_-LAYER S ${name} `);
  }
  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.commands.push(`_LINE ${x1.toFixed(3)},${y1.toFixed(3)} ${x2.toFixed(3)},${y2.toFixed(3)} `);
  }
  drawCircle(x: number, y: number, r: number) {
    this.commands.push(`_CIRCLE ${x.toFixed(3)},${y.toFixed(3)} ${r.toFixed(3)} `);
  }
  drawText(x: number, y: number, height: number, rotation: number, text: string) {
    this.commands.push(`_TEXT ${x.toFixed(3)},${y.toFixed(3)} ${height.toFixed(3)} ${rotation.toFixed(3)} ${text} `);
  }
  getScriptString(): string {
    return this.commands.join('\n') + '\n_ZOOM E\n';
  }
}


function drawBeamSection(dxf: any, data: BeamScheduleRow) {
  

  dxf.addLayer('CONCRETE', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer('REBAR', DXFWriter.ACI.RED, 'CONTINUOUS');

  const w = data.width;
  const d = data.depth;

  // Concrete outline
  dxf.setActiveLayer('CONCRETE');
  dxf.drawLine(0, 0, w, 0);
  dxf.drawLine(w, 0, w, d);
  dxf.drawLine(w, d, 0, d);
  dxf.drawLine(0, d, 0, 0);

  // Stirrup
  dxf.setActiveLayer('REBAR');
  const cover = 40; // 40mm cover
  dxf.drawLine(cover, cover, w - cover, cover);
  dxf.drawLine(w - cover, cover, w - cover, d - cover);
  dxf.drawLine(w - cover, d - cover, cover, d - cover);
  dxf.drawLine(cover, d - cover, cover, cover);

  // Main Bars (Top and Bottom)
  const barRadius = (data.bottomBarDia || 16) / 2;
  // Bottom bars
  const spacingX = (w - 2 * cover) / (data.bottomBarCount - 1 || 1);
  for (let i = 0; i < data.bottomBarCount; i++) {
    dxf.drawCircle(cover + i * spacingX, cover, barRadius);
  }

  // Top bars
  const topBars = data.topExtraLeft + data.topExtraRight || 2; 
  const topSpacingX = (w - 2 * cover) / (topBars - 1 || 1);
  for (let i = 0; i < topBars; i++) {
    dxf.drawCircle(cover + i * topSpacingX, d - cover, barRadius);
  }

  }

export function exportBeamSectionToDXF(data: BeamScheduleRow): string {
  const dxf = new DXFWriter();
  drawBeamSection(dxf, data);
  return getDxfStringWithExtents(dxf);
}

export function exportBeamSectionToScript(data: BeamScheduleRow): string {
  const script = new ScriptWriter();
  drawBeamSection(script, data);
  return script.getScriptString();
}

function drawColumnSection(dxf: any, data: ColumnScheduleRow) {
  
  
  dxf.addLayer('CONCRETE', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer('REBAR', DXFWriter.ACI.RED, 'CONTINUOUS');

  const w = data.width || 400;
  const d = data.depth || 400;
  
  dxf.setActiveLayer('CONCRETE');
  dxf.drawLine(0, 0, w, 0);
  dxf.drawLine(w, 0, w, d);
  dxf.drawLine(w, d, 0, d);
  dxf.drawLine(0, d, 0, 0);
  
  dxf.setActiveLayer('REBAR');
  const cover = 40;
  const tw = w - 2 * cover;
  const td = d - 2 * cover;
  
  // Draw tie
  dxf.drawLine(cover, cover, cover + tw, cover);
  dxf.drawLine(cover + tw, cover, cover + tw, cover + td);
  dxf.drawLine(cover + tw, cover + td, cover, cover + td);
  dxf.drawLine(cover, cover + td, cover, cover);

  // Draw main bars
  const barRadius = (data.mainBarDia || 16) / 2;
  const count = data.mainBarCount || 4;
  const totalPerimeter = 2 * tw + 2 * td;
  const spacing = totalPerimeter / count;

  let currentDist = 0;
  for (let i = 0; i < count; i++) {
    let x = cover;
    let y = cover;
    if (currentDist <= tw) {
      x = cover + currentDist;
      y = cover;
    } else if (currentDist <= tw + td) {
      x = cover + tw;
      y = cover + (currentDist - tw);
    } else if (currentDist <= 2 * tw + td) {
      x = cover + tw - (currentDist - tw - td);
      y = cover + td;
    } else {
      x = cover;
      y = cover + td - (currentDist - 2 * tw - td);
    }
    dxf.drawCircle(x, y, barRadius);
    currentDist += spacing;
  }
  
  }

export function exportColumnSectionToDXF(data: ColumnScheduleRow): string {
  const dxf = new DXFWriter();
  drawColumnSection(dxf, data);
  return getDxfStringWithExtents(dxf);
}

export function exportColumnSectionToScript(data: ColumnScheduleRow): string {
  const script = new ScriptWriter();
  drawColumnSection(script, data);
  return script.getScriptString();
}

function drawTextNodes(dxf: any, nodes: { id: string, text: string, x: number, y: number }[]) {
  
  
  dxf.addLayer('TEXT', DXFWriter.ACI.YELLOW, 'CONTINUOUS');
  dxf.setActiveLayer('TEXT');
  
  nodes.forEach(node => {
    // Assuming dxf-writer supports drawText. If not, this is standard API pattern for DXFWriter
    try {
      // height: 25, rotation: 0
      dxf.drawText(node.x, -node.y, 25, 0, node.text);
    } catch(e) {
       // fallback for different library signatures if needed
    }
  });
  
  }

export function exportTextNodesToDXF(nodes: { id: string, text: string, x: number, y: number }[]): string {
  const dxf = new DXFWriter();
  drawTextNodes(dxf, nodes);
  return getDxfStringWithExtents(dxf);
}

export function exportTextNodesToScript(nodes: { id: string, text: string, x: number, y: number }[]): string {
  const script = new ScriptWriter();
  drawTextNodes(script, nodes);
  return script.getScriptString();
}

function drawSlabSection(dxf: any, data: SlabScheduleRow) {
  
  dxf.addLayer('CONCRETE', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer('REBAR', DXFWriter.ACI.RED, 'CONTINUOUS');
  
  dxf.setActiveLayer('CONCRETE');
  dxf.drawLine(0, 0, data.lx, 0);
  dxf.drawLine(data.lx, 0, data.lx, data.depth);
  dxf.drawLine(data.lx, data.depth, 0, data.depth);
  dxf.drawLine(0, data.depth, 0, 0);
  
  dxf.setActiveLayer('REBAR');
  const cover = 25;
  const lx = data.lx;
  
  // Main bar (continuous line at bottom)
  dxf.drawLine(cover, cover, lx - cover, cover);
  
  // Distribution bars (dots resting on main bar)
  const distBarRadius = (data.distBarDia || 8) / 2;
  const mainBarDia = data.mainBarDia || 10;
  const distBarY = cover + mainBarDia / 2 + distBarRadius;
  
  const numDistBars = Math.floor((lx - 2 * cover) / (data.distBarSpacing || 200)) + 1;
  const actualSpacing = (lx - 2 * cover) / (numDistBars - 1 || 1);
  
  for (let i = 0; i < numDistBars; i++) {
    dxf.drawCircle(cover + i * actualSpacing, distBarY, distBarRadius);
  }
  
  }

export function exportSlabSectionToDXF(data: SlabScheduleRow): string {
  const dxf = new DXFWriter();
  drawSlabSection(dxf, data);
  return getDxfStringWithExtents(dxf);
}

export function exportSlabSectionToScript(data: SlabScheduleRow): string {
  const script = new ScriptWriter();
  drawSlabSection(script, data);
  return script.getScriptString();
}

function drawFoundationSection(dxf: any, data: FoundationScheduleRow) {
  
  dxf.addLayer('CONCRETE', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer('REBAR', DXFWriter.ACI.RED, 'CONTINUOUS');
  
  dxf.setActiveLayer('CONCRETE');
  dxf.drawLine(0, 0, data.lx, 0);
  dxf.drawLine(data.lx, 0, data.lx, data.depth);
  dxf.drawLine(data.lx, data.depth, 0, data.depth);
  dxf.drawLine(0, data.depth, 0, 0);
  
  dxf.setActiveLayer('REBAR');
  const cover = 50;
  const lx = data.lx;
  
  // Mesh X (continuous line at bottom)
  dxf.drawLine(cover, cover, lx - cover, cover);
  
  // Mesh Y (dots resting on Mesh X)
  const yBarRadius = (data.meshBarDiaY || 10) / 2;
  const xBarDia = data.meshBarDiaX || 10;
  const yBarY = cover + xBarDia / 2 + yBarRadius;
  
  const numYBars = Math.floor((lx - 2 * cover) / (data.meshBarSpacingY || 150)) + 1;
  const actualSpacing = (lx - 2 * cover) / (numYBars - 1 || 1);
  
  for (let i = 0; i < numYBars; i++) {
    dxf.drawCircle(cover + i * actualSpacing, yBarY, yBarRadius);
  }
  
  }

export function exportFoundationSectionToDXF(data: FoundationScheduleRow): string {
  const dxf = new DXFWriter();
  drawFoundationSection(dxf, data);
  return getDxfStringWithExtents(dxf);
}

export function exportFoundationSectionToScript(data: FoundationScheduleRow): string {
  const script = new ScriptWriter();
  drawFoundationSection(script, data);
  return script.getScriptString();
}

function drawTankSection(dxf: any, data: TankScheduleRow) {
  
  dxf.addLayer('CONCRETE', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer('REBAR', DXFWriter.ACI.RED, 'CONTINUOUS');
  
  dxf.setActiveLayer('CONCRETE');
  
  const outerW = data.width + (2 * data.wallThickness);
  const outerH = data.height + data.wallThickness; // height is internal height, base slab is wallThickness
  const wt = data.wallThickness;
  
  // Outer wall
  dxf.drawLine(0, 0, outerW, 0);
  dxf.drawLine(outerW, 0, outerW, outerH);
  dxf.drawLine(outerW, outerH, outerW - wt, outerH); // right top
  
  // Inner wall (right)
  dxf.drawLine(outerW - wt, outerH, outerW - wt, wt);
  
  // Inner base
  dxf.drawLine(outerW - wt, wt, wt, wt);
  
  // Inner wall (left)
  dxf.drawLine(wt, wt, wt, outerH);
  
  // left top
  dxf.drawLine(wt, outerH, 0, outerH);
  dxf.drawLine(0, outerH, 0, 0); // left outer
  
  dxf.setActiveLayer('REBAR');
  const cover = 40;
  
  // Continuous U-shape rebar at inner face
  // Base slab bottom
  dxf.drawLine(cover, cover, outerW - cover, cover);
  // Right wall outer
  dxf.drawLine(outerW - cover, cover, outerW - cover, outerH - cover);
  // Right wall inner
  dxf.drawLine(outerW - wt + cover, outerH - cover, outerW - wt + cover, wt - cover);
  // Base slab top
  dxf.drawLine(outerW - wt + cover, wt - cover, wt - cover, wt - cover);
  // Left wall inner
  dxf.drawLine(wt - cover, wt - cover, wt - cover, outerH - cover);
  // Left wall outer
  dxf.drawLine(cover, outerH - cover, cover, cover);
  // Connect at tops (hooks)
  dxf.drawLine(outerW - cover, outerH - cover, outerW - wt + cover, outerH - cover);
  dxf.drawLine(cover, outerH - cover, wt - cover, outerH - cover);
  
  // Distribution bars (dots)
  const barRadius = (data.mainBarDia || 12) / 2;
  const spacing = data.mainBarSpacing || 150;
  
  // Base slab bottom distribution bars (full width)
  const numBaseBottomBars = Math.floor((outerW - 2 * cover) / spacing) + 1;
  const actualBaseBottomSpacing = (outerW - 2 * cover) / (numBaseBottomBars - 1 || 1);
  for (let i = 0; i < numBaseBottomBars; i++) {
    const x = cover + i * actualBaseBottomSpacing;
    dxf.drawCircle(x, cover + barRadius * 2, barRadius);
  }
  
  // Base slab top inner distribution bars
  const innerBaseW = outerW - 2 * wt;
  if (innerBaseW > 2 * cover) {
    const numBaseTopBars = Math.floor((innerBaseW - 2 * cover) / spacing) + 1;
    const actualBaseTopSpacing = (innerBaseW - 2 * cover) / (numBaseTopBars - 1 || 1);
    for (let i = 0; i < numBaseTopBars; i++) {
      const x = wt + cover + i * actualBaseTopSpacing;
      dxf.drawCircle(x, wt - cover - barRadius * 2, barRadius);
    }
  }
  
  // Outer wall distribution bars (full height from cover to outerH - cover)
  const numWallOuterBars = Math.floor((outerH - 2 * cover) / spacing) + 1;
  const actualWallOuterSpacing = (outerH - 2 * cover) / (numWallOuterBars - 1 || 1);
  for (let i = 0; i < numWallOuterBars; i++) {
    const y = cover + i * actualWallOuterSpacing;
    dxf.drawCircle(cover + barRadius * 2, y, barRadius); // left outer
    dxf.drawCircle(outerW - cover - barRadius * 2, y, barRadius); // right outer
  }
  
  // Inner wall distribution bars (from wt + cover to outerH - cover)
  const innerWallH = outerH - wt;
  if (innerWallH > 2 * cover) {
    const numWallInnerBars = Math.floor((innerWallH - 2 * cover) / spacing) + 1;
    const actualWallInnerSpacing = (innerWallH - 2 * cover) / (numWallInnerBars - 1 || 1);
    for (let i = 0; i < numWallInnerBars; i++) {
      const y = wt + cover + i * actualWallInnerSpacing;
      dxf.drawCircle(wt - cover - barRadius * 2, y, barRadius); // left inner
      dxf.drawCircle(outerW - wt + cover + barRadius * 2, y, barRadius); // right inner
    }
  }

  }

export function exportTankSectionToDXF(data: TankScheduleRow): string {
  const dxf = new DXFWriter();
  drawTankSection(dxf, data);
  return getDxfStringWithExtents(dxf);
}

export function exportTankSectionToScript(data: TankScheduleRow): string {
  const script = new ScriptWriter();
  drawTankSection(script, data);
  return script.getScriptString();
}

function drawStairsSection(dxf: any, data: StairsScheduleRow) {
  
  dxf.addLayer('CONCRETE', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer('REBAR', DXFWriter.ACI.RED, 'CONTINUOUS');
  
  dxf.setActiveLayer('CONCRETE');
  const tread = data.tread || 250;
  const rise = data.rise || 150;
  const steps = data.numberOfSteps || 10;
  const waist = data.waistSlabThickness || 150;
  
  // Draw the zig-zag steps
  let currentX = 0;
  let currentY = 0;
  
  for (let i = 0; i < steps; i++) {
    // Riser (vertical up)
    dxf.drawLine(currentX, currentY, currentX, currentY + rise);
    currentY += rise;
    
    // Tread (horizontal right)
    dxf.drawLine(currentX, currentY, currentX + tread, currentY);
    currentX += tread;
  }
  
  // Draw the waist slab
  // Calculate the angle of the stairs
  const angle = Math.atan2(rise, tread);
  // Vertical offset to draw waist slab parallel to the nosing line
  const waistOffset = waist / Math.cos(angle);
  
  // Bottom line of waist slab
  const bottomStartX = 0;
  const bottomStartY = -waistOffset;
  const bottomEndX = currentX;
  const bottomEndY = currentY - rise - waistOffset;
  
  dxf.drawLine(bottomStartX, bottomStartY, bottomEndX, bottomEndY);
  dxf.drawLine(0, 0, bottomStartX, bottomStartY); // Connect start
  dxf.drawLine(currentX, currentY, bottomEndX, bottomEndY + rise); // Connect end (approx)
  
  // Rebar implementation (simplified main and distribution bars)
  dxf.setActiveLayer('REBAR');
  const cover = 25;
  const mainBarDia = data.mainBarDia || 12;
  const distBarDia = data.distBarDia || 8;
  
  // Main bar parallel to waist
  const rebarOffset = (waist - cover * 2) / Math.cos(angle);
  const rx1 = 0 + cover;
  const ry1 = bottomStartY + cover;
  const rx2 = bottomEndX - cover;
  const ry2 = bottomEndY + cover;
  dxf.drawLine(rx1, ry1, rx2, ry2);
  
  }

export function exportStairsSectionToDXF(data: StairsScheduleRow): string {
  const dxf = new DXFWriter();
  drawStairsSection(dxf, data);
  return getDxfStringWithExtents(dxf);
}

export function exportStairsSectionToScript(data: StairsScheduleRow): string {
  const script = new ScriptWriter();
  drawStairsSection(script, data);
  return script.getScriptString();
}

// ==========================================
// Milestone 7: Starter Asset Library
// ==========================================

export function exportDoorDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('DOOR', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('DOOR');
  
  // Standard 900mm door
  const width = 900;
  const frameThickness = 50;
  
  // Left frame
  dxf.drawLine(0, 0, frameThickness, 0);
  dxf.drawLine(frameThickness, 0, frameThickness, 150);
  dxf.drawLine(frameThickness, 150, 0, 150);
  dxf.drawLine(0, 150, 0, 0);
  
  // Right frame
  dxf.drawLine(width - frameThickness, 0, width, 0);
  dxf.drawLine(width, 0, width, 150);
  dxf.drawLine(width, 150, width - frameThickness, 150);
  dxf.drawLine(width - frameThickness, 150, width - frameThickness, 0);
  
  // Door leaf
  dxf.drawLine(frameThickness, 150, frameThickness, width - frameThickness + 150);
  
  // Door swing (arc simulation)
  const steps = 10;
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI / 2) * (i / steps);
    const a2 = (Math.PI / 2) * ((i + 1) / steps);
    const r = width - 2 * frameThickness;
    const x1 = frameThickness + r * Math.sin(a1);
    const y1 = 150 + r * Math.cos(a1);
    const x2 = frameThickness + r * Math.sin(a2);
    const y2 = 150 + r * Math.cos(a2);
    dxf.drawLine(x1, y1, x2, y2);
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportWindowDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('WINDOW', DXFWriter.ACI.GREEN, 'CONTINUOUS');
  dxf.setActiveLayer('WINDOW');
  
  // Standard 1200mm window
  const width = 1200;
  const depth = 200;
  
  // Outer frame
  dxf.drawLine(0, 0, width, 0);
  dxf.drawLine(width, 0, width, depth);
  dxf.drawLine(width, depth, 0, depth);
  dxf.drawLine(0, depth, 0, 0);
  
  // Glass panes (3 lines)
  dxf.drawLine(0, depth / 2 - 10, width, depth / 2 - 10);
  dxf.drawLine(0, depth / 2, width, depth / 2);
  dxf.drawLine(0, depth / 2 + 10, width, depth / 2 + 10);
  
  return getDxfStringWithExtents(dxf);
}

export function exportNorthSymbolDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('SYMBOL', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.setActiveLayer('SYMBOL');
  
  // Draw an N
  dxf.drawLine(-50, 200, -50, 300);
  dxf.drawLine(-50, 300, 50, 200);
  dxf.drawLine(50, 200, 50, 300);
  
  // Draw arrow
  dxf.drawLine(0, 0, 0, 150);
  dxf.drawLine(0, 150, -30, 100);
  dxf.drawLine(0, 150, 30, 100);
  
  // Draw base circle
  const steps = 16;
  const r = 50;
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI * 2) * (i / steps);
    const a2 = (Math.PI * 2) * ((i + 1) / steps);
    dxf.drawLine(r * Math.cos(a1), r * Math.sin(a1), r * Math.cos(a2), r * Math.sin(a2));
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportDoubleDoorDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('DOOR', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('DOOR');
  
  const width = 1800; // Total width for double doors
  const halfWidth = width / 2;
  const frameThickness = 50;
  
  // Left frame
  dxf.drawLine(0, 0, frameThickness, 0);
  dxf.drawLine(frameThickness, 0, frameThickness, 150);
  dxf.drawLine(frameThickness, 150, 0, 150);
  dxf.drawLine(0, 150, 0, 0);
  
  // Right frame
  dxf.drawLine(width - frameThickness, 0, width, 0);
  dxf.drawLine(width, 0, width, 150);
  dxf.drawLine(width, 150, width - frameThickness, 150);
  dxf.drawLine(width - frameThickness, 150, width - frameThickness, 0);
  
  // Left leaf
  dxf.drawLine(frameThickness, 150, frameThickness, halfWidth + 150);
  
  // Right leaf
  dxf.drawLine(width - frameThickness, 150, width - frameThickness, halfWidth + 150);
  
  // Left door swing
  const steps = 10;
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI / 2) * (i / steps);
    const a2 = (Math.PI / 2) * ((i + 1) / steps);
    const r = halfWidth - frameThickness;
    const x1 = frameThickness + r * Math.sin(a1);
    const y1 = 150 + r * Math.cos(a1);
    const x2 = frameThickness + r * Math.sin(a2);
    const y2 = 150 + r * Math.cos(a2);
    dxf.drawLine(x1, y1, x2, y2);
  }

  // Right door swing
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI / 2) * (i / steps);
    const a2 = (Math.PI / 2) * ((i + 1) / steps);
    const r = halfWidth - frameThickness;
    const x1 = width - frameThickness - r * Math.sin(a1);
    const y1 = 150 + r * Math.cos(a1);
    const x2 = width - frameThickness - r * Math.sin(a2);
    const y2 = 150 + r * Math.cos(a2);
    dxf.drawLine(x1, y1, x2, y2);
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportSlidingDoorDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('DOOR', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('DOOR');
  
  const width = 2000;
  const frameThickness = 50;
  const depth = 150;
  
  // Frames
  dxf.drawLine(0, 0, frameThickness, 0);
  dxf.drawLine(frameThickness, 0, frameThickness, depth);
  dxf.drawLine(frameThickness, depth, 0, depth);
  dxf.drawLine(0, depth, 0, 0);
  
  dxf.drawLine(width - frameThickness, 0, width, 0);
  dxf.drawLine(width, 0, width, depth);
  dxf.drawLine(width, depth, width - frameThickness, depth);
  dxf.drawLine(width - frameThickness, depth, width - frameThickness, 0);
  
  // Track
  dxf.drawLine(frameThickness, depth / 2, width - frameThickness, depth / 2);
  
  // Sliding Panels
  const panelWidth = (width - 2 * frameThickness) / 2 + 50; // overlapping
  dxf.drawLine(frameThickness, depth / 2 - 20, frameThickness + panelWidth, depth / 2 - 20); // Inner panel
  dxf.drawLine(width - frameThickness - panelWidth, depth / 2 + 20, width - frameThickness, depth / 2 + 20); // Outer panel
  
  return getDxfStringWithExtents(dxf);
}

export function exportGarageDoorDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('DOOR', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('DOOR');
  
  const width = 2400;
  const depth = 200;
  const frameThickness = 100;
  
  // Pillar frames
  dxf.drawLine(0, 0, frameThickness, 0);
  dxf.drawLine(frameThickness, 0, frameThickness, depth);
  dxf.drawLine(frameThickness, depth, 0, depth);
  dxf.drawLine(0, depth, 0, 0);
  
  dxf.drawLine(width - frameThickness, 0, width, 0);
  dxf.drawLine(width, 0, width, depth);
  dxf.drawLine(width, depth, width - frameThickness, depth);
  dxf.drawLine(width - frameThickness, depth, width - frameThickness, 0);
  
  // Roller line
  dxf.drawLine(frameThickness, depth / 2, width - frameThickness, depth / 2);
  
  // Dash lines for roller track
  dxf.drawLine(frameThickness + 100, depth / 2 + 50, frameThickness + 100, depth + 1000);
  dxf.drawLine(width - frameThickness - 100, depth / 2 + 50, width - frameThickness - 100, depth + 1000);
  
  return getDxfStringWithExtents(dxf);
}

export function exportSectionMarkerDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('ANNOTATION', DXFWriter.ACI.MAGENTA, 'CONTINUOUS');
  dxf.setActiveLayer('ANNOTATION');
  
  // Bubble
  const r = 50;
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI * 2) * (i / steps);
    const a2 = (Math.PI * 2) * ((i + 1) / steps);
    dxf.drawLine(r * Math.cos(a1), r * Math.sin(a1), r * Math.cos(a2), r * Math.sin(a2));
  }
  
  // Horizontal line through bubble
  dxf.drawLine(-r, 0, r, 0);
  
  // Directional arrow
  dxf.drawLine(0, r, 0, r + 50); // Stem
  dxf.drawLine(0, r + 50, -20, r + 20); // Left arrow tip
  dxf.drawLine(0, r + 50, 20, r + 20); // Right arrow tip
  
  // Tail line
  dxf.drawLine(0, -r, 0, -r - 100);
  dxf.drawLine(0, -r - 100, 200, -r - 100);
  
  return getDxfStringWithExtents(dxf);
}

export function exportElevationTargetDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('ANNOTATION', DXFWriter.ACI.MAGENTA, 'CONTINUOUS');
  dxf.setActiveLayer('ANNOTATION');
  
  const r = 40;
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI * 2) * (i / steps);
    const a2 = (Math.PI * 2) * ((i + 1) / steps);
    dxf.drawLine(r * Math.cos(a1), r * Math.sin(a1), r * Math.cos(a2), r * Math.sin(a2));
  }
  
  dxf.drawLine(-r - 10, 0, r + 10, 0);
  dxf.drawLine(0, -r - 10, 0, r + 10);
  
  // Hatch quadrant lines to simulate fill (top right)
  for (let x = 0; x <= r; x += 5) {
    const yMax = Math.sqrt(r*r - x*x);
    if (yMax > 0) dxf.drawLine(x, 0, x, yMax);
  }
  // Hatch quadrant lines (bottom left)
  for (let x = 0; x >= -r; x -= 5) {
    const yMin = -Math.sqrt(r*r - x*x);
    if (yMin < 0) dxf.drawLine(x, 0, x, yMin);
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportRevisionCloudDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('ANNOTATION', DXFWriter.ACI.RED, 'CONTINUOUS');
  dxf.setActiveLayer('ANNOTATION');
  
  const width = 1000;
  const height = 600;
  const arcRadius = 50;
  
  // Just approximate a simple rectangular cloud with semi-circles
  for (let x = 0; x < width; x += arcRadius * 2) {
    dxf.drawLine(x, 0, x + arcRadius, -arcRadius);
    dxf.drawLine(x + arcRadius, -arcRadius, x + arcRadius * 2, 0);
    
    dxf.drawLine(x, height, x + arcRadius, height + arcRadius);
    dxf.drawLine(x + arcRadius, height + arcRadius, x + arcRadius * 2, height);
  }
  
  for (let y = 0; y < height; y += arcRadius * 2) {
    dxf.drawLine(0, y, -arcRadius, y + arcRadius);
    dxf.drawLine(-arcRadius, y + arcRadius, 0, y + arcRadius * 2);
    
    dxf.drawLine(width, y, width + arcRadius, y + arcRadius);
    dxf.drawLine(width + arcRadius, y + arcRadius, width, y + arcRadius * 2);
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportGridBubbleDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('ANNOTATION', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('ANNOTATION');
  
  const r = 50;
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI * 2) * (i / steps);
    const a2 = (Math.PI * 2) * ((i + 1) / steps);
    dxf.drawLine(r * Math.cos(a1), r * Math.sin(a1), r * Math.cos(a2), r * Math.sin(a2));
  }
  
  // Extension line
  dxf.drawLine(0, -r, 0, -r - 500);
  
  return getDxfStringWithExtents(dxf);
}

// ==========================================
// Milestone 7: Asset Library (Phase 3: Furniture & Plumbing)
// ==========================================

export function exportDeskDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('FURNITURE', DXFWriter.ACI.YELLOW, 'CONTINUOUS');
  dxf.setActiveLayer('FURNITURE');
  
  const width = 1500;
  const depth = 750;
  
  // Desk outline
  dxf.drawLine(0, 0, width, 0);
  dxf.drawLine(width, 0, width, depth);
  dxf.drawLine(width, depth, 0, depth);
  dxf.drawLine(0, depth, 0, 0);
  
  // Draw a simple chair tucked in
  const chairW = 500;
  const chairD = 500;
  const chairX = (width - chairW) / 2;
  const chairY = -200; // tucked under the desk
  
  dxf.drawLine(chairX, chairY, chairX + chairW, chairY);
  dxf.drawLine(chairX + chairW, chairY, chairX + chairW, chairY + chairD);
  dxf.drawLine(chairX + chairW, chairY + chairD, chairX, chairY + chairD);
  dxf.drawLine(chairX, chairY + chairD, chairX, chairY);
  
  // Chair backrest
  dxf.drawLine(chairX + 50, chairY + 50, chairX + chairW - 50, chairY + 50);
  
  return getDxfStringWithExtents(dxf);
}

export function exportConferenceTableDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('FURNITURE', DXFWriter.ACI.YELLOW, 'CONTINUOUS');
  dxf.setActiveLayer('FURNITURE');
  
  const width = 3000;
  const depth = 1200;
  
  // Table outline
  dxf.drawLine(0, 0, width, 0);
  dxf.drawLine(width, 0, width, depth);
  dxf.drawLine(width, depth, 0, depth);
  dxf.drawLine(0, depth, 0, 0);
  
  // Draw chairs around table
  const chairW = 500;
  const chairD = 500;
  
  const drawChair = (x: number, y: number, rotation: number) => {
    // simplified drawing for rotation: 0 (bottom), 1 (right), 2 (top), 3 (left)
    if (rotation === 0) { // Bottom (facing up)
      dxf.drawLine(x, y, x + chairW, y);
      dxf.drawLine(x + chairW, y, x + chairW, y + chairD);
      dxf.drawLine(x + chairW, y + chairD, x, y + chairD);
      dxf.drawLine(x, y + chairD, x, y);
      dxf.drawLine(x + 50, y - 50, x + chairW - 50, y - 50); // backrest
    } else if (rotation === 2) { // Top (facing down)
      dxf.drawLine(x, y, x + chairW, y);
      dxf.drawLine(x + chairW, y, x + chairW, y - chairD);
      dxf.drawLine(x + chairW, y - chairD, x, y - chairD);
      dxf.drawLine(x, y - chairD, x, y);
      dxf.drawLine(x + 50, y + 50, x + chairW - 50, y + 50); // backrest
    } else if (rotation === 1) { // Right (facing left)
      dxf.drawLine(x, y, x, y + chairW);
      dxf.drawLine(x, y + chairW, x - chairD, y + chairW);
      dxf.drawLine(x - chairD, y + chairW, x - chairD, y);
      dxf.drawLine(x - chairD, y, x, y);
      dxf.drawLine(x + 50, y + 50, x + 50, y + chairW - 50); // backrest
    } else if (rotation === 3) { // Left (facing right)
      dxf.drawLine(x, y, x, y + chairW);
      dxf.drawLine(x, y + chairW, x + chairD, y + chairW);
      dxf.drawLine(x + chairD, y + chairW, x + chairD, y);
      dxf.drawLine(x + chairD, y, x, y);
      dxf.drawLine(x - 50, y + 50, x - 50, y + chairW - 50); // backrest
    }
  };

  // 3 chairs on bottom
  drawChair(500, -200, 0);
  drawChair(1250, -200, 0);
  drawChair(2000, -200, 0);
  
  // 3 chairs on top
  drawChair(500, depth + 200, 2);
  drawChair(1250, depth + 200, 2);
  drawChair(2000, depth + 200, 2);
  
  // 1 chair on left
  drawChair(-200, 350, 3);
  
  // 1 chair on right
  drawChair(width + 200, 350, 1);

  return getDxfStringWithExtents(dxf);
}

export function exportToiletDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('PLUMBING', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('PLUMBING');
  
  // Cistern (Tank)
  dxf.drawLine(0, 0, 400, 0);
  dxf.drawLine(400, 0, 400, 200);
  dxf.drawLine(400, 200, 0, 200);
  dxf.drawLine(0, 200, 0, 0);
  
  // Bowl (Approximate with arcs or lines)
  const cx = 200;
  const cy = 200;
  
  // Base connection
  dxf.drawLine(120, 200, 120, 300);
  dxf.drawLine(280, 200, 280, 300);
  
  // Oval bowl approximation using polygon
  const rX = 180;
  const rY = 250;
  const steps = 16;
  const startY = 300 + rY; // center of oval
  
  for (let i = 0; i < steps; i++) {
    const a1 = Math.PI * (i / steps);
    const a2 = Math.PI * ((i + 1) / steps);
    // Draw only bottom half of the oval (0 to PI) relative to (cx, startY)
    const x1 = cx + rX * Math.cos(a1);
    const y1 = startY + rY * Math.sin(a1);
    const x2 = cx + rX * Math.cos(a2);
    const y2 = startY + rY * Math.sin(a2);
    dxf.drawLine(x1, y1, x2, y2);
  }
  
  // connect oval to base
  dxf.drawLine(cx + rX, startY, 280, 300);
  dxf.drawLine(cx - rX, startY, 120, 300);
  
  return getDxfStringWithExtents(dxf);
}

export function exportSinkDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('PLUMBING', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('PLUMBING');
  
  const width = 600;
  const depth = 450;
  
  // Outer basin edge
  dxf.drawLine(0, 0, width, 0);
  dxf.drawLine(width, 0, width, depth);
  dxf.drawLine(width, depth, 0, depth);
  dxf.drawLine(0, depth, 0, 0);
  
  // Inner bowl (offset by 50mm)
  const iw = width - 100;
  const id = depth - 100;
  dxf.drawLine(50, 50, 50 + iw, 50);
  dxf.drawLine(50 + iw, 50, 50 + iw, 50 + id);
  dxf.drawLine(50 + iw, 50 + id, 50, 50 + id);
  dxf.drawLine(50, 50 + id, 50, 50);
  
  // Drain circle
  const cx = width / 2;
  const cy = depth / 2;
  const r = 25;
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const a1 = (Math.PI * 2) * (i / steps);
    const a2 = (Math.PI * 2) * ((i + 1) / steps);
    dxf.drawLine(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }
  
  // Faucet body
  dxf.drawLine(cx - 30, depth - 20, cx + 30, depth - 20);
  dxf.drawLine(cx + 30, depth - 20, cx + 30, depth);
  dxf.drawLine(cx + 30, depth, cx - 30, depth);
  dxf.drawLine(cx - 30, depth, cx - 30, depth - 20);
  
  return getDxfStringWithExtents(dxf);
}

// ==========================================
// Milestone 7: Asset Library (Phase 4: Landscaping & Site)
// ==========================================

export function exportTreeDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('LANDSCAPING', DXFWriter.ACI.GREEN, 'CONTINUOUS');
  dxf.setActiveLayer('LANDSCAPING');
  
  const cx = 0;
  const cy = 0;
  const baseRadius = 2000;
  
  // Draw organic canopy (scalloped edge via sine wave perturbation)
  const steps = 36;
  const points = [];
  for (let i = 0; i < steps; i++) {
    const angle = (Math.PI * 2) * (i / steps);
    // Add a perturbation based on the angle to make it look like leaves/scallops
    const r = baseRadius + Math.sin(angle * 8) * 150 + Math.cos(angle * 5) * 100;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  
  // Close the loop
  for (let i = 0; i < steps; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % steps];
    dxf.drawLine(p1.x, p1.y, p2.x, p2.y);
  }
  
  // Draw recursive branches (simple fractal cross)
  const drawBranch = (x: number, y: number, angle: number, length: number, depth: number) => {
    if (depth === 0) return;
    const nx = x + length * Math.cos(angle);
    const ny = y + length * Math.sin(angle);
    dxf.drawLine(x, y, nx, ny);
    
    // Branch out
    drawBranch(nx, ny, angle - 0.5, length * 0.7, depth - 1);
    drawBranch(nx, ny, angle + 0.5, length * 0.7, depth - 1);
  };
  
  // Generate 4 main branches from center
  for (let i = 0; i < 4; i++) {
    drawBranch(cx, cy, (Math.PI / 2) * i, baseRadius * 0.4, 3);
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportShrubDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('LANDSCAPING', DXFWriter.ACI.GREEN, 'CONTINUOUS');
  dxf.setActiveLayer('LANDSCAPING');
  
  const cx = 0;
  const cy = 0;
  const baseRadius = 500;
  
  // Draw organic canopy
  const steps = 16;
  const points = [];
  for (let i = 0; i < steps; i++) {
    const angle = (Math.PI * 2) * (i / steps);
    const r = baseRadius + Math.sin(angle * 6) * 80;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  
  for (let i = 0; i < steps; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % steps];
    dxf.drawLine(p1.x, p1.y, p2.x, p2.y);
  }
  
  // Inner detail
  for (let i = 0; i < steps; i++) {
    const angle = (Math.PI * 2) * (i / steps);
    const r = baseRadius * 0.5 + Math.cos(angle * 4) * 40;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    const pNext = { x: cx + (r * 0.8) * Math.cos(angle + 0.2), y: cy + (r * 0.8) * Math.sin(angle + 0.2) };
    dxf.drawLine(px, py, pNext.x, pNext.y);
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportParkingBaysDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('SITE', DXFWriter.ACI.WHITE, 'CONTINUOUS');
  dxf.setActiveLayer('SITE');
  
  const bayWidth = 2500;
  const bayDepth = 5000;
  const numBays = 5;
  
  // Draw top and bottom boundary lines
  dxf.drawLine(0, 0, bayWidth * numBays, 0);
  dxf.drawLine(0, bayDepth, bayWidth * numBays, bayDepth);
  
  // Draw dividing lines
  for (let i = 0; i <= numBays; i++) {
    const x = i * bayWidth;
    dxf.drawLine(x, 0, x, bayDepth);
  }
  
  return getDxfStringWithExtents(dxf);
}

export function exportVehicleDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('SITE', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.setActiveLayer('SITE');
  
  const width = 1800;
  const length = 4500;
  
  // Main body bounding box
  dxf.drawLine(0, 0, width, 0);
  dxf.drawLine(width, 0, width, length);
  dxf.drawLine(width, length, 0, length);
  dxf.drawLine(0, length, 0, 0);
  
  // Windshield/Roof box
  const roofInsetX = 150;
  const hoodLength = 1000;
  const trunkLength = 800;
  const roofLength = length - hoodLength - trunkLength;
  
  dxf.drawLine(roofInsetX, trunkLength, width - roofInsetX, trunkLength);
  dxf.drawLine(width - roofInsetX, trunkLength, width - roofInsetX, trunkLength + roofLength);
  dxf.drawLine(width - roofInsetX, trunkLength + roofLength, roofInsetX, trunkLength + roofLength);
  dxf.drawLine(roofInsetX, trunkLength + roofLength, roofInsetX, trunkLength);
  
  // Side mirrors
  dxf.drawLine(0, trunkLength + roofLength, -100, trunkLength + roofLength);
  dxf.drawLine(-100, trunkLength + roofLength, -100, trunkLength + roofLength + 100);
  dxf.drawLine(-100, trunkLength + roofLength + 100, 0, trunkLength + roofLength + 150);
  
  dxf.drawLine(width, trunkLength + roofLength, width + 100, trunkLength + roofLength);
  dxf.drawLine(width + 100, trunkLength + roofLength, width + 100, trunkLength + roofLength + 100);
  dxf.drawLine(width + 100, trunkLength + roofLength + 100, width, trunkLength + roofLength + 150);
  
  return getDxfStringWithExtents(dxf);
}

// ==========================================
// Milestone 7: Asset Library (Phase 5: Electrical & Mechanical)
// ==========================================

export function exportLightFixtureDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('ELECTRICAL', DXFWriter.ACI.YELLOW, 'CONTINUOUS');
  dxf.setActiveLayer('ELECTRICAL');
  
  const width = 1200;
  const height = 600;
  
  // Outer housing
  dxf.drawLine(0, 0, width, 0);
  dxf.drawLine(width, 0, width, height);
  dxf.drawLine(width, height, 0, height);
  dxf.drawLine(0, height, 0, 0);
  
  // Crossed diagonal lines
  dxf.drawLine(0, 0, width, height);
  dxf.drawLine(0, height, width, 0);
  
  return getDxfStringWithExtents(dxf);
}

export function exportSocketSwitchDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('ELECTRICAL', DXFWriter.ACI.RED, 'CONTINUOUS');
  dxf.setActiveLayer('ELECTRICAL');
  
  // A standard socket is often a semicircle attached to a wall with lines protruding
  const cx = 0;
  const cy = 0;
  const r = 100;
  
  // Wall line
  dxf.drawLine(-200, 0, 200, 0);
  
  // Semicircle
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const a1 = Math.PI * (i / steps);
    const a2 = Math.PI * ((i + 1) / steps);
    dxf.drawLine(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }
  
  // Twin lines for double socket
  dxf.drawLine(-50, r, -50, r + 150);
  dxf.drawLine(50, r, 50, r + 150);
  
  return getDxfStringWithExtents(dxf);
}

export function exportDistributionBoardDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('ELECTRICAL', DXFWriter.ACI.RED, 'CONTINUOUS');
  dxf.setActiveLayer('ELECTRICAL');
  
  const width = 400;
  const height = 800;
  
  // Main box
  dxf.drawLine(0, 0, width, 0);
  dxf.drawLine(width, 0, width, height);
  dxf.drawLine(width, height, 0, height);
  dxf.drawLine(0, height, 0, 0);
  
  // Diagonal for DB panel standard symbol
  dxf.drawLine(0, 0, width, height);
  
  // Optional internal hatching or split
  dxf.drawLine(0, height / 2, width, height / 2);
  
  return getDxfStringWithExtents(dxf);
}

export function exportHVACVentDXF(): string {
  const dxf = new DXFWriter();
  dxf.addLayer('MECHANICAL', DXFWriter.ACI.MAGENTA, 'CONTINUOUS');
  dxf.setActiveLayer('MECHANICAL');
  
  const size = 600;
  
  // Outer frame
  dxf.drawLine(0, 0, size, 0);
  dxf.drawLine(size, 0, size, size);
  dxf.drawLine(size, size, 0, size);
  dxf.drawLine(0, size, 0, 0);
  
  // Crossed diagonals
  dxf.drawLine(0, 0, size, size);
  dxf.drawLine(size, 0, 0, size);
  
  // Concentric squares for louvers
  for (let offset = 50; offset < size / 2 - 50; offset += 50) {
    const s = size - offset * 2;
    dxf.drawLine(offset, offset, offset + s, offset);
    dxf.drawLine(offset + s, offset, offset + s, offset + s);
    dxf.drawLine(offset + s, offset + s, offset, offset + s);
    dxf.drawLine(offset, offset + s, offset, offset);
  }
  
  return getDxfStringWithExtents(dxf);
}

// ==========================================
// Milestone 8: Drawing Templates & Title Blocks
// ==========================================

function drawTemplate(dxf: any, data: TitleBlockRow) {
  
  dxf.addLayer('BORDER', DXFWriter.ACI.CYAN, 'CONTINUOUS');
  dxf.addLayer('TEXT', DXFWriter.ACI.YELLOW, 'CONTINUOUS');
  
  // Sheet sizes (landscape)
  const sizes = {
    A1: { w: 841, h: 594 },
    A2: { w: 594, h: 420 },
    A3: { w: 420, h: 297 }
  };
  
  const dim = sizes[data.sheetSize] || sizes['A3'];
  const margin = 10;
  
  dxf.setActiveLayer('BORDER');
  // Outer Border
  dxf.drawLine(margin, margin, dim.w - margin, margin);
  dxf.drawLine(dim.w - margin, margin, dim.w - margin, dim.h - margin);
  dxf.drawLine(dim.w - margin, dim.h - margin, margin, dim.h - margin);
  dxf.drawLine(margin, dim.h - margin, margin, margin);
  
  // Title Block (Bottom Right corner)
  const tbWidth = 180;
  const tbHeight = 60;
  const startX = dim.w - margin - tbWidth;
  const startY = margin;
  
  // Title block outline
  dxf.drawLine(startX, startY, startX, startY + tbHeight);
  dxf.drawLine(startX, startY + tbHeight, dim.w - margin, startY + tbHeight);
  
  // Title block grid lines (simplified 4 rows)
  const rowHeight = tbHeight / 4;
  for (let i = 1; i < 4; i++) {
    dxf.drawLine(startX, startY + i * rowHeight, dim.w - margin, startY + i * rowHeight);
  }
  
  // Text insertion
  dxf.setActiveLayer('TEXT');
  const textHeight = 4;
  
  // Try/catch for drawText because dxf-writer text API can be finicky
  try {
    dxf.drawText(startX + 5, startY + tbHeight - rowHeight + 5, textHeight, 0, `PROJ: ${data.projectName}`);
    dxf.drawText(startX + 5, startY + tbHeight - 2 * rowHeight + 5, textHeight, 0, `TITLE: ${data.drawingTitle}`);
    dxf.drawText(startX + 5, startY + tbHeight - 3 * rowHeight + 5, textHeight, 0, `CLIENT: ${data.clientName}`);
    dxf.drawText(startX + 5, startY + 5, textHeight, 0, `DATE: ${data.date} | DRAWN BY: ${data.drawnBy}`);
  } catch (e) {
    console.error("Text rendering failed", e);
  }
  
  }

export function exportTemplateToDXF(data: TitleBlockRow): string {
  const dxf = new DXFWriter();
  drawTemplate(dxf, data);
  return getDxfStringWithExtents(dxf);
}

export function exportTemplateToScript(data: TitleBlockRow): string {
  const script = new ScriptWriter();
  drawTemplate(script, data);
  return script.getScriptString();
}

function getDxfStringWithExtents(dxf: any): string {
  let str = dxf.toDxfString();
  const extents = `9\n$EXTMIN\n10\n-10000.0\n20\n-10000.0\n30\n0.0\n9\n$EXTMAX\n10\n10000.0\n20\n10000.0\n30\n0.0\n`;
  str = str.replace('0\nENDSEC\n0\nSECTION\n2\nCLASSES', extents + '0\nENDSEC\n0\nSECTION\n2\nCLASSES');
  
  // Ensure DXF standard text style uses a standard system font fallback instead of the default 'txt' or 'txt.shx'
  str = str.replace(/\n3\ntxt\n/g, '\n3\nARIAL.TTF\n');
  
  return str;
}
