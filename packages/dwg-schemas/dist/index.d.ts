import { z } from 'zod';
export declare const PlotSpecSchema: z.ZodObject<{
    width: z.ZodNumber;
    length: z.ZodNumber;
    facing: z.ZodEnum<{
        N: "N";
        S: "S";
        E: "E";
        W: "W";
    }>;
    setbacks: z.ZodObject<{
        front: z.ZodNumber;
        rear: z.ZodNumber;
        left: z.ZodNumber;
        right: z.ZodNumber;
    }, z.core.$strip>;
    roadWidth: z.ZodNumber;
    floorCount: z.ZodEnum<{
        G: "G";
        "G+1": "G+1";
    }>;
}, z.core.$strip>;
export type PlotSpec = z.infer<typeof PlotSpecSchema>;
export declare const RequirementSpecSchema: z.ZodObject<{
    bhk: z.ZodEnum<{
        "1BHK": "1BHK";
        "2BHK": "2BHK";
        "3BHK": "3BHK";
    }>;
    pujaRoom: z.ZodBoolean;
    toilets: z.ZodObject<{
        attached: z.ZodBoolean;
        common: z.ZodBoolean;
        type: z.ZodEnum<{
            Indian: "Indian";
            Western: "Western";
        }>;
    }, z.core.$strip>;
    parking: z.ZodBoolean;
    porch: z.ZodBoolean;
}, z.core.$strip>;
export type RequirementSpec = z.infer<typeof RequirementSpecSchema>;
export declare const RoomSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<{
        porch: "porch";
        living: "living";
        master_bedroom: "master_bedroom";
        bedroom: "bedroom";
        kitchen: "kitchen";
        toilet_common: "toilet_common";
        toilet_attached: "toilet_attached";
        pooja: "pooja";
    }>;
    bounds: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        length: z.ZodNumber;
    }, z.core.$strip>;
    doors: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    windows: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        sill: z.ZodNumber;
        lintel: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Room = z.infer<typeof RoomSchema>;
export declare const ColumnSchema: z.ZodObject<{
    id: z.ZodString;
    center: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>;
    dimensions: z.ZodObject<{
        width: z.ZodNumber;
        depth: z.ZodNumber;
    }, z.core.$strip>;
    orientation: z.ZodEnum<{
        "0deg": "0deg";
        "90deg": "90deg";
    }>;
    reinforcementLabel: z.ZodString;
}, z.core.$strip>;
export type Column = z.infer<typeof ColumnSchema>;
export declare const FloorPlanSchema: z.ZodObject<{
    plotBounds: z.ZodObject<{
        width: z.ZodNumber;
        length: z.ZodNumber;
    }, z.core.$strip>;
    buildableEnvelope: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        length: z.ZodNumber;
    }, z.core.$strip>;
    rooms: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<{
            porch: "porch";
            living: "living";
            master_bedroom: "master_bedroom";
            bedroom: "bedroom";
            kitchen: "kitchen";
            toilet_common: "toilet_common";
            toilet_attached: "toilet_attached";
            pooja: "pooja";
        }>;
        bounds: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            length: z.ZodNumber;
        }, z.core.$strip>;
        doors: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>>;
        windows: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
            sill: z.ZodNumber;
            lintel: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    columns: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        center: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>;
        dimensions: z.ZodObject<{
            width: z.ZodNumber;
            depth: z.ZodNumber;
        }, z.core.$strip>;
        orientation: z.ZodEnum<{
            "0deg": "0deg";
            "90deg": "90deg";
        }>;
        reinforcementLabel: z.ZodString;
    }, z.core.$strip>>;
    circulationSpines: z.ZodArray<z.ZodObject<{
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    scheduleOfOpenings: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            door: "door";
            window: "window";
            ventilator: "ventilator";
        }>;
        dimensions: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>;
        count: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type FloorPlan = z.infer<typeof FloorPlanSchema>;
export declare const BOQReportSchema: z.ZodObject<{
    quantities: z.ZodObject<{
        steelMT: z.ZodNumber;
        cementBags: z.ZodNumber;
        sandCuFt: z.ZodNumber;
        aggregateCuFt: z.ZodNumber;
        bricksCount: z.ZodNumber;
    }, z.core.$strip>;
    phases: z.ZodObject<{
        substructure: z.ZodNumber;
        rccFraming: z.ZodNumber;
        masonry: z.ZodNumber;
        plumbingElectrical: z.ZodNumber;
        finishing: z.ZodNumber;
    }, z.core.$strip>;
    totalCost: z.ZodNumber;
}, z.core.$strip>;
export type BOQReport = z.infer<typeof BOQReportSchema>;
