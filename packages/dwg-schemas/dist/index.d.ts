export interface RebarElement {
    elementMark: string;
    shapeCode: string;
    diameter: number;
    numberOfMembers: number;
    barsPerMember: number;
    cuttingLength: number;
    totalWeight: number;
}
export interface BeamScheduleRow {
    elementId: string;
    width: number;
    depth: number;
    bottomBarDia: number;
    bottomBarCount: number;
    topExtraLeft: number;
    topExtraRight: number;
    stirrupDia: number;
    stirrupSpacing: number;
}
export interface ColumnScheduleRow {
    columnId: string;
    level: string;
    concreteGrade: string;
    width: number;
    depth: number;
    mainBarCount: number;
    mainBarDia: number;
    tieDia: number;
    tieSpacing: number;
}
export interface SlabScheduleRow {
    slabId: string;
    lx: number;
    ly: number;
    depth: number;
    mainBarDia: number;
    mainBarSpacing: number;
    distBarDia: number;
    distBarSpacing: number;
}
export interface FoundationScheduleRow {
    footingId: string;
    lx: number;
    ly: number;
    depth: number;
    meshBarDiaX: number;
    meshBarSpacingX: number;
    meshBarDiaY: number;
    meshBarSpacingY: number;
}
export interface TankScheduleRow {
    tankId: string;
    type: 'UNDERGROUND' | 'OVERHEAD';
    capacity: number;
    width: number;
    length: number;
    height: number;
    wallThickness: number;
    mainBarDia: number;
    mainBarSpacing: number;
}
export interface StairsScheduleRow {
    stairId: string;
    tread: number;
    rise: number;
    numberOfSteps: number;
    waistSlabThickness: number;
    mainBarDia: number;
    mainBarSpacing: number;
    distBarDia: number;
    distBarSpacing: number;
}
export interface TitleBlockRow {
    sheetSize: 'A1' | 'A2' | 'A3';
    projectName: string;
    clientName: string;
    date: string;
    drawnBy: string;
    drawingTitle: string;
}
