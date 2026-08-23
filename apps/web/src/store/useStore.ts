import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
 BeamScheduleRow, 
 TankScheduleRow, 
 ColumnScheduleRow, 
 SlabScheduleRow, 
 FoundationScheduleRow,
 StairsScheduleRow,
 TitleBlockRow,
 PlotSpec,
 RequirementSpec
} from '@vastumandal/dwg-schemas';

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
 
 // Studio state
 plotSpec: PlotSpec;
 setPlotSpec: (data: Partial<PlotSpec>) => void;
 
 reqSpec: RequirementSpec;
 setReqSpec: (data: Partial<RequirementSpec>) => void;
 
 rates: { steel: number; cement: number; sand: number; aggregate: number; brick: number; columnSize: string };
 setRates: (data: Partial<{ steel: number; cement: number; sand: number; aggregate: number; brick: number; columnSize: string }>) => void;
 
 activeTab: '2D' | '3D';
 setActiveTab: (tab: '2D' | '3D') => void;
 
 layers: { zones: boolean; grid: boolean; dims: boolean; openings: boolean };
 setLayers: (layers: Partial<{ zones: boolean; grid: boolean; dims: boolean; openings: boolean }>) => void;

 // Worker results
 boqResult: any | null;
 setBoqResult: (result: any) => void;
 geometryResult: any | null;
 setGeometryResult: (result: any) => void;
 isCalculating: boolean;
 setIsCalculating: (isCalc: boolean) => void;
 
 // UI State
 leftPanelOpen: boolean;
 setLeftPanelOpen: (isOpen: boolean) => void;
 rightPanelOpen: boolean;
 setRightPanelOpen: (isOpen: boolean) => void;
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
 
 plotSpec: {
 width: 30,
 length: 40,
 facing: 'E',
 setbacks: { front: 5, rear: 3, left: 3, right: 3 },
 roadWidth: 20,
 floorCount: 'G',
 },
 setPlotSpec: (data) => set((state) => ({ plotSpec: { ...state.plotSpec, ...data } })),
 
 reqSpec: {
 bhk: '2BHK',
 pujaRoom: true,
 toilets: { attached: true, common: true, type: 'Western' },
 parking: true,
 porch: true,
 },
 setReqSpec: (data) => set((state) => ({ reqSpec: { ...state.reqSpec, ...data } })),
 
 rates: { steel: 65, cement: 380, sand: 60, aggregate: 55, brick: 7, columnSize: "230x380" },
 setRates: (data) => set((state) => ({ rates: { ...state.rates, ...data } })),
 
 activeTab: '2D',
 setActiveTab: (tab) => set({ activeTab: tab }),
 
 layers: { zones: true, grid: true, dims: true, openings: true },
 setLayers: (data) => set((state) => ({ layers: { ...state.layers, ...data } })),

 boqResult: null,
 setBoqResult: (result) => set({ boqResult: result }),
 geometryResult: null,
 setGeometryResult: (result) => set({ geometryResult: result }),
 isCalculating: false,
 setIsCalculating: (isCalc) => set({ isCalculating: isCalc }),
 
 leftPanelOpen: false,
 setLeftPanelOpen: (isOpen) => set({ leftPanelOpen: isOpen }),
 rightPanelOpen: false,
 setRightPanelOpen: (isOpen) => set({ rightPanelOpen: isOpen }),
 }),
 {
 name: 'vastumandal-storage',
 }
 )
);
