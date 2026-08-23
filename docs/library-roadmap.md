# Asset Library Roadmap (Parametric Recreation)

Instead of manually converting 500+ legacy binary `.dwg` files, we will algorithmically recreate these assets as pure, parametric TypeScript functions.

## Why this approach is better:
1. **Zero Copyright Risk**: By generating the vector geometry from scratch using math and code, we completely bypass any intellectual property or licensing issues attached to the legacy `.dwg` files.
2. **Infinite Customization**: Instead of having 50 static "Door" blocks for different sizes, we have one `exportDoorDXF({ width, height })` function that can generate *any* size dynamically.
3. **Lightweight**: We don't need to ship megabytes of binary CAD files in the web application.

---

## 📅 Roadmap: Programmatic Asset Categories

### Phase 1: Architectural Openings (Completed)
- [x] Standard Door (Single Swing)
- [x] Standard Window (Fixed Glass)
- [x] Double Swing Doors
- [x] Sliding Glass Doors
- [x] Garage / Roller Doors

### Phase 2: Structural & Drafting Annotations (Completed)
- [x] North Arrow Symbol
- [x] Section Markers & Callouts
- [x] Elevation Targets
- [x] Revision Clouds
- [x] Grid Line Bubbles (Dynamic text insertion)

### Phase 3: Furniture & Plumbing (Completed)
- [x] Standard Desk (Parametric width/depth)
- [x] Conference Table (Parametric seating)
- [x] Toilet / Water Closet (Standard plan view)
- [x] Sinks & Basins (Single and double)

### Phase 4: Landscaping & Site (Completed)
- [x] Trees (Algorithmic fractal branching in plan view)
- [x] Shrubs & Hedges
- [x] Parking Bays (Parametric array generator)
- [x] Standard Vehicles (Simplified 2D bounding geometries)

### Phase 5: Electrical & Mechanical Symbols (Completed)
- [x] Light Fixtures (Ceiling, Wall, Spots)
- [x] Sockets & Switches
- [x] Distribution Boards (DB)
- [x] HVAC Vents & Returns
