export type Point2D = [number, number];

/**
 * Calculates the area of an arbitrary 2D polygon using the Shoelace formula.
 * The vertices should be in order (either clockwise or counter-clockwise).
 */
export function calculatePolygonArea(polygon: Point2D[]): number {
  let area = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += polygon[i][0] * polygon[j][1];
    area -= polygon[j][0] * polygon[i][1];
  }
  return Math.abs(area / 2.0);
}

/**
 * Basic point in polygon test using ray casting.
 */
export function isPointInPolygon(point: Point2D, polygon: Point2D[]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Simple 2D polygon offsetting via normal displacement (vertex shifting).
 * Note: A robust implementation would use straight skeletons (e.g., cavalier_contours or clipper-lib),
 * but for basic convex or simple residential plot geometries, vertex shifting is a lightweight heuristic.
 * Positive offset moves outward, negative moves inward (setback).
 */
export function offsetPolygon(polygon: Point2D[], distance: number): Point2D[] {
  if (polygon.length < 3) return polygon;
  
  const offsetPoints: Point2D[] = [];
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const prev = polygon[(i - 1 + n) % n];
    const curr = polygon[i];
    const next = polygon[(i + 1) % n];

    // Edge vectors
    const v1 = [curr[0] - prev[0], curr[1] - prev[1]];
    const v2 = [next[0] - curr[0], next[1] - curr[1]];

    // Edge normals (rotated 90 degrees outward, assuming CCW orientation)
    // If we assume standard Y up and CCW, (dx, dy) -> (-dy, dx)
    // Normalizing
    const len1 = Math.hypot(v1[0], v1[1]);
    const n1 = [-v1[1] / len1, v1[0] / len1];

    const len2 = Math.hypot(v2[0], v2[1]);
    const n2 = [-v2[1] / len2, v2[0] / len2];

    // Bisector
    const nx = n1[0] + n2[0];
    const ny = n1[1] + n2[1];
    const lenN = Math.hypot(nx, ny);
    
    // If points are collinear, just use the normal
    if (lenN === 0) {
      offsetPoints.push([curr[0] + n1[0] * distance, curr[1] + n1[1] * distance]);
      continue;
    }
    
    const bnx = nx / lenN;
    const bny = ny / lenN;

    // We want the displacement vector D such that dot(D, n1) = distance
    // D = (bnx, bny) * magnitude
    // magnitude * dot((bnx, bny), n1) = distance
    const dot = bnx * n1[0] + bny * n1[1];
    let magnitude = distance / dot;
    
    // Guard against huge spikes for very sharp angles
    if (Math.abs(magnitude) > Math.abs(distance) * 5) {
      magnitude = Math.sign(magnitude) * Math.abs(distance) * 5;
    }

    offsetPoints.push([curr[0] + bnx * magnitude, curr[1] + bny * magnitude]);
  }

  return offsetPoints;
}
