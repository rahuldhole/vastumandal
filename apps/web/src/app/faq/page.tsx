export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">Common questions about Vastumandal.</p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-foreground">Do I need to install anything?</h3>
          <p className="text-muted-foreground leading-relaxed">
            No. Vastumandal is an ultra-fast, zero-install application. Everything runs directly in your browser using highly optimized Web Workers. No massive desktop downloads required.
          </p>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-foreground">What kind of structures does it support?</h3>
          <p className="text-muted-foreground leading-relaxed">
            It is specifically optimized for low-to-mid rise residential and light commercial builds, typically Ground to G+4 stories. It excels at rapid iteration for these standard typologies.
          </p>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-foreground">Can I export my designs to CAD and BIM?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Yes. Vastumandal supports production-grade exports including layer-compliant DXF (Walls, Columns, Beams, etc.) and valid BIM IFC STEP files (`IfcWall`, `IfcColumn`, etc.).
          </p>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-foreground">Does it perform dynamic seismic/wind analysis?</h3>
          <p className="text-muted-foreground leading-relaxed">
            No. Our core calculator handles code-compliant gravity load distribution (tributary areas) and preliminary sizing. For advanced dynamic non-linear finite element seismic or wind solving, you should export your geometry and point loads to specialized software like ETABS or STAAD.
          </p>
        </div>
      </div>
    </div>
  );
}
