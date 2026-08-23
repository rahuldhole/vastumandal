import React from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Settings, Copy, Code } from "lucide-react";
import { PwaInstallButton } from "@/components/PwaInstallButton";
export const metadata = {
  title: "Startup Guide - RDCAD Express",
  description: "Learn how to use RDCAD Express to automate structural detailing.",
};

const features = [
  {
    icon: <PlayCircle className="w-8 h-8 text-primary" />,
    title: "Module Selection",
    description: "Start by choosing a structural element from the dashboard. RDCAD Express supports Beams, Columns, Slabs, Foundations, Stairs, and Tanks. Each module provides specialized parametric controls tailored for that specific structural component."
  },
  {
    icon: <Settings className="w-8 h-8 text-amber-500" />,
    title: "Parametric Design",
    description: "Use the properties panel to input your structural design data. You can modify dimensions, reinforcement details, cover, and mark IDs. The real-time 2D preview will instantly update to reflect your changes, ensuring accuracy before export."
  },
  {
    icon: <Copy className="w-8 h-8 text-indigo-500" />,
    title: "Export & Integration Options",
    description: (
      <div className="space-y-4">
        <div>
          <strong className="text-foreground">Option A: Copy CAD Command (Recommended)</strong> - The fastest way to get your drawing into CAD. Click the copy icon in the toolbar, switch to your local AutoCAD window, paste the script directly into the command line, and press Enter. The drawing will generate instantly at your cursor.
        </div>
        <div>
          <strong className="text-foreground">Option B: Export DXF</strong> - Save the file or share it with a colleague. A standard .dxf file will download to your device, which is compatible with almost all drafting software.{" "}
          <Link href="/setup" className="text-primary hover:underline font-medium">
            Set up the LISP extension
          </Link>{" "}
          to auto-detect downloaded DXF files directly in CAD.
        </div>
        <div>
          <strong className="text-foreground">Option C: Add to Project</strong> - Save multiple elements to a project for batch processing. You can generate a unified BBS report and get a zipped export of all your drawings at once from the Projects dashboard.
        </div>
      </div>
    )
  },
  {
    icon: <Code className="w-8 h-8 text-rose-500" />,
    title: "Documentation & BBS",
    description: "For comprehensive documentation, use the 'BBS Generator' or 'Project Management' modules. You can queue multiple elements, calculate exact rebar weights, and export unified PDF reports for your site engineers."
  }
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden pb-24">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-24 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Startup <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">Guide</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the RDCAD Express core features and flexible workflows to drastically reduce your drafting time.
          </p>
        </div>

        <div className="grid gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent group-hover:from-primary transition-colors" />
              
              <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-background border border-border group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <div className="text-muted-foreground leading-relaxed text-lg">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-card border border-border rounded-2xl">
            <h4 className="text-xl font-bold mb-2">LISP Extension (Optional)</h4>
            <p className="text-muted-foreground mb-6">To use advanced CAD integration features, follow our one-time setup guide for AutoCAD.</p>
            <Link href="/setup" className="inline-flex items-center justify-center w-full px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-colors">
              View Setup Guide
            </Link>
          </div>
          <div className="p-8 bg-card border border-border rounded-2xl">
            <h4 className="text-xl font-bold mb-2">Install App (Optional)</h4>
            <p className="text-muted-foreground mb-6">You can install RDCAD Express as a Progressive Web App (PWA) using your browser&apos;s install button.</p>
            <div className="w-full flex justify-center [&>*]:w-full [&>*]:justify-center">
              <PwaInstallButton />
            </div>
          </div>
          <div className="p-8 bg-card border border-border rounded-2xl">
            <h4 className="text-xl font-bold mb-2">Have more questions?</h4>
            <p className="text-muted-foreground mb-6">Check out our frequently asked questions for troubleshooting and tips.</p>
            <Link href="/faq" className="inline-flex items-center justify-center w-full px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-colors">
              Read the FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
