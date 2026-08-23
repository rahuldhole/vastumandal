# VASTUMANDAL — Development Roadmap

## Phase 1: Monorepo Foundation & Core Math Engines
- [ ] **Canonical Data Schema (`packages/dwg-schemas`)**: Implement Zod schemas for `FloorplanGraph`, `RoomNode`, `WallEdge`, `ColumnNode`, and `BOQSchedule`.
- [ ] **Structural Engine (`packages/core-structural`)**:
  - [ ] Column placement solver for wall L-, T-, and X-junctions.
  - [ ] Maximum clear span validator ($\le 4.5\text{ m}$ threshold).
  - [ ] Orthogonal column-grid axis alignment ($\pm 150\text{ mm}$ snapping).
- [ ] **Civil Estimator Engine (`packages/core-estimator`)**:
  - [ ] Volumetric RCC calculator (footings, columns, plinth, beams, slab).
  - [ ] IS 456 rebar density factors and standard BBS steel tonnage.
  - [ ] Modular brickwork deductions and mortar/plaster dry volume conversions.
- [ ] **Automated Test Suite**: Unit tests verifying material takeoff accuracy against IS 1200 and IS 456 design tables.

---

## Phase 2: Parametric Space Planning & 2D SVG Workbench
- [ ] **Spatial Solver (`packages/core-spatial`)**:
  - [ ] Graph-based room adjacency solver with central living hub.
  - [ ] Aspect ratio constraint solver ($1:1 \text{ to } 1:1.5$).
  - [ ] Passive solar and Vastu orientation heuristic scoring (9-Pada zone matrix).
  - [ ] Wet-stack clustering for plumbing alignment.
- [ ] **2D Interactive Canvas (`apps/web`)**:
  - [ ] Interactive SVG floor plan renderer with real-time dimension strings.
  - [ ] Drag-and-drop wall nodes with coordinate snapping.
  - [ ] Ashta-Dikpalaka dynamic orientation HUD and toggleable Mandala overlay.
- [ ] **Live IS 456 BOQ Ledger**: Dynamic right-hand inspector updating concrete volume, steel weight, and estimated costs in real time.

---

## Phase 3: Multi-Format Exporters & Report Generation
- [ ] **Layered DXF Generator (`packages/dxf-exporter`)**:
  - [ ] ISO 13567 / AIA layered output (`A-WALL-EXTR`, `A-WALL-INTR`, `S-COLS`, `A-DOOR`, `A-GLAZ`, `A-DIMS`, `A-ANNO`).
  - [ ] Dimension entity formatting and hatch fills for structural columns.
- [ ] **3D Mesh Generator (`packages/mesh-exporter`)**:
  - [ ] Polygonal 3D wall extrusion ($3000\text{ mm}$ standard height).
  - [ ] CSG boolean subtraction for doors and windows with sill levels.
  - [ ] OBJ/glTF export pipeline compatible with 3ds Max, Revit, and Blender.
- [ ] **PDF Drawing & Cost Sheet (`packages/pdf-exporter`)**:
  - [ ] High-resolution 2D architectural drawing with title block and north arrow.
  - [ ] Formatted civil BOQ report with dynamic regional rate customizer.

---

## Phase 4: 3D Real-Time Viewport & Production Hardening
- [ ] **Three.js Isometric Viewport (`apps/web`)**:
  - [ ] Real-time 3D cutaway visualization matching 2D editor updates.
  - [ ] Parametric door/window fixtures and architectural materials (wood, plaster, tiles, concrete).
- [ ] **Project State Management**:
  - [ ] Local-first state persistence (IndexedDB / LocalStorage) with undo/redo history.
  - [ ] Import/Export project snapshots via JSON schema.
- [ ] **End-to-End Validation**: Cross-verification of exported DXF files in AutoCAD and OBJ meshes in 3ds Max/Revit.
