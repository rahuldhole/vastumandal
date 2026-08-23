import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

export const metadata = {
  title: "FAQ - RDCAD Express",
  description: "Frequently asked questions about RDCAD Express",
};

const faqs = [
  {
    question: "How do I use the 'Copy CAD Command' feature?",
    answer: "The 'Copy CAD Command' feature allows you to instantly generate structural detailing within your CAD software. Once you have configured your design in the web app, simply click the copy icon button. Then, switch to AutoCAD (or any compatible CAD software with LISP support), paste the copied text directly into the command line, and press Enter. The script will automatically draw the exact element."
  },
  {
    question: "What is RDCAD Express?",
    answer: "RDCAD Express is an open-source suite of engineering tools designed to automate structural detailing, generate Bar Bending Schedules (BBS), and export precise DXF drawings directly from your browser."
  },
  {
    question: "Can I export drawings as DXF files?",
    answer: "Yes! Every module (Beams, Columns, Slabs, etc.) includes an 'Export DXF' button. Clicking this will instantly download a .dxf file of your design, which you can open in any standard CAD software."
  },
  {
    question: "Is RDCAD Express completely free and open-source?",
    answer: "Absolutely. RDCAD Express is a community-driven, open-source project. You can use it for free, inspect the code, and even contribute to its development on GitHub."
  },
  {
    question: "Does it work without an internet connection?",
    answer: "Yes, RDCAD Express is a Progressive Web App (PWA). Once installed or loaded in your browser, the core mathematical engine and DXF generation work completely offline."
  }
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 pt-24 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Frequently Asked <span className="bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Everything you need to know about using RDCAD Express to its full potential.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group bg-card border border-border rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-lg hover:bg-muted/50 transition-colors">
                {faq.question}
                <ChevronDown className="w-5 h-5 text-muted-foreground group-open:-rotate-180 transition-transform duration-300" />
              </summary>
              <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-border/50 bg-muted/20">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
        
        <div className="mt-16 p-8 bg-card border border-border rounded-2xl text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">Read our step-by-step startup guide to learn the workflow in detail.</p>
          <Link href="/guide" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all">
            Read Startup Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
