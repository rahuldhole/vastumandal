import React from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, Code, Layers, Cpu, Compass, Copy } from "lucide-react";
import { ProtectedEmail } from "@/components/ProtectedEmail";
import { PwaInstallButton } from "@/components/PwaInstallButton";

export default function MarketingPage() {
 return (
 <div className="min-h-screen bg-background text-foreground overflow-hidden relative transition-colors">
 {/* Background decorations */}
 <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
 <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none" />

 {/* Hero Section */}
 <section className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 /80 border border-slate-400 dark:border-slate-200 text-sm font-medium text-primary dark:text-primary mb-8 backdrop-blur-sm transition-colors">
 <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
 RDCAD Express Open Source
 </div>
 
 <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent transition-colors">
 Parametric Structural <br className="hidden md:block" />
 <span className="bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">Detailing Reimagined</span>
 </h1>
 
 <p className="text-lg md:text-xl text-muted-foreground dark:text-slate-300 max-w-3xl mb-12 transition-colors">
 An advanced suite of open-source engineering tools for generating accurate Bar Bending Schedules, DXF exports, and detailed structural designs instantly.
 </p>
 
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-3xl mx-auto">
 <Link href="/guide" className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] w-full sm:w-auto">
 Startup Guide
 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
 </Link>
 <div className="w-full sm:w-auto">
 <PwaInstallButton />
 </div>
 <a href="https://github.com/rahuldhole/rdcad-express" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-8 py-4 bg-background hover:bg-background dark:hover:bg-muted text-foreground rounded-full font-semibold transition-all border border-border hover:border-border dark:hover:border-border w-full sm:w-auto">
 <GitBranch className="w-5 h-5" />
 GitHub
 </a>
 </div>
 <div className="mt-8">
 <a href="https://github.com/rahuldhole/rdcad-express/issues" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground dark:hover:text-foreground transition flex items-center gap-2">
 Found a bug or have a suggestion? <span className="text-red-700 dark:text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-400 dark:hover:text-red-300 underline decoration-red-400/30 underline-offset-4">Report an Issue</span>
 </a>
 </div>
 </section>

 {/* CAD Integration Section */}
 <section className="py-24 px-8 border-t border-slate-900/50 bg-card/20 relative z-10">
 <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
 <div className="flex-1 space-y-6">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-wide uppercase">
 Workflow Upgrade
 </div>
 <h2 className="text-3xl md:text-5xl font-bold">Seamless AutoCAD Integration</h2>
 <p className="text-lg text-muted-foreground leading-relaxed">
 Downloading DXF files is just the beginning. We provide a lightweight AutoLISP companion script that bridges the gap between RDCAD Express and your local AutoCAD environment.
 </p>
 <ul className="space-y-4 text-foreground">
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">✓</div>
 Instantly imports your most recent download
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">✓</div>
 Attaches block to cursor for immediate placement
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">✓</div>
 No file-browser navigation required
 </li>
 </ul>
 <div className="pt-4">
 <Link href="/setup" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-indigo-500 text-primary-foreground rounded-lg font-medium transition shadow-lg shadow-indigo-500/20">
 Learn How to Install
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 <div className="flex-1 w-full bg-background rounded-2xl border border-border p-6 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500"></div>
 <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm font-mono border-b border-border pb-4">
 <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
 <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
 <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
 <span className="ml-2">AutoCAD Command Line</span>
 </div>
 <div className="font-mono text-sm space-y-2">
 <div className="text-muted-foreground">Command: <span className="text-emerald-600 dark:text-emerald-400">RDCAD_IMPORT</span></div>
 <div className="text-muted-foreground">Importing: C:\Users\Engineer\Downloads\Beam_B1_300x450.dxf</div>
 <div className="text-muted-foreground">Specify insertion point or [Basepoint/Scale/X/Y/Z/Rotate]:</div>
 <div className="text-primary flex items-center gap-2 mt-4 animate-pulse">
 <span>_</span>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Copy CAD Command Section */}
 <section className="py-24 px-8 border-t border-slate-900/50 bg-background relative z-10">
 <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
 <div className="flex-1 space-y-6">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-wide uppercase">
 Instant Drafting
 </div>
 <h2 className="text-3xl md:text-5xl font-bold">Copy CAD Command</h2>
 <p className="text-lg text-muted-foreground leading-relaxed">
 Say goodbye to downloading and importing files. Use the <span className="font-semibold text-foreground">Copy CAD Command</span> feature to instantly grab the LISP script of your structural element, and paste it directly into AutoCAD.
 </p>
 <ul className="space-y-4 text-foreground">
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">✓</div>
 Generates drawing instantly at your cursor
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">✓</div>
 Completely eliminates file clutter
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">✓</div>
 Faster than standard DXF exports
 </li>
 </ul>
 <div className="pt-4">
 <Link href="/guide" className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition shadow-sm">
 Read the Workflow Guide
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 <div className="flex-1 w-full flex items-center justify-center bg-card rounded-2xl border border-border p-12 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500"></div>
 <div className="relative group-hover:scale-105 transition-transform duration-500 flex flex-col items-center">
 <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 group-hover:shadow-indigo-600/50 transition-shadow">
 <Copy className="w-10 h-10 text-white" />
 </div>
 <div className="text-xl font-bold text-foreground">Copy CAD Command</div>
 <div className="text-sm text-muted-foreground mt-2">Click to copy script to clipboard</div>
 </div>
 </div>
 </div>
 </section>

 {/* Reliability Section */}
 <section className="py-24 px-8 border-t border-slate-900/50 bg-background relative z-10">
 <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
 <div className="flex-1 space-y-6">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold tracking-wide uppercase">
 Quality Assured
 </div>
 <h2 className="text-3xl md:text-5xl font-bold">Tested & Reliable Core</h2>
 <p className="text-lg text-muted-foreground leading-relaxed">
 We know that structural detailing requires absolute precision. That&apos;s why the core mathematical engine and DXF generator of RDCAD Express are backed by a comprehensive <span className="text-foreground font-medium">Vitest</span> test suite.
 </p>
 <ul className="space-y-4 text-foreground">
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">✓</div>
 Rigorous testing for accurate BBS calculations
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">✓</div>
 Automated validation of generated DXF structural integrity
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">✓</div>
 Deterministic outputs across different environments
 </li>
 </ul>
 </div>
 <div className="flex-1 w-full bg-card rounded-2xl border border-border p-6 shadow-2xl relative overflow-hidden group">
 <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm font-mono border-b border-border pb-4">
 <div className="w-3 h-3 rounded-full bg-muted"></div>
 <div className="w-3 h-3 rounded-full bg-muted"></div>
 <div className="w-3 h-3 rounded-full bg-muted"></div>
 <span className="ml-2">vitest run</span>
 </div>
 <div className="font-mono text-sm space-y-2">
 <div className="text-emerald-600 dark:text-emerald-400">✓ packages/core-math/src/index.test.ts (8 tests)</div>
 <div className="text-emerald-600 dark:text-emerald-400">✓ packages/dxf-exporter/src/index.test.ts (5 tests)</div>
 <div className="text-muted-foreground mt-4">Test Files 2 passed (2)</div>
 <div className="text-muted-foreground">Tests 13 passed (13)</div>
 <div className="text-muted-foreground">Duration 843ms</div>
 </div>
 </div>
 </div>
 </section>

 {/* Features Section */}
 <section className="py-24 px-8 border-t border-slate-900/50 bg-background/50 relative z-10">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-16">
 <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineering Suite</h2>
 <p className="text-muted-foreground">Everything you need to detail structures efficiently.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 <FeatureCard 
 icon={<Code className="w-8 h-8 text-primary" />}
 title="BBS Generator"
 description="Real-time parametric rebar weight calculations and scheduling."
 link="/bbs"
 />
 <FeatureCard 
 icon={<Layers className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
 title="Beam Detailing"
 description="Generate detailed beam reinforcements and exports."
 link="/beam"
 />
 <FeatureCard 
 icon={<Cpu className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
 title="Column Detailing"
 description="Automated column schedules and link calculations."
 link="/column"
 />
 <FeatureCard 
 icon={<Compass className="w-8 h-8 text-amber-600 dark:text-amber-400" />}
 title="Foundation"
 description="Isolated footing calculations and base detailing."
 link="/foundation"
 />
 <FeatureCard 
 icon={<Layers className="w-8 h-8 text-rose-600 dark:text-rose-400" />}
 title="Slab Detailing"
 description="Two-way and one-way slab reinforcement generation."
 link="/slab"
 />
 <FeatureCard 
 icon={<Code className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />}
 title="Tank Detailing"
 description="Water tank structural components and drawings."
 link="/tank"
 />
 <FeatureCard 
 icon={<Layers className="w-8 h-8 text-orange-600 dark:text-orange-400" />}
 title="Stairs Detailing"
 description="Parametric dog-legged stair reinforcements and profiles."
 link="/stairs"
 />
 <FeatureCard 
 icon={<Code className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
 title="Grid Utils"
 description="Drafting utilities for grids, elevations, and revisions."
 link="/utilities"
 />
 <FeatureCard 
 icon={<Compass className="w-8 h-8 text-pink-600 dark:text-pink-400" />}
 title="Asset Library"
 description="Pre-built CAD blocks for architecture and plumbing."
 link="/library"
 />
 <FeatureCard 
 icon={<Cpu className="w-8 h-8 text-teal-600 dark:text-teal-400" />}
 title="Templates"
 description="Standardized title blocks and project templates."
 link="/templates"
 />
 </div>
 </div>
 </section>

 {/* Project Feature Section */}
 <section className="py-24 px-8 border-t border-slate-900/50 bg-card/20 relative z-10">
 <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
 <div className="flex-1 w-full bg-background rounded-2xl border border-border p-6 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-500 via-indigo-500 to-purple-500"></div>
 <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
 <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">P</div>
 <span className="text-foreground font-medium text-sm">Project Active Summary</span>
 </div>
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
 <span className="text-sm text-muted-foreground">Beam Detail B1</span>
 <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">Ready</span>
 </div>
 <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
 <span className="text-sm text-muted-foreground">Column Schedule C1-C4</span>
 <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">Ready</span>
 </div>
 <div className="mt-2 flex gap-3">
 <div className="flex-1 h-10 bg-primary/20 border border-blue-500/30 rounded flex items-center justify-center text-primary text-xs font-bold transition hover:bg-primary/30 cursor-pointer">GENERATE REPORT</div>
 <div className="flex-1 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold transition hover:bg-emerald-600/30 cursor-pointer">EXPORT ALL DXF</div>
 </div>
 </div>
 </div>
 <div className="flex-1 space-y-6">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-blue-500/20 text-primary text-sm font-semibold tracking-wide uppercase">
 Project Management
 </div>
 <h2 className="text-3xl md:text-5xl font-bold">Unified Project Reports</h2>
 <p className="text-lg text-muted-foreground leading-relaxed">
 Consolidate your structural designs into a single, cohesive project. RDCAD Express allows you to queue multiple elements—beams, columns, slabs—and generate a comprehensive engineering report.
 </p>
 <ul className="space-y-4 text-foreground">
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
 Batch export multiple DXF files simultaneously
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
 Generate unified PDF calculation reports
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
 Track your active designs in one centralized view
 </li>
 </ul>
 <div className="pt-4">
 <Link href="/project" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary text-primary-foreground rounded-lg font-medium transition shadow-lg shadow-blue-500/20">
 View Project Dashboard
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* Reporting Issues Section */}
 <section className="py-24 px-8 border-t border-slate-900/50 bg-background relative z-10">
 <div className="max-w-4xl mx-auto text-center space-y-8">
 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border mb-4 shadow-xl">
 <GitBranch className="w-8 h-8 text-foreground" />
 </div>
 <h2 className="text-3xl md:text-5xl font-bold">Found a Bug? Have an Idea?</h2>
 <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
 RDCAD Express is open-source, and we rely on community feedback to improve. If you encounter a bug or have a feature request, you can easily report it on our GitHub repository.
 </p>
 
 <div className="grid md:grid-cols-3 gap-6 text-left mt-12">
 <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group hover:border-border transition-colors">
 <div className="text-4xl font-black text-muted-foreground/50 absolute -right-2 -bottom-4 group-hover:text-muted-foreground transition-colors">1</div>
 <h3 className="text-xl font-bold mb-3 relative z-10 text-foreground">Create an Account</h3>
 <p className="text-muted-foreground text-sm relative z-10">If you don&apos;t have one, sign up for a free account at GitHub.com.</p>
 </div>
 <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group hover:border-border transition-colors">
 <div className="text-4xl font-black text-muted-foreground/50 absolute -right-2 -bottom-4 group-hover:text-muted-foreground transition-colors">2</div>
 <h3 className="text-xl font-bold mb-3 relative z-10 text-foreground">Go to Issues</h3>
 <p className="text-muted-foreground text-sm relative z-10">Navigate to the &quot;Issues&quot; tab on our GitHub repository and click &quot;New Issue&quot;.</p>
 </div>
 <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group hover:border-border transition-colors">
 <div className="text-4xl font-black text-muted-foreground/50 absolute -right-2 -bottom-4 group-hover:text-muted-foreground transition-colors">3</div>
 <h3 className="text-xl font-bold mb-3 relative z-10 text-foreground">Provide Details</h3>
 <p className="text-muted-foreground text-sm relative z-10">Describe the problem clearly. Include screenshots or error messages if possible.</p>
 </div>
 </div>
 
 <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
 <a href="https://github.com/rahuldhole/rdcad-express/issues/new" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-muted hover:bg-background text-foreground rounded-full font-bold transition-all shadow-lg hover:scale-105">
 Report an Issue Now
 </a>
 <a href="https://github.com/rahuldhole/rdcad-express" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-border hover:border-slate-600 dark:hover:border-slate-400 text-foreground rounded-full font-bold transition-all hover:bg-muted">
 Explore Repository
 </a>
 </div>
 
 <div className="pt-6 text-muted-foreground text-sm">
 Need direct support? Email me at <ProtectedEmail />
 </div>
 </div>
 </section>
 </div>
 );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
 return (
 <Link href={link} className="block group p-8 rounded-2xl bg-card/40 border border-border hover:bg-card hover:border-border transition-all">
 <div className="mb-6 p-4 rounded-xl bg-background inline-block group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
 {icon}
 </div>
 <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
 <p className="text-muted-foreground leading-relaxed">{description}</p>
 </Link>
 );
}
