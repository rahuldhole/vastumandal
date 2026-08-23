# VASTUMANDAL — System Architecture

## 1. Overview & Data Flow

Vastumandal is a desktop-first CAD/BIM workbench for automated residential space planning, IS 456 structural framing derivation, IS 1200 quantity takeoff (QTO), and multi-format engineering exports (DXF, OBJ, PDF).

```
           [ User Input / Plot Boundary / Requirements ]
                                 │
                                 ▼
               [ @vastumandal/core-spatial ]
      ├── Planar Graph Adjacency Solver (Circulation Hub)
      ├── Environmental & Vastu Orientation Matrix (NBC 2016)
      └── Recursive Slicing-Tree (BSP) Room Topology
                                 │
                                 ▼
              [ @vastumandal/core-structural ]
      ├── Column Placement Solver (L/T-junctions, spans ≤ 4.5m)
      ├── Structural Grid Snapping (±150mm axis alignment)
      └── Slab Load Paths (One-way / Two-way classification)
                                 │
                                 ▼
              [ @vastumandal/core-estimator ]
      ├── IS 1200 Volumetric Concrete Takeoff (Footings to Slab)
      ├── IS 456 Rebar Steel Density & Bar Bending Takeoff
      └── Brickwork, Plaster, Mortar & Regional Cost Engine
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼

[ @vastumandal/dxf-exporter ] [ @vastumandal/mesh-exporter ] [ @vastumandal/pdf-exporter ]
├── Layered CAD (A-WALL,     ├── 3D Wall Extrusion (3m)      ├── 2D Architectural Sheet
│   S-COLS, A-DIMS, A-GLAZ)  ├── CSG Openings (Doors/Windows)├── Structural Framing Grid
└── AutoCAD / DraftSight     └── OBJ/glTF (3ds Max / Revit)  └── Itemized BOQ & BBS
```

---

## 2. Monorepo Package Topology (`pnpm-workspace`)

```text
vastumandal/
├── packages/
│   ├── dwg-schemas/       # Canonical Zod schemas & TypeScript type contracts
│   ├── core-spatial/      # Graph topology, room aspect ratios, solar/Vastu solver
│   ├── core-structural/   # Column-beam grid derivation, IS 456 load distribution
│   ├── core-estimator/    # IS 1200 QTO engine, dry volume factors, BBS steel weight
│   ├── dxf-exporter/      # Layered 2D DXF vector generator (ISO 13567 / AIA)
│   ├── mesh-exporter/     # Extruded 3D polygonal solids with CSG boolean voids
│   └── pdf-exporter/      # Printable drawing sheets and client BOQ estimate tables
└── apps/
    └── web/               # Next.js 3-pane workbench UI, SVG editor & Three.js viewport
```

---

## 3. Package Specifications

### `@vastumandal/dwg-schemas`
Defines the single source of truth for the entire workspace:
* **`FloorplanGraph`**: Vertex nodes (wall junctions), Edge connections (wall thickness: $230\text{ mm}$ exterior / $115\text{ mm}$ interior), Face loops (room volumes).
* **`RoomNode`**: Unique ID, room type (`LIVING`, `KITCHEN`, `MASTER_BED`, `ATTACHED_BATH`, `COMMON_BATH`, `MANDIR`), target area, aspect ratio bounds ($1:1 \text{ to } 1:1.5$).
* **`StructuralColumn`**: Coordinate centroid $(x, y)$, dimensions ($230 \times 380\text{ mm}$), grid tag (`C1`, `C2`), orientation angle.
* **`BOQSchedule`**: Itemized material quantities, unit rates, and totals.

### `@vastumandal/core-spatial`
* **Circulation Solver**: Enforces living room / central foyer as the root access node, keeping corridor wastage under $10\%$.
* **Wet-Stack Clustering**: Groups kitchen, utility, and sanitary fixtures along shared wall segments to minimize plumbing runs.
* **Passive Solar & Vastu Orientation Matrix**: Evaluates floor plans against cardinal orientations (East entry, SE kitchen, SW master bed, NW toilets/guest spaces).

