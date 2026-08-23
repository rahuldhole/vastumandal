export interface PlotBoundary {
  width: number;
  length: number;
}

export interface RoomRequest {
  id: string;
  type: 'LIVING' | 'KITCHEN' | 'MASTER_BED' | 'ATTACHED_BATH' | 'COMMON_BATH' | 'MANDIR' | 'OTHER';
  targetArea: number; // in sq units
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  length: number;
}

export interface RoomLayout extends RoomRequest {
  box: BoundingBox;
}

export interface SolverResult {
  layout: RoomLayout[];
  vastuScore: number;
  isValid: boolean;
  errors: string[];
}

export class GraphRoomSolver {
  private plot: PlotBoundary;
  private requests: RoomRequest[];

  constructor(plot: PlotBoundary, requests: RoomRequest[]) {
    this.plot = plot;
    this.requests = requests;
  }

  public solve(): SolverResult {
    const layout: RoomLayout[] = [];
    let vastuScore = 100;
    const errors: string[] = [];

    // Simple heuristic-based linear placement for demonstration
    // In a full implementation, this would use a slicing-tree or BSP approach
    let currentY = 0;

    for (const req of this.requests) {
      // Calculate dimensions maintaining aspect ratio between 1:1 and 1:1.5
      // Area = w * l; let's target an aspect ratio of 1:1.2 for layout
      const targetRatio = 1.2;
      let w = Math.sqrt(req.targetArea / targetRatio);
      let l = w * targetRatio;

      // Clamp width if it exceeds plot width
      if (w > this.plot.width) {
        w = this.plot.width;
        l = req.targetArea / w;
        
        const ratio = Math.max(w/l, l/w);
        if (ratio > 1.5) {
          errors.push(`Room ${req.id} aspect ratio ${ratio.toFixed(2)} exceeds 1.5 constraint due to plot width.`);
        }
      }

      const box: BoundingBox = {
        x: 0, // Aligning to left for simple layout
        y: currentY,
        width: w,
        length: l
      };

      layout.push({ ...req, box });
      
      // Basic 9-Pada Vastu Scoring Heuristic
      // Assuming a standard grid where 0,0 is North-West (depending on orientation)
      // We will mock quadrant detection based on normalized Y position
      const normalizedY = currentY / this.plot.length;
      
      if (req.type === 'KITCHEN') {
        // Reward SE (bottom-ish), Penalize NE (top-ish)
        if (normalizedY < 0.33) {
          vastuScore -= 30; // Heavy penalty for NE Kitchen
          errors.push("Kitchen is in the North-East zone (Vastu Violation).");
        } else if (normalizedY > 0.66) {
          vastuScore += 10; // Reward SE
        }
      } else if (req.type === 'MANDIR') {
        // Reward NE
        if (normalizedY < 0.33) {
          vastuScore += 10;
        } else {
          vastuScore -= 15;
          errors.push("Mandir is not in the North-East zone.");
        }
      } else if (req.type === 'MASTER_BED') {
        // Reward SW
        if (normalizedY > 0.66) {
          vastuScore += 10;
        } else {
          vastuScore -= 10;
          errors.push("Master Bedroom should ideally be in South-West.");
        }
      }

      currentY += l;
    }

    if (currentY > this.plot.length) {
      errors.push("Total room length exceeds plot length bounds.");
    }

    // Clamp score
    vastuScore = Math.max(0, Math.min(100, vastuScore));

    return {
      layout,
      vastuScore,
      isValid: errors.length === 0,
      errors
    };
  }
}
