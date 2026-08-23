# rdcad-express Roadmap

This document outlines the milestones and progress for fully replacing the legacy CAD plugin with a modern, web-first local application.

## 🟢 Milestone 1: Bar Bending Schedule (BBS) Generator
*Status: Completed*
- [x] Extract legacy CAD table schemas to TypeScript interfaces
- [x] Implement core engineering math (`core-math`) for rebar weight and bend deductions
- [x] Build interactive, parametric data grid for BBS data entry
- [x] Setup modern Next.js architecture with Tailwind CSS

## 🟢 Milestone 2: Beam & Column Detailing Modules
*Status: Completed*
- [x] Implement parametric forms for beam and column dimensions/reinforcement
- [x] Build a live 2D preview engine using HTML5 Canvas (`konva.js` or `fabric.js`)
- [x] Develop the DXF Vector Generator to export native `.dxf` CAD files
- [x] Integrate DXF exporting with the UI

## 🟢 Milestone 3: Sequential Renumbering & Grid Utilities
*Status: Completed*
- [x] Interactive canvas tool to place and auto-number elements (e.g. B1, B2)
- [x] Find & Replace prefix/suffix tools for drawing labels

## 🟢 Milestone 4: Slab & Foundation Modules
*Status: Completed*
- [x] 1-Way and 2-Way slab rebar calculator and schedule generator
- [x] Isolated footing & pile cap parametric section generator

## 🟢 Milestone 5: Specialized Structural Tanks (Water Tanks)
*Status: Completed*
- [x] Rectangular and Circular underground tank sections
- [x] Overhead water tank section generators

## 🟢 Milestone 6: Stairs Detailing Module
*Status: Completed*
- [x] Parametric staircase calculation engine (treads, risers, reinforcement)
- [x] Real-time 2D Canvas preview for staircase sections
- [x] Export DXF stair details

## 🟢 Milestone 7: Architectural Asset Library (DXF Gallery)
*Status: Completed*
- [x] Web Gallery interface to browse architectural standard symbols
- [x] Generator for standard DXF blocks (Doors, Windows, North Symbol)
- [x] Direct download mechanism to obtain standalone `dxf` asset files

## 🟢 Milestone 8: Drawing Templates & Title Blocks
*Status: Completed*
- [x] Implement standard Sheet borders (A1, A2, A3)
- [x] Parametric input for project metadata (Project Name, Client, Date)
- [x] Generator for exporting the Title Block as a DXF sheet