### `@vastumandal/core-structural`
* **Column Grid Solver**:
  * Injects columns at all building corners and wall junctions.
  * Injects intermediate columns along wall spans exceeding $4.5\text{ m}$.
  * Snaps column centroids to orthogonal grid lines within $\pm 150\text{ mm}$ tolerance.
* **Beam-Slab Load Paths**:
  * Identifies one-way slabs ($\frac{L_y}{L_x} > 2$) and two-way slabs ($\frac{L_y}{L_x} \le 2$).
  * Computes tributary loading on primary and secondary framing beams.

### `@vastumandal/core-estimator`
* **Volumetric RCC Calculations (IS 456 & IS 1200)**:
  * Footings: $1.2 \times 1.2 \times 0.45\text{ m}$ per column.
  * Columns: $0.23 \times 0.38 \times 3.0\text{ m}$ per column.
  * Beams: Clear span $\times 0.23 \times 0.38\text{ m}$.
  * Roof Slab: $\text{Gross Built-up Area} \times 0.125\text{ m}$.
  * Dry Mix Conversion: $V_{\text{dry}} = V_{\text{wet}} \times 1.54$.
* **Rebar Steel Takeoff ($W_s$)**:
  * Footings: $50\text{ kg/m}^3$ | Columns: $140\text{ kg/m}^3$ | Beams: $115\text{ kg/m}^3$ | Slab: $80\text{ kg/m}^3$.
  * Unit weight formula: $w = \frac{d^2}{162}\text{ kg/m}$.
* **Masonry & Plaster**:
  * Net Masonry Volume = Gross Wall Volume - (Door Voids + Window Voids + RCC Framing).
  * Modular Bricks Takeoff = $\text{Net Volume (m}^3\text{)} \times 500\text{ bricks/m}^3$.
  * $12\text{ mm}$ internal ($1:4$) and $20\text{ mm}$ external waterproof plaster.

### `@vastumandal/dxf-exporter`
Generates layered `.dxf` CAD drawings using standardized entity definitions:
* `A-WALL-EXTR` / `A-WALL-INTR`: Double-line wall outlines.
* `S-COLS`: Solid-hatched column rectangles and centerline grids (`S-GRID`).
* `A-DOOR` / `A-GLAZ`: Swing clearance arcs and window double-lines.
* `A-DIMS` / `A-ANNO`: Aligned dimension strings and clear carpet annotations.

### `@vastumandal/mesh-exporter`
* **Wall Extrusions**: Extrudes 2D polygon footprints to $Z = 3000\text{ mm}$.
* **CSG Boolean Voids**: Performs real-time mesh subtraction for doors ($2100 \times 900\text{ mm}$) and windows ($1200 \times 1200\text{ mm}$, sill $900\text{ mm}$).
* **Material Grouping**: Assigns standard `.mtl` material IDs (`Wall_Interior`, `Wall_Exterior`, `Floor_Tiles`, `Glass`).

### `@vastumandal/pdf-exporter`
* High-resolution 2D architectural drawing with dimension schedules and north arrow.
* Structural column framing plan.
* Formal civil Bill of Quantities (BOQ) with dynamic regional unit rates.

---

## 4. Frontend Workbench Architecture (`apps/web`)

The user interface operates as an engineering workbench with three primary panes:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Bar: Project Metadata | Grid: 100mm | Vastu Score: 94% | Actions (DXF, OBJ, PDF)   │
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ Left Panel:     │ Center Viewport:                                   │ Right Panel:    │
│ Inspector &     │ Dual-Mode Canvas (2D SVG Editor / 3D Three.js)     │ Structural &    │
│ Constraints     │                                                    │ Cost Ledger     │
│ • Plot Envelope │  • Interactive Wall Nodes & Snapping Guides        │ • Concrete: m³  │
│ • Directional   │  • Ashta-Dikpalaka Orientation HUD                 │ • Steel: kg     │
│   Orientation   │  • Mandala 9-Zone Alignment Overlay                │ • Live BOQ Cost │
│ • Room Schedule │                                                    │ • Dynamic Rate  │
│ • Aspect Bounds │ Bottom Tray: Validation Logs | Span Checks | BBS   │   Customizer    │
└─────────────────┴────────────────────────────────────────────────────┴─────────────────┘
```
