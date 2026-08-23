# Vastumandal Architecture & Product Decision Log

This log records the core architectural and scope decisions defining the boundary of **Vastumandal**: delivering 90% of end-to-end deliverables for everyday residential and light commercial projects (G to G+4) while providing escape-hatch exports for advanced 10% workflows.

---

## ADR-001: The 90/10 Scope Boundary & Target Market

* **Status:** Accepted
* **Date:** 2026-08-23
* **Context:** Civil engineers and small design-build consultancies spend significant time switching between AutoCAD, manual Excel sheets, and complex structural suites for routine low-to-mid rise buildings (G to G+4). Rebuilding full FEA or deep MEP coordination suites in-browser would cause software bloat and duplicate battle-tested software.
* **Decision:**
  * Constrain Vastumandal's core scope to everyday residential and light commercial construction (G to G+4).
  * Focus on parametric room layouts, simplified tributary gravity load sizing, instant Bill of Quantities (BOQ), and production-ready drawing generation.
  * Explicitly defer non-linear dynamic seismic analysis, organic 3D NURBS modeling, high-density MEP clash simulation, and enterprise CPM tracking to external tools (ETABS, STAAD.Pro, Revit, Primavera P6).
* **Consequences:**
  * **Positive:** Drastically reduces UX complexity, maintains high execution speed, and optimizes for 90% of solo/small-firm project volume.
  * **Negative:** Not suitable as a standalone solution for high-rises, bridges, industrial truss systems, or complex irregular structural footprints.

---

## ADR-002: Monorepo Decoupling & Reactive Calculation Engine

* **Status:** Accepted
* **Date:** 2026-08-23
* **Context:** Changes in architectural wall arrangements directly alter structural spans, tributary column loads, footing sizes, concrete volumes, and rebar takeoffs. Tight coupling between UI and math logic makes unit testing and multi-target compilation difficult.
* **Decision:**
  * Maintain isolated packages within a TypeScript monorepo[cite: 1]:
    * `packages/core-spatial`: 2D/3D parametric spatial grids, room adjacency, wall/opening placement[cite: 1].
    * `packages/core-structural`: Tributary area calculation, column load aggregation, code-based beam/slab/column/footing rule-based sizing[cite: 1].
    * `packages/core-estimator`: Live volumetric breakdowns ($m^3$ concrete, $m^2$ formwork/masonry, steel weight schedules, cost rate multipliers)[cite: 1].
    * `packages/dwg-schemas`: Canonical data models shared across engine solvers and exporters[cite: 1].
  * All mathematical modules must operate as pure, deterministic functions driven by schema states[cite: 1].
* **Consequences:**
  * **Positive:** Architectural layout tweaks instantly cascade into structural sizing and cost changes with zero round-trip latency.
  * **Negative:** Requires rigorous schema versioning in `dwg-schemas` whenever structural or geometric models evolve[cite: 1].

---

## ADR-003: Escape-Hatch Interoperability & Multi-Format Exporters

* **Status:** Accepted
* **Date:** 2026-08-23
* **Context:** Engineers cannot adopt a closed proprietary format that blocks them when municipal authorities, clients, or senior consultants demand standard `.dwg`, `.dxf`, `.ifc`, or structural models.
* **Decision:**
  * Treat Vastumandal as an open accelerator rather than a closed ecosystem.
  * Build dedicated headless export packages[cite: 1]:
    * `packages/dxf-exporter`: Layer-separated 2D drafting with standard CAD line types and dimension styles[cite: 1].
    * `packages/ifc-exporter`: Standard IFC entity representations (`IfcWall`, `IfcSlab`, `IfcColumn`, `IfcBeam`) for Revit/BIM workflows[cite: 1].
    * `packages/structural-exporter`: Formatted structural geometry and point loads for verification in ETABS / STAAD.Pro[cite: 1].
    * `packages/mesh-exporter` & `packages/pdf-exporter`: 3D visual assets and presentation-ready client estimate sheets[cite: 1].
    * `vastumandal-import.lsp`: Dedicated AutoLISP bridge script for CAD automation[cite: 1].
* **Consequences:**
  * **Positive:** Zero vendor lock-in; users can build 80–90% of the project in minutes and export into legacy stacks for final edge-case detailing.
  * **Negative:** Requires continuous maintenance of exporter conformance against third-party CAD/BIM specification versions.

---

## ADR-004: Zero-Install Client-Side Worker Pipeline

* **Status:** Accepted
* **Date:** 2026-08-23
* **Context:** Heavy desktop civil software requires expensive dedicated GPU workstations, operating system licenses, and complex local installations.
* **Decision:**
  * Execute all computational algorithms (spatial solving, load distribution, quantity estimating, DXF/IFC string serialization) client-side inside Web Workers (`engine.worker.ts`)[cite: 1].
  * Deliver the application as an offline-capable Progressive Web Application (PWA)[cite: 1].
* **Consequences:**
  * **Positive:** Zero server compute cost per calculation, near-zero infrastructure overhead, instant feedback loop, and full privacy for client drawings.
  * **Negative:** Constrained by browser memory limits on massive drawings; requires Web Worker serialization handling for large data sets.

---

## ADR-005: High-Impact Site Deliverables (BBS, SBC Footings, Bylaw Checks)

* **Status:** Proposed / In-Progress
* **Date:** 2026-08-23
* **Context:** To truly replace the multi-app loop for 90% of small builds, preliminary sizing must generate executable schedules that site supervisors, contractors, and sanction authorities require.
* **Decision:**
  * Implement three practical extensions into the core structural and estimation pipeline:
    1. **Automated Bar Bending Schedule (BBS):** Generate standard rebar cutting lengths, hook deductions, and bar mark tables directly from sized structural members.
    2. **Soil Bearing Capacity (SBC) Footing Engine:** Add direct soil bearing inputs ($kN/m^2$) to calculate isolated/combined pad footing footprint areas ($L \times B$) and depth requirements automatically.
    3. **Sanction Bylaw Assistant:** Add rule checking for Floor Space Index / Floor Area Ratio (FSI/FAR), standard setbacks, and stair geometry limits prior to final drawing generation.
* **Consequences:**
  * **Positive:** Bridges the gap between basic conceptual floor planning and real, actionable site execution documents.
  * **Negative:** Requires configurable regional parameters (e.g., varying municipal setback codes and standard steel detailing codes).