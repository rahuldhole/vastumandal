## The 90/10 Rule & Scope Guardrails
Maintain strict product boundaries to avoid software bloat and duplicate battle-tested specialized desktop suites:

* **In Scope (The 90% Vastumandal Core):**
  - Parametric 2D/3D architectural spatial layouts (grids, room adjacency, wall thickness, openings).
  - Code-compliant gravity load distribution (tributary area loading for slabs, beams, columns).
  - Preliminary structural member sizing & reinforcement scheduling.
  - Soil Bearing Capacity (SBC) isolated pad footing sizing ($L \times B \times D$).
  - Automated Bar Bending Schedules (BBS) with standard cutting lengths and hook deductions.
  - Live Bill of Quantities (BOQ) with volumetric concrete ($m^3$), masonry ($m^2$), formwork, and steel tonnage.
  - Municipal bylaw rule checks (FSI/FAR, setbacks, staircase riser/tread compliance).
  - Production-grade exports: Layer-compliant DXF, valid BIM IFC (`IfcWall`, `IfcColumn`, `IfcBeam`, `IfcSlab`), structural verification geometry (ETABS/STAAD point loads), and client PDF estimate sheets.

* **Out of Scope (The 10% Escape Hatch — Must Defer to Exports):**
  - DO NOT implement dynamic non-linear finite element seismic/wind solvers (export geometry to ETABS/STAAD instead).
  - DO NOT build freeform 3D NURBS modeling or organic surface sculpting (export to DXF/Mesh).
  - DO NOT implement complex MEP pipe/conduit collision solvers (export to IFC for Revit/Navisworks).
  - DO NOT build enterprise multi-tier supply chain ERP / CPM scheduling (export BOQ to Excel/P6).

---

## Monorepo Architecture Guidelines
Adhere strictly to the decoupled monorepo packages:

1. `packages/dwg-schemas`:
   - Single source of truth. Define strict canonical TypeScript schemas (Zod/TypeBox) for projects, rooms, grid nodes, structural members, footing parameters, BBS items, and rate analysis cards.
2. `packages/core-spatial`:
   - Pure geometric algorithms for 2D floor grid generation, wall polygon generation, clear span calculations, and bylaw validation (setbacks, ground coverage, stair pitch).
3. `packages/core-structural`:
   - Deterministic tributary load calculators, preliminary RC section sizing formulas, SBC-driven isolated footing calculators, and standard rebar placement logic (main steel, distribution steel, shear stirrups).
4. `packages/core-estimator`:
   - Reactive BOQ math engine calculating exact concrete volumes, brickwork deductions for openings, plastering surface areas, and total steel weight schedules.
5. `packages/dxf-exporter` & `packages/ifc-exporter`:
   - Headless string/binary serializes generating standardized CAD layers (e.g., `WALLS`, `COLUMNS`, `BEAMS`, `FOOTINGS`, `DIMS`, `HATCH`) and valid IFC STEP files.
6. `apps/web`:
   - Next.js / client-side UI with Web Workers (`engine.worker.ts`) handling all compute-heavy geometric, structural, and export generation tasks to guarantee 60 FPS interactions.

---

## Implementation Instructions for Tasks
When generating or refactoring code:
1. **Purity & Determinism:** All calculation routines in `core-*` packages must be pure, synchronous functions receiving plain schema objects and returning computed schemas.
2. **Unit Test Coverage:** Write exhaustive Vitest unit tests verifying all engineering calculations against known analytical benchmarks (e.g., tributary load checks, rebar cutting length formulas, footing area equations).
3. **Graceful Degradation:** When an architectural modification violates a structural threshold or municipal bylaw, output structured warning diagnostics rather than throwing unhandled exceptions.
4. **CAD Conformance:** Ensure DXF exports open cleanly in standard CAD viewers without broken polylines, missing text styles, or misaligned layers.