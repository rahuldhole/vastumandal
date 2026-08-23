"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("./index");
const dxf_parser_1 = __importDefault(require("dxf-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Ensure tmp directory exists
const tmpDir = path_1.default.resolve(__dirname, "../../../tmp");
if (!fs_1.default.existsSync(tmpDir)) {
    fs_1.default.mkdirSync(tmpDir, { recursive: true });
}
(0, vitest_1.describe)("dxf-exporter tests", () => {
    (0, vitest_1.it)("should generate a valid DXF string for a beam section and parse without errors", () => {
        const dxfString = (0, index_1.exportBeamSectionToDXF)({
            elementId: "B1",
            width: 300,
            depth: 600,
            bottomBarCount: 3,
            bottomBarDia: 16,
            topExtraLeft: 2,
            topExtraRight: 2,
            stirrupDia: 8,
            stirrupSpacing: 150
        });
        // Write to tmp dir for manual inspection
        const filePath = path_1.default.join(tmpDir, "test-beam-output.dxf");
        fs_1.default.writeFileSync(filePath, dxfString);
        // Basic structure assertions
        (0, vitest_1.expect)(dxfString).toContain("SECTION");
        (0, vitest_1.expect)(dxfString).toContain("ENTITIES");
        (0, vitest_1.expect)(dxfString).toContain("$EXTMIN");
        (0, vitest_1.expect)(dxfString).toContain("$EXTMAX");
        (0, vitest_1.expect)(dxfString).toContain("EOF");
        // Ensure parser runs completely without throwing (e.g. valid structure, valid tables)
        const parser = new dxf_parser_1.default();
        let parsedDxf = null;
        (0, vitest_1.expect)(() => {
            parsedDxf = parser.parseSync(dxfString);
        }).not.toThrow();
        // Ensure the parser populated extents from our fix
        (0, vitest_1.expect)(parsedDxf).toBeDefined();
        (0, vitest_1.expect)(parsedDxf === null || parsedDxf === void 0 ? void 0 : parsedDxf.header['$EXTMIN']).toBeDefined();
        (0, vitest_1.expect)(parsedDxf === null || parsedDxf === void 0 ? void 0 : parsedDxf.header['$EXTMAX']).toBeDefined();
    });
    (0, vitest_1.it)("should generate a valid DXF string for a slab section and parse without errors", () => {
        const dxfString = (0, index_1.exportSlabSectionToDXF)({
            slabId: "S1",
            lx: 4000,
            ly: 5000,
            depth: 150,
            mainBarDia: 10,
            mainBarSpacing: 150,
            distBarDia: 8,
            distBarSpacing: 200
        });
        // Write to tmp dir for manual inspection
        const filePath = path_1.default.join(tmpDir, "test-slab-output.dxf");
        fs_1.default.writeFileSync(filePath, dxfString);
        const parser = new dxf_parser_1.default();
        (0, vitest_1.expect)(() => {
            parser.parseSync(dxfString);
        }).not.toThrow();
    });
    (0, vitest_1.it)("should generate a valid DXF string for a stair section and parse without errors", () => {
        const dxfString = (0, index_1.exportStairsSectionToDXF)({
            stairId: "ST1",
            tread: 250,
            rise: 150,
            numberOfSteps: 10,
            waistSlabThickness: 150,
            mainBarDia: 12,
            mainBarSpacing: 150,
            distBarDia: 8,
            distBarSpacing: 200,
        });
        // Write to tmp dir for manual inspection
        const filePath = path_1.default.join(tmpDir, "test-stairs-output.dxf");
        fs_1.default.writeFileSync(filePath, dxfString);
        const parser = new dxf_parser_1.default();
        (0, vitest_1.expect)(() => {
            parser.parseSync(dxfString);
        }).not.toThrow();
    });
    (0, vitest_1.it)("should generate valid DXF strings for starter assets", () => {
        const doorDXF = (0, index_1.exportDoorDXF)();
        const windowDXF = (0, index_1.exportWindowDXF)();
        const northDXF = (0, index_1.exportNorthSymbolDXF)();
        const doubleDoorDXF = (0, index_1.exportDoubleDoorDXF)();
        const slidingDoorDXF = (0, index_1.exportSlidingDoorDXF)();
        const garageDoorDXF = (0, index_1.exportGarageDoorDXF)();
        const sectionMarkerDXF = (0, index_1.exportSectionMarkerDXF)();
        const elevationTargetDXF = (0, index_1.exportElevationTargetDXF)();
        const revisionCloudDXF = (0, index_1.exportRevisionCloudDXF)();
        const gridBubbleDXF = (0, index_1.exportGridBubbleDXF)();
        const deskDXF = (0, index_1.exportDeskDXF)();
        const conferenceTableDXF = (0, index_1.exportConferenceTableDXF)();
        const toiletDXF = (0, index_1.exportToiletDXF)();
        const sinkDXF = (0, index_1.exportSinkDXF)();
        const treeDXF = (0, index_1.exportTreeDXF)();
        const shrubDXF = (0, index_1.exportShrubDXF)();
        const parkingDXF = (0, index_1.exportParkingBaysDXF)();
        const vehicleDXF = (0, index_1.exportVehicleDXF)();
        const lightDXF = (0, index_1.exportLightFixtureDXF)();
        const socketDXF = (0, index_1.exportSocketSwitchDXF)();
        const dbDXF = (0, index_1.exportDistributionBoardDXF)();
        const hvacDXF = (0, index_1.exportHVACVentDXF)();
        const parser = new dxf_parser_1.default();
        (0, vitest_1.expect)(() => parser.parseSync(doorDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(windowDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(northDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(doubleDoorDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(slidingDoorDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(garageDoorDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(sectionMarkerDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(elevationTargetDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(revisionCloudDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(gridBubbleDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(deskDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(conferenceTableDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(toiletDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(sinkDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(treeDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(shrubDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(parkingDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(vehicleDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(lightDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(socketDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(dbDXF)).not.toThrow();
        (0, vitest_1.expect)(() => parser.parseSync(hvacDXF)).not.toThrow();
    });
    (0, vitest_1.it)("should generate a valid DXF string for a title block template", () => {
        const dxfString = (0, index_1.exportTemplateToDXF)({
            sheetSize: 'A1',
            projectName: 'Test Project',
            clientName: 'Test Client',
            date: '2026-01-01',
            drawnBy: 'Engineer',
            drawingTitle: 'Test Drawing'
        });
        const filePath = path_1.default.join(tmpDir, "test-template-output.dxf");
        fs_1.default.writeFileSync(filePath, dxfString);
        const parser = new dxf_parser_1.default();
        (0, vitest_1.expect)(() => {
            parser.parseSync(dxfString);
        }).not.toThrow();
    });
});
