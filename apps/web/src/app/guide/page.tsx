import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Vastumandal Guide</h1>
        <p className="text-xl text-muted-foreground">A comprehensive overview of the civil engineering accelerator.</p>
      </div>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Introduction</h2>
          <div className="text-muted-foreground space-y-4 leading-relaxed">
            <p>Vastumandal is built to eliminate the disjointed loop of manual AutoCAD drafting, Excel calculation sheets, and handbook lookups.</p>
            <p>By providing a reactive parametric workspace, it generates production-ready drawings, structural schedules, and live cost takeoffs in real time.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">The 90/10 Rule</h2>
          <div className="text-muted-foreground space-y-4 leading-relaxed">
            <p>We maintain strict product boundaries to avoid software bloat. Vastumandal focuses exclusively on the highly repetitive <strong>90%</strong> of routine residential and light commercial work (typically Ground to G+4 stories).</p>
            <p>For the remaining <strong>10%</strong>—such as complex non-linear finite element seismic/wind solvers, organic surface sculpting, or multi-tier ERP scheduling—we provide robust exports (DXF, IFC, ETABS point loads) to hand off to specialized desktop suites.</p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Monorepo Architecture</h2>
          <div className="text-muted-foreground space-y-4 leading-relaxed">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>dwg-schemas:</strong> Canonical TypeScript schemas defining structural members, footing parameters, and BOQ items.</li>
              <li><strong>core-spatial:</strong> Pure geometric algorithms for 2D floor grid generation and bylaw validation.</li>
              <li><strong>core-structural:</strong> Deterministic tributary load calculators, preliminary RC section sizing, and rebar logic.</li>
              <li><strong>core-estimator:</strong> Reactive BOQ math engine calculating concrete volumes and steel weight schedules.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Getting Started</h2>
          <div className="text-muted-foreground space-y-4 leading-relaxed">
            <p>Navigate to the <Link href="/workbench" className="text-primary hover:underline font-medium">Workspace</Link> to begin modeling your structure. The interface runs entirely in the client browser, relying on optimized Web Workers for 60 FPS interactions.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
