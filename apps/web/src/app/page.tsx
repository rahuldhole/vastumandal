import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 pt-12 md:pt-24">
      <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide border border-primary/20">
        Vastumandal 0.1.0 Beta
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Zero-Install <br className="md:hidden" /> <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Civil Engineering</span>
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
        Automate 90% of routine workflows for G to G+4 builds. Instant parametric drafting, structural scheduling, and live cost takeoffs directly in your browser.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/workbench" className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
          Open Workspace
        </Link>
        <Link href="/guide" className="bg-card text-card-foreground px-8 py-4 rounded-lg font-medium text-lg hover:bg-muted transition-all border border-border shadow-sm hover:shadow hover:-translate-y-0.5">
          Read Guide
        </Link>
      </div>
      
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl w-full">
        <div className="p-8 border border-border rounded-xl bg-card shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-primary mb-4 text-3xl">📐</div>
          <h3 className="text-xl font-bold mb-3">Parametric Architecture</h3>
          <p className="text-muted-foreground leading-relaxed">Reactive architectural layouts with instant adjustments for grids, walls, openings, and bylaw validations.</p>
        </div>
        <div className="p-8 border border-border rounded-xl bg-card shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-primary mb-4 text-3xl">🏗️</div>
          <h3 className="text-xl font-bold mb-3">Structural & BOQ</h3>
          <p className="text-muted-foreground leading-relaxed">Automated tributary loading, member sizing, bar bending schedules, and exact concrete volume takeoffs.</p>
        </div>
        <div className="p-8 border border-border rounded-xl bg-card shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-primary mb-4 text-3xl">📤</div>
          <h3 className="text-xl font-bold mb-3">Production Exports</h3>
          <p className="text-muted-foreground leading-relaxed">Export layer-compliant DXF, valid BIM IFC, structural points for ETABS/STAAD, and client PDF reports.</p>
        </div>
      </div>
    </div>
  );
}
