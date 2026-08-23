import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
 BeamScheduleRow, 
 TankScheduleRow, 
 ColumnScheduleRow, 
 SlabScheduleRow, 
 FoundationScheduleRow,
 StairsScheduleRow,
 TitleBlockRow
} from '@rdcad-express/dwg-schemas';

type TextNode = {
 id: string;
 text: string;
 x: number;
 y: number;
};

interface AppState {
 beamData: BeamScheduleRow;
 setBeamData: (data: BeamScheduleRow) => void;
 
 tankData: TankScheduleRow;
 setTankData: (data: TankScheduleRow) => void;
 
 colData: ColumnScheduleRow;
 setColData: (data: ColumnScheduleRow) => void;
 
 slabData: SlabScheduleRow;
 setSlabData: (data: SlabScheduleRow) => void;
 
 fdnData: FoundationScheduleRow;
 setFdnData: (data: FoundationScheduleRow) => void;
 
 stairsData: StairsScheduleRow;
 setStairsData: (data: StairsScheduleRow) => void;
 
 templateData: TitleBlockRow;
 setTemplateData: (data: TitleBlockRow) => void;
 
 // Utility states
 nodes: TextNode[];
 setNodes: (nodes: TextNode[]) => void;
 prefix: string;
 setPrefix: (prefix: string) => void;
 startNum: number;
 setStartNum: (num: number) => void;
 findText: string;
 setFindText: (text: string) => void;
 replaceText: string;
 setReplaceText: (text: string) => void;
 // Project state
 projectItems: { id: string; name: string; type: string; dxfString: string }[];
 addToProject: (item: { id: string; name: string; type: string; dxfString: string }) => void;
 removeFromProject: (id: string) => void;
 clearProject: () => void;
 
 projectModalData: { type: string; defaultName: string; dxfString: string } | null;
 setProjectModalData: (data: { type: string; defaultName: string; dxfString: string } | null) => void;
}

export const useAppStore = create<AppState>()(
 persist(
 (set) => ({
 beamData: {
 elementId: "B1",
 width: 300,
 depth: 450,
 bottomBarDia: 16,
 bottomBarCount: 3,
 topExtraLeft: 2,
 topExtraRight: 2,
 stirrupDia: 8,
 stirrupSpacing: 150,
 },
 setBeamData: (data) => set({ beamData: data }),
 
 tankData: {
 tankId: "T1",
 type: "UNDERGROUND",
 capacity: 50000,
 width: 3000,
 length: 5000,
 height: 3500,
 wallThickness: 250,
 mainBarDia: 12,
 mainBarSpacing: 150,
 },
 setTankData: (data) => set({ tankData: data }),
 
 colData: {
 columnId: "C1",
 level: "GF",
 concreteGrade: "M30",
 width: 400,
 depth: 400,
 mainBarCount: 8,
 mainBarDia: 20,
 tieDia: 8,
 tieSpacing: 150,
 },
 setColData: (data) => set({ colData: data }),
 
 slabData: {
 slabId: "S1",
 lx: 4000,
 ly: 5000,
 depth: 150,
 mainBarDia: 10,
 mainBarSpacing: 150,
 distBarDia: 8,
 distBarSpacing: 200,
 },
 setSlabData: (data) => set({ slabData: data }),
 
 fdnData: {
 footingId: "F1",
 lx: 2000,
 ly: 2000,
 depth: 450,
 meshBarDiaX: 12,
 meshBarSpacingX: 150,
 meshBarDiaY: 12,
 meshBarSpacingY: 150,
 },
 setFdnData: (data) => set({ fdnData: data }),
 
 stairsData: {
 stairId: "ST1",
 tread: 250,
 rise: 150,
 numberOfSteps: 10,
 waistSlabThickness: 150,
 mainBarDia: 12,
 mainBarSpacing: 150,
 distBarDia: 8,
 distBarSpacing: 200,
 },
 setStairsData: (data) => set({ stairsData: data }),
 
 templateData: {
 sheetSize: 'A1',
 projectName: 'Residential Building',
 clientName: 'Acme Corp',
 date: new Date().toISOString().split('T')[0],
 drawnBy: 'Engineer',
 drawingTitle: 'Structural Details'
 },
 setTemplateData: (data) => set({ templateData: data }),
 
 nodes: [],
 setNodes: (nodes) => set({ nodes }),
 prefix: "B",
 setPrefix: (prefix) => set({ prefix }),
 startNum: 1,
 setStartNum: (num) => set({ startNum: num }),
 findText: "",
 setFindText: (text) => set({ findText: text }),
 replaceText: "",
 setReplaceText: (text) => set({ replaceText: text }),

 projectItems: [],
 addToProject: (item) => set((state) => ({ projectItems: [...state.projectItems, item] })),
 removeFromProject: (id) => set((state) => ({ projectItems: state.projectItems.filter((i) => i.id !== id) })),
 clearProject: () => set({ projectItems: [] }),
 
 projectModalData: null,
 setProjectModalData: (data) => set({ projectModalData: data }),
 }),
 {
 name: 'rdcad-storage',
 }
 )
);
