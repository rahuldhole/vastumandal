"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOQReportSchema = exports.FloorPlanSchema = exports.ColumnSchema = exports.RoomSchema = exports.RequirementSpecSchema = exports.PlotSpecSchema = void 0;
const zod_1 = require("zod");
exports.PlotSpecSchema = zod_1.z.object({
    width: zod_1.z.number().positive(),
    length: zod_1.z.number().positive(),
    facing: zod_1.z.enum(['N', 'S', 'E', 'W']),
    setbacks: zod_1.z.object({
        front: zod_1.z.number().min(0),
        rear: zod_1.z.number().min(0),
        left: zod_1.z.number().min(0),
        right: zod_1.z.number().min(0),
    }),
    roadWidth: zod_1.z.number().positive(),
    floorCount: zod_1.z.enum(['G', 'G+1']),
});
exports.RequirementSpecSchema = zod_1.z.object({
    bhk: zod_1.z.enum(['1BHK', '2BHK', '3BHK']),
    pujaRoom: zod_1.z.boolean(),
    toilets: zod_1.z.object({
        attached: zod_1.z.boolean(),
        common: zod_1.z.boolean(),
        type: zod_1.z.enum(['Indian', 'Western']),
    }),
    parking: zod_1.z.boolean(),
    porch: zod_1.z.boolean(),
});
exports.RoomSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: zod_1.z.enum(['living', 'master_bedroom', 'bedroom', 'kitchen', 'toilet_common', 'toilet_attached', 'pooja', 'porch']),
    bounds: zod_1.z.object({
        x: zod_1.z.number(),
        y: zod_1.z.number(),
        width: zod_1.z.number().positive(),
        length: zod_1.z.number().positive(),
    }),
    doors: zod_1.z.array(zod_1.z.object({
        x: zod_1.z.number(),
        y: zod_1.z.number(),
        width: zod_1.z.number(),
        height: zod_1.z.number(),
    })),
    windows: zod_1.z.array(zod_1.z.object({
        x: zod_1.z.number(),
        y: zod_1.z.number(),
        width: zod_1.z.number(),
        height: zod_1.z.number(),
        sill: zod_1.z.number(),
        lintel: zod_1.z.number(),
    })),
});
exports.ColumnSchema = zod_1.z.object({
    id: zod_1.z.string(),
    center: zod_1.z.object({
        x: zod_1.z.number(),
        y: zod_1.z.number(),
    }),
    dimensions: zod_1.z.object({
        width: zod_1.z.number().positive(),
        depth: zod_1.z.number().positive(),
    }),
    orientation: zod_1.z.enum(['0deg', '90deg']),
    reinforcementLabel: zod_1.z.string(),
});
exports.FloorPlanSchema = zod_1.z.object({
    plotBounds: zod_1.z.object({
        width: zod_1.z.number(),
        length: zod_1.z.number(),
    }),
    buildableEnvelope: zod_1.z.object({
        x: zod_1.z.number(),
        y: zod_1.z.number(),
        width: zod_1.z.number(),
        length: zod_1.z.number(),
    }),
    rooms: zod_1.z.array(exports.RoomSchema),
    columns: zod_1.z.array(exports.ColumnSchema),
    circulationSpines: zod_1.z.array(zod_1.z.object({
        points: zod_1.z.array(zod_1.z.object({ x: zod_1.z.number(), y: zod_1.z.number() })),
    })),
    scheduleOfOpenings: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['door', 'window', 'ventilator']),
        dimensions: zod_1.z.object({
            width: zod_1.z.number(),
            height: zod_1.z.number(),
        }),
        count: zod_1.z.number(),
    })),
});
exports.BOQReportSchema = zod_1.z.object({
    quantities: zod_1.z.object({
        steelMT: zod_1.z.number(),
        cementBags: zod_1.z.number(),
        sandCuFt: zod_1.z.number(),
        aggregateCuFt: zod_1.z.number(),
        bricksCount: zod_1.z.number(),
    }),
    phases: zod_1.z.object({
        substructure: zod_1.z.number(),
        rccFraming: zod_1.z.number(),
        masonry: zod_1.z.number(),
        plumbingElectrical: zod_1.z.number(),
        finishing: zod_1.z.number(),
    }),
    totalCost: zod_1.z.number(),
});
