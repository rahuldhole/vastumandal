"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Download, Menu, FileText } from "lucide-react";
import ExportModal from "./ExportModal";
import WorkbenchHeader from "./WorkbenchHeader";

export default function Navbar() {
  const pathname = usePathname();
  const isWorkbench = pathname === '/workbench';
  
  if (isWorkbench) {
    return <WorkbenchHeader />;
  }
  
  // Marketing site Navbar state
  // We can still use these if needed on marketing pages, though right now mostly static.
  const { leftPanelOpen, setLeftPanelOpen, rightPanelOpen, setRightPanelOpen, activeTab, setActiveTab, isCalculating } = useAppStore();
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  return (
    <header className="bg-card border-b border-border h-14 flex items-center shrink-0 z-50">
      <div className="w-full flex items-center justify-between px-2 md:px-4 gap-1 sm:gap-2">
        
        {/* Left: Branding & Panel Toggle */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 w-auto md:w-[340px] shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Vastumandal Logo" width={32} height={32} className="w-8 h-8 rounded-md" />
            <div className="font-bold text-lg text-primary hidden sm:flex items-center gap-2">
              <span className="hidden sm:inline">VastuMandal</span>
            </div>
          </Link>
        </div>

        {/* Right sections */}
        <div className="flex-1 flex justify-end items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/workbench" className="hover:text-primary transition-colors">Workbench</Link>
          <Link href="/guide" className="hover:text-primary transition-colors">Documentation</Link>
          <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
        </div>

      </div>
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </header>
  );
}
