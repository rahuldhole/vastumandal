# VASTUMANDAL — Design System & UI/UX Specification

## 1. Design Philosophy: Divine Geometric Precision
Vastumandal blends traditional Vedic sacred geometry (Mandala / Yantra balance) with modern CAD/BIM workstation ergonomics. The visual tone is technical, disciplined, and refined—balancing deep obsidian and warm stone neutrals with subtle, energized accents of sacred vermilion, ochre, and brass.

The application is engineered strictly as an **Interactive Workbench / Dashboard**, not a marketing landing page.

---

## 2. Color Palette & Design Tokens

### Dark Canvas Theme (Primary CAD Viewport)
- **Space / Base Background (`--bg-mandala`):** `#0c0d10` (Deep obsidian)
- **Panel / Surface 1 (`--bg-surface-1`):** `#14161b` (Charcoal slate)
- **Panel / Surface 2 (`--bg-surface-2`):** `#1c1f26` (Subtle elevated card)
- **Borders & Grid Lines (`--border-grid`):** `#292d39` / `#1e222d`

### Sacred Accents & Active States
- **Agni / Vermilion (`--accent-agni`):** `#e65100` / `#ff5722` (SE quadrant, warnings, heat markers)
- **Soma / Ochre Gold (`--accent-gold`):** `#d4af37` / `#f59e0b` (Active selection, Vastu highlights, Brahmasthan marker)
- **Vayu / Cyan-Ice (`--accent-vayu`):** `#06b6d4` (NW quadrant, dimension strings, snap vectors)
- **Prithvi / Earth Brown (`--accent-earth`):** `#78350f` (SW Master structural anchoring)
- **IS 456 Concrete Grey (`--cad-concrete`):** `#94a3b8` (Column/beam framing)
- **Rebar Steel Blue (`--cad-steel`):** `#38bdf8` (Reinforcement bars and BBS markers)

---

## 3. Typography
- **UI & Numbers:** `JetBrains Mono` or `Fira Code` for all coordinate readouts, dimensions, costs, and data tables.
- **Labels & Controls:** `Plus Jakarta Sans` or `Inter` (geometric, legible at 11px–13px).
- **Mandala Headings & Zone Tags:** `Cinzel` or `Space Grotesk` (all-caps, tracking-wide).

---

## 4. Workbench Dashboard Layout (3-Pane Workspace)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: Project Title | Grid Snap: 100mm | Vastu Compliance Score: 94% | Export (DXF/PDF)│
├─────────────┬────────────────────────────────────────────────────────────┬─────────────┤
│ LEFT PANEL  │ CENTER VIEWPORT (Dual Mode: 2D Floorplan / 3D Isometric)   │ RIGHT PANEL │
│ (18% Width) │                                                            │ (22% Width) │
│             │  ┌──────────────────────────────────────────────────────┐  │             │
│ • Plot Spec │  │                                                      │  │ • IS 456    │
│ • Direction │  │                  8-Pada Yantra Grid                  │  │   Framing   │
│   Orientation│ │                                                      │  │ • Concrete  │
│ • Room Tree │  │             [ Interactive SVG / Three.js ]           │  │   Volume    │
│ • Vastu     │  │                                                      │  │ • Steel (kg)│
│   Constraints│ │                                                      │  │ • Live BOQ  │
│             │  └──────────────────────────────────────────────────────┘  │   Cost      │
│             │  BOTTOM TRAY: Console / Validation Warnings / BBS Summary  │   Ledger    │
└─────────────┴────────────────────────────────────────────────────────────┴─────────────┘
```

---

## 5. UI Micro-Components & Sacred Geometry Touches

### A. Ashta-Dikpalaka Orientation HUD
- A dynamic compass rose docked in the top-right of the viewport.
- Highlights Cardinal Directions (N, E, S, W) and Intercardinal Vastu Deities (NE - Ishanya, SE - Agni, SW - Nairuthi, NW - Vayu).
- Rotates dynamically if the plot orientation is non-zero.

### B. Mandala Grid Overlay (Toggleable)
- 9-zone (Peetha / Pitha Mandala) and 81-zone (Paramasayika Mandala) SVG grid overlay.
- Subtle golden line weights (`rgba(212, 175, 55, 0.15)`) with center Brahmasthan bounding square.

### C. Live IS 456 Structural & Cost Ledger
- Floating glassmorphic cards displaying live material readouts:
  - Concrete: `28.4 m³` (M20 grade)
  - Fe500 Rebar: `2,840 kg`
  - Total Estimated Cost: `₹14,20,000` (auto-calculated per square foot / regional unit rate).

### D. Export Modal
- Single-click production actions:
  - **AutoCAD (`.dxf`):** Layer-separated drawing sheet.
  - **3D Model (`.obj`):** 3ds Max / Revit compatible with wall cutouts.
  - **Civil Estimate (`.pdf`):** Formal municipal-ready floorplan with itemized BOQ.
