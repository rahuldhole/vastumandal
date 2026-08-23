import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
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
 
 rates: { steel: number; cement: number; sand: number; aggregate: number; brick: number; columnSize: string; sbc?: number };
 setRates: (data: Partial<{ steel: number; cement: number; sand: number; aggregate: number; brick: number; columnSize: string; sbc?: number }>) => void;
 
 activeTab: '2D' | '3D' | 'IFC';
 setActiveTab: (tab: '2D' | '3D' | 'IFC') => void;
 
 layers: { vastu: boolean; zones: boolean; grid: boolean; dims: boolean; openings: boolean };
 setLayers: (layers: Partial<{ vastu: boolean; zones: boolean; grid: boolean; dims: boolean; openings: boolean }>) => void;

 // Worker results
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 boqResult: any | null;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 setBoqResult: (result: any) => void;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 geometryResult: any | null;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 setGeometryResult: (result: any) => void;
 isCalculating: boolean;
 setIsCalculating: (isCalc: boolean) => void;
 
 // UI State
 leftPanelOpen: boolean;
 setLeftPanelOpen: (isOpen: boolean) => void;
 rightPanelOpen: boolean;
 setRightPanelOpen: (isOpen: boolean) => void;
 
  // State restoration
  restoreState: (state: Partial<AppState>) => void;
  resetProject: () => void;
}

const initialState = {
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
  tankData: {
    tankId: "T1",
    type: "UNDERGROUND" as const,
    capacity: 50000,
    width: 3000,
    length: 5000,
    height: 3500,
    wallThickness: 250,
    mainBarDia: 12,
    mainBarSpacing: 150,
  },
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
  templateData: {
    sheetSize: 'A1',
    projectName: 'Residential Building',
    clientName: 'Acme Corp',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'Engineer',
    drawingTitle: 'Structural Details'
  },
  nodes: [],
  prefix: "B",
  startNum: 1,
  findText: "",
  replaceText: "",
  projectItems: [],
  plotSpec: {
    width: 30,
    length: 40,
    facing: 'E',
    setbacks: { front: 5, rear: 3, left: 3, right: 3 },
    roadWidth: 20,
    floorCount: 'G',
  } as PlotSpec,
  reqSpec: {
    bhk: '2BHK',
    pujaRoom: true,
    toilets: { attached: true, common: true, type: 'Western' },
    parking: true,
    porch: true,
  } as RequirementSpec,
  rates: { steel: 65, cement: 380, sand: 60, aggregate: 55, brick: 7, columnSize: "230x380", sbc: 200 },
  layers: { vastu: false, zones: true, grid: true, dims: true, openings: true },
  
  // UI and transient state defaults
  activeTab: '2D' as const,
  boqResult: null,
  geometryResult: null,
  isCalculating: false,
  leftPanelOpen: false,
  rightPanelOpen: false,
};

export const useAppStore = create<AppState>()(
  temporal(
    persist(
      (set) => ({
        ...initialState,
        setBeamData: (data) => set({ beamData: data }),
        setTankData: (data) => set({ tankData: data }),
        setColData: (data) => set({ colData: data }),
        setSlabData: (data) => set({ slabData: data }),
        setFdnData: (data) => set({ fdnData: data }),
        setStairsData: (data) => set({ stairsData: data }),
        setTemplateData: (data) => set({ templateData: data }),
        
        setNodes: (nodes) => set({ nodes }),
        setPrefix: (prefix) => set({ prefix }),
        setStartNum: (num) => set({ startNum: num }),
        setFindText: (text) => set({ findText: text }),
        setReplaceText: (text) => set({ replaceText: text }),

        addToProject: (item) => set((state) => ({ projectItems: [...state.projectItems, item] })),
        removeFromProject: (id) => set((state) => ({ projectItems: state.projectItems.filter((i) => i.id !== id) })),
        clearProject: () => set({ projectItems: [] }),
        
        setPlotSpec: (data) => set((state) => ({ plotSpec: { ...state.plotSpec, ...data } })),
        setReqSpec: (data) => set((state) => ({ reqSpec: { ...state.reqSpec, ...data } })),
        setRates: (data) => set((state) => ({ rates: { ...state.rates, ...data } })),
        
        setActiveTab: (tab) => set({ activeTab: tab }),
        setLayers: (data) => set((state) => ({ layers: { ...state.layers, ...data } })),

        setBoqResult: (result) => set({ boqResult: result }),
        setGeometryResult: (result) => set({ geometryResult: result }),
        setIsCalculating: (isCalc) => set({ isCalculating: isCalc }),
        
        setLeftPanelOpen: (isOpen) => set({ leftPanelOpen: isOpen }),
        setRightPanelOpen: (isOpen) => set({ rightPanelOpen: isOpen }),
        
        restoreState: (newState) => set((state) => ({ ...state, ...newState })),
        resetProject: () => set({ ...initialState, boqResult: null, geometryResult: null }),
      }),
      {
        name: 'vastumandal-storage',
      }
    ),
    {
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { activeTab, leftPanelOpen, rightPanelOpen, isCalculating, boqResult, geometryResult, ...domainState } = state;
        return domainState;
      }
    }
  )
);
