# Vastumandal

> **High-speed civil engineering design accelerator for everyday residential and light commercial projects (G to G+4).**

Vastumandal eliminates the disjointed loop between manual AutoCAD drafting, spreadsheet calculation sheets, and handbook lookups[cite: 1]. It provides a reactive, browser-native workspace that computes structural loads, dimensions isolated footings, calculates Bar Bending Schedules (BBS), and generates live Bill of Quantities (BOQ) in real time[cite: 1].

---

## The 90/10 Philosophy

Vastumandal is built around a practical boundary: **solve 90% of routine civil engineering deliverables out of the box, with clean export adapters for the remaining 10% of advanced specialist workflows.**


```

+-------------------------------------------------------------------------+
|                  VASTUMANDAL WORKSPACE (The 90%)                        |
|                                                                         |
|  [Parametric Layout]  -->  [Tributary Loads]  -->  [Member & SBC Sizing]|
|           |                       |                        |            |
|           v                       v                        v            |
|    [Bylaw Validation]       [Live BOQ / Costs]       [Automated BBS]    |
+-------------------------------------------------------------------------+
|
Escape Hatch Export Pipeline (The 10%)
|
+-----------------------------+-----------------------------+
|                             |                             |
v                             v                             v
[AutoCAD / DXF]              [Revit / IFC]               [ETABS / STAAD.Pro]
2D Detailing & Plots       BIM & MEP Coordination       Complex Dynamic FEA

```

* **In Vastumandal (90%):** Parametric architectural grids, tributary gravity load distribution, code-based RC section sizing, Soil Bearing Capacity (SBC) pad footing sizing, automated BBS cutting lengths, live material takeoffs ($m^3$ concrete, steel tonnage, formwork $m^2$), and municipal setback/FAR compliance[cite: 1].
* **Escape-Hatch Exports (10%):** Layer-separated DXF, industry-standard IFC models, AutoLISP automation scripts, and structural node load sheets for deep finite element analysis or high-density MEP coordination[cite: 1].

---

## Core Features

* **Deterministic Monorepo Engine:** Pure mathematical calculation modules isolated from UI state, enabling millisecond re-computation on grid edits[cite: 1].
* **Zero-Install Web Worker Compute:** Spatial solving, load aggregation, and file serialization run on background threads (`engine.worker.ts`) to ensure 60 FPS viewport performance[cite: 1].
* **Automated Bar Bending Schedule (BBS):** Generates bar marks, hook allowances, bend deductions, and weight-by-diameter summaries instantly[cite: 1].
* **Soil Bearing Capacity Footing Sizer:** Dynamically dimensions pad footing footings ($L \times B \times D$) and mesh steel reinforcement from axial column loads and soil SBC inputs ($kN/m^2$)[cite: 1].
* **Live Material & Cost Estimator:** Real-time Bill of Quantities tracking concrete volume, masonry deductions for openings, and customizable regional rate cards[cite: 1].
* **Bylaw & Sanction Assistant:** Built-in validation rules for Floor Space Index (FSI/FAR), mandatory setbacks, ground coverage, and staircase riser/tread safety ratios[cite: 1].

---

## Monorepo Structure


```

vastumandal/
├── apps/
│   └── web/                   # Next.js workspace UI, CAD viewport, Web Worker runner
├── packages/
│   ├── dwg-schemas/           # Canonical Zod schemas & shared data contracts
│   ├── core-spatial/          # 2D/3D spatial solvers, wall grids, bylaw validation
│   ├── core-structural/       # Tributary load paths, RC sizing, SBC footing engine
│   ├── core-estimator/        # Volumetric takeoffs, steel tonnage, live BOQ
│   ├── dxf-exporter/          # Standardized multi-layer 2D CAD serializer
│   ├── ifc-exporter/          # IFC STEP BIM entity serializer (IfcWall, IfcBeam, etc.)
│   ├── structural-exporter/   # Formatted structural load cards for ETABS/STAAD
│   ├── mesh-exporter/         # 3D surface mesh generation
│   └── pdf-exporter/          # Client-ready estimate sheets and BBS schedules
└── public/
└── vastumandal-import.lsp # AutoLISP bridge script for AutoCAD drafting

```

---

## Getting Started

### Prerequisites

* **Node.js:** `>= 20.0.0`
* **Package Manager:** `pnpm >= 9.0.0`[cite: 1]

### Installation

```bash
# Clone the repository
git clone [https://github.com/rahuldhole/vastumandal.git](https://github.com/rahuldhole/vastumandal.git)
cd vastumandal

# Install all dependencies across workspaces
pnpm install

```

### Development Scripts

```bash
# Start the web workbench locally (http://localhost:3000)
pnpm dev

# Run unit tests across all core calculation packages
pnpm test

# Run Vitest in watch mode
pnpm test:watch

# Typecheck and lint the monorepo
pnpm check
pnpm lint

# Build all packages and the Next.js production bundle
pnpm build

```

---

## Architecture & Data Contracts

All core calculation packages (`core-spatial`, `core-structural`, `core-estimator`) are **pure, side-effect-free libraries**. They ingest canonical models defined in `@vastumandal/dwg-schemas` and output computed schemas without DOM or browser dependencies:

```typescript
import { calculateTributaryLoads, sizeIsolatedFooting } from '@vastumandal/core-structural';
import { generateBOQ } from '@vastumandal/core-estimator';
import { exportToDXF } from '@vastumandal/dxf-exporter';

// 1. Calculate structural loading and footing geometry
const structuralModel = calculateTributaryLoads(spatialLayout);
const footings = sizeIsolatedFooting(structuralModel.columns, { safeBearingCapacity: 200 });

// 2. Compute live quantities
const boq = generateBOQ(spatialLayout, structuralModel, rateCard);

// 3. Export to production CAD
const dxfContent = exportToDXF(spatialLayout, structuralModel);

```

---

## Tech Stack

* **Framework:** Next.js (App Router), React, Tailwind CSS


* **Language & Validation:** TypeScript, Zod


* **Testing:** Vitest


* **Concurrency:** Web Workers (Comlink / Dedicated Worker Pipeline)


* **CAD/BIM Output:** Raw DXF (ASCII/R12/2000), IFC2x3 / IFC4 STEP schema


