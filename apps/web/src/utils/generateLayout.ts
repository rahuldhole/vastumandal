import type { PlotSpec, RequirementSpec } from '@vastumandal/dwg-schemas';

// ---------------------------------------------------------------------------
// Public types returned by generateLayout
// ---------------------------------------------------------------------------
export interface LayoutRoom {
  id: string;
  name: string;
  x: number;      // metres from plot origin (bottom-left)
  y: number;
  w: number;
  h: number;
  color: string;   // HSL / hex for 2D fill
}

export interface ColumnPos {
  id: string;
  x: number;       // metres
  y: number;
  size: number;     // mm side length
}

export interface LayoutResult {
  rooms: LayoutRoom[];
  columns: ColumnPos[];
  buildable: { x: number; y: number; w: number; h: number };
  plotW: number;
  plotH: number;
}

// ---------------------------------------------------------------------------
// Room palette — muted but distinct
// ---------------------------------------------------------------------------
const COLORS = {
  living:    'hsla(210, 50%, 60%, 0.25)',
  bedroom:   'hsla(260, 45%, 60%, 0.25)',
  kitchen:   'hsla(30, 70%, 55%, 0.25)',
  toilet:    'hsla(180, 50%, 55%, 0.25)',
  puja:      'hsla(45, 80%, 55%, 0.25)',
  parking:   'hsla(0, 0%, 60%, 0.18)',
  staircase: 'hsla(0, 0%, 45%, 0.22)',
  porch:     'hsla(140, 40%, 55%, 0.18)',
  shop:      'hsla(350, 55%, 55%, 0.25)',
  passage:   'hsla(0, 0%, 50%, 0.12)',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const floorCountToNumber = (fc?: string): number => {
  if (!fc) return 1;
  if (fc === 'G') return 1;
  const m = fc.match(/G\+(\d+)/i);
  return m ? 1 + parseInt(m[1], 10) : 1;
};

const bhkToRoomCount = (bhk?: string): { bedrooms: number; totalRooms: number } => {
  const n = parseInt(bhk || '2', 10) || 2;
  return { bedrooms: n, totalRooms: n + 3 }; // bed(s) + living + kitchen + toilet
};

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------
export function generateLayout(plotSpec: PlotSpec, reqSpec: RequirementSpec): LayoutResult {
  const plotW = plotSpec.width;
  const plotH = plotSpec.length;
  const sb = plotSpec.setbacks || { front: 0, rear: 0, left: 0, right: 0 };

  // Buildable envelope
  const bx = sb.left;
  const by = sb.front;
  const bw = plotW - sb.left - sb.right;
  const bh = plotH - sb.front - sb.rear;
  const buildable = { x: bx, y: by, w: Math.max(bw, 1), h: Math.max(bh, 1) };

  const rooms: LayoutRoom[] = [];
  const columns: ColumnPos[] = [];
  const floors = floorCountToNumber(plotSpec.floorCount);
  const { bedrooms } = bhkToRoomCount(reqSpec.bhk);
  let rid = 0;
  const nextId = (prefix: string) => `${prefix}-${++rid}`;

  // Working area tracker (what's left of buildable after carve-outs)
  let curY = by;
  let remainH = bh;

  // 1. Parking strip at the front (if requested and multi-floor or has parking)
  if (reqSpec.parking && (floors > 1 || plotW >= 9)) {
    const parkH = Math.min(3.0, remainH * 0.2);
    rooms.push({ id: nextId('P'), name: 'Parking', x: bx, y: curY, w: bw, h: parkH, color: COLORS.parking });
    curY += parkH;
    remainH -= parkH;
  }

  // 2. Porch
  if (reqSpec.porch) {
    const porchH = Math.min(1.5, remainH * 0.1);
    rooms.push({ id: nextId('PO'), name: 'Porch', x: bx, y: curY, w: bw * 0.4, h: porchH, color: COLORS.porch });
    curY += porchH;
    remainH -= porchH;
  }

  // 3. Staircase (if multi-floor)
  let stairW = 0;
  if (floors > 1) {
    stairW = Math.min(2.5, bw * 0.2);
    const stairH = Math.min(4.0, remainH * 0.3);
    rooms.push({ id: nextId('ST'), name: 'Staircase', x: bx + bw - stairW, y: curY, w: stairW, h: stairH, color: COLORS.staircase });
  }

  // Available width excluding staircase
  const usableW = bw - stairW;

  // 4. Living room — front-centre
  const livingH = Math.min(remainH * 0.35, 5.0);
  rooms.push({ id: nextId('LR'), name: 'Living Room', x: bx, y: curY, w: usableW, h: livingH, color: COLORS.living });
  curY += livingH;
  remainH -= livingH;

  // 5. Kitchen + Toilet row
  const serviceH = Math.min(remainH * 0.3, 3.5);
  const kitW = usableW * 0.55;
  rooms.push({ id: nextId('K'), name: 'Kitchen', x: bx, y: curY, w: kitW, h: serviceH, color: COLORS.kitchen });
  rooms.push({ id: nextId('T'), name: 'Toilet', x: bx + kitW, y: curY, w: usableW - kitW, h: serviceH, color: COLORS.toilet });
  curY += serviceH;
  remainH -= serviceH;

  // 6. Bedrooms — split remaining area
  if (bedrooms === 1) {
    rooms.push({ id: nextId('BR'), name: 'Bedroom', x: bx, y: curY, w: usableW, h: remainH, color: COLORS.bedroom });
  } else {
    const bedW = usableW / Math.min(bedrooms, 2);
    const topBeds = Math.min(bedrooms, 2);
    for (let i = 0; i < topBeds; i++) {
      rooms.push({
        id: nextId('BR'),
        name: `Bedroom ${i + 1}`,
        x: bx + i * bedW,
        y: curY,
        w: bedW,
        h: remainH,
        color: COLORS.bedroom,
      });
    }
    // If 3BHK, third bedroom goes as a narrower room splitting one of the above
    if (bedrooms >= 3 && remainH > 3) {
      const splitH = remainH * 0.5;
      rooms.push({
        id: nextId('BR'),
        name: `Bedroom 3`,
        x: bx,
        y: curY + splitH,
        w: usableW * 0.5,
        h: remainH - splitH,
        color: COLORS.bedroom,
      });
    }
  }

  // 7. Puja room (small nook in NE area)
  if (reqSpec.pujaRoom) {
    const px = bx + bw - Math.min(2.0, bw * 0.2);
    const py = by + bh - Math.min(2.0, bh * 0.15);
    rooms.push({ id: nextId('PJ'), name: 'Puja', x: px, y: py, w: Math.min(2.0, bw * 0.2), h: Math.min(2.0, bh * 0.15), color: COLORS.puja });
  }

  // -----------------------------------------------------------------------
  // Column grid — place at room corner intersections
  // -----------------------------------------------------------------------
  const colSize = 300; // mm
  // Collect unique X and Y coordinates from room corners
  const xs = new Set<number>();
  const ys = new Set<number>();
  // Always include buildable corners
  xs.add(bx); xs.add(bx + bw);
  ys.add(by); ys.add(by + bh);
  for (const r of rooms) {
    xs.add(r.x); xs.add(r.x + r.w);
    ys.add(r.y); ys.add(r.y + r.h);
  }
  const sortedX = [...xs].sort((a, b) => a - b);
  const sortedY = [...ys].sort((a, b) => a - b);

  // Thin out — max ~5 per axis to avoid visual clutter
  const pickEvenly = (arr: number[], max: number): number[] => {
    if (arr.length <= max) return arr;
    const step = (arr.length - 1) / (max - 1);
    const out: number[] = [];
    for (let i = 0; i < max; i++) out.push(arr[Math.round(i * step)]);
    return out;
  };
  const colXs = pickEvenly(sortedX, 5);
  const colYs = pickEvenly(sortedY, 5);

  let cid = 0;
  for (const cx of colXs) {
    for (const cy of colYs) {
      columns.push({ id: `C${++cid}`, x: cx, y: cy, size: colSize });
    }
  }

  return { rooms, columns, buildable, plotW, plotH };
}
