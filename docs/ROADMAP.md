# VastuMandal Development Roadmap

## Phase 1: Core Geometry & BOQ Solvers (Current Target - 90% Polish)
- [x] Monorepo scaffold with pnpm workspaces and TypeScript interfaces[cite: 1].
- [x] Implement 2D deterministic Vaastu packing solver in `packages/core-spatial`[cite: 1].
- [x] Implement Column GA placement heuristics in `packages/core-structural`[cite: 1].
- [x] Implement Indian Standard empirical civil material takeoff in `packages/core-estimator`[cite: 1].
- [x] Layer-separated `.dxf` file export in `packages/dxf-exporter`[cite: 1].
- [x] Comprehensive unit tests with Vitest across spatial and structural math engines[cite: 1].

## Phase 2: Web Experience & Visualizers
- [x] Interactive 2D SVG canvas preview with dynamic dimension annotations in `apps/web`[cite: 1].
- [x] Three.js 3D isometric cutaway viewer with material textures[cite: 1].
- [x] Instant PDF schedule generator (Floor plan + Openings schedule + Phase-wise BOQ).
- [x] Preset library for standard Indian residential plots ($20 \times 30$, $30 \times 40$, $30 \times 50$, $40 \times 60$).

## Phase 3: Advanced BIM & Structural Hand-off
- [x] IFC (Industry Foundation Classes) file export for direct Autodesk Revit BIM compatibility.
- [x] STAAD.Pro / ETABS netlist (`.std` / `.edb`) line model exporter.
- [x] Dynamic local rate card presets by city/region (e.g., Tier 1 vs Tier 2 material pricing).
- [x] Custom room-drag and boundary vertex adjustment directly in the web canvas.
