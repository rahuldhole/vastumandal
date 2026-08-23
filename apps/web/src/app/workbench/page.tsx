import ControlPanel from "@/components/ControlPanel";
import CADViewport from "@/components/CADViewport";
import LiveBOQPanel from "@/components/LiveBOQPanel";

export default function Workbench() {
  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      <ControlPanel />
      <CADViewport />
      <LiveBOQPanel />
    </div>
  );
}
