# VastuMandal Architecture Specification

VastuMandal is an open-core computational architecture engine designed to generate residential floor plans, column framing arrangements, Bill of Quantities (BOQ), and CAD/3D BIM interchange formats from high-level parametric constraints[cite: 1].

---

## Workspace Monorepo Topology


```

vastumandal/
├── apps/
│   └── web/                   # Next.js 15 UI, SVG 2D Canvas & Three.js 3D Viewport
├── packages/
│   ├── dwg-schemas/           # Shared Zod schemas, TypeScript types, and coordinate models
│   ├── core-spatial/          # 2D constraint solver, Vaastu Mandal matrix & room packer
│   ├── core-structural/       # Column placement heuristics, span validation & GA generator
│   ├── core-estimator/        # Quantity takeoff engine (IS empirical civil formulas) & BOQ
│   ├── dxf-exporter/          # Layer-separated ASCII DXF CAD file generator
│   ├── mesh-exporter/         # 3D wall extrusion, opening subtractions (.obj / .gltf)
│   └── pdf-exporter/          # Vector client proposal and structural schedule PDF reports
└── public/
└── vastumandal-import.lsp # Zero-dependency AutoLISP loader for AutoCAD / BricsCAD

```

---

## Data Pipeline


```

[ Plot Constraints & BHK Request ]
│
▼
[ packages/core-spatial ]
(Boundary ➔ Setbacks ➔ Vaastu 9-Grid ➔ Clearance Verification)
│
├───────────────────────────────┐
▼                               ▼
[ packages/core-structural ]     [ packages/core-estimator ]
(Column Placements & Spans)      (Empirical Multipliers & Cost Engine)
│                               │
└──────────────┬────────────────┘
│
▼
[ FloorPlan Model ]
│
┌───────────────────────┼───────────────────────┐
▼                       ▼                       ▼
[ dxf-exporter ]        [ mesh-exporter ]       [ pdf-exporter ]
(.dxf CAD Layers)       (.obj / .gltf 3D)       (.pdf BOQ & Plan)

```

---

## Interoperability Strategy

1. **AutoCAD & BricsCAD**: Direct ASCII DXF export categorized by CAD standards (Lineweights, Colors, Layers) and scripted via `vastumandal-import.lsp`[cite: 1].
2. **3ds Max & Blender**: Standardized scale `.obj`/`.gltf` meshes with pre-separated wall, floor, and opening geometry.
3. **Revit & BIM**: Planar structural line representations compatible with Revit generic wall and column family placement.
