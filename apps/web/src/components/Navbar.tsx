"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useStore";

export default function Navbar() {
 const [isOpen, setIsOpen] = useState(false);
 const pathname = usePathname();
 const projectItems = useAppStore(state => state.projectItems);

 const toggleMenu = () => setIsOpen(!isOpen);
 const closeMenu = () => setIsOpen(false);

 const navLinks = [
 { href: "/bbs", label: "BBS Generator", isSpecial: false },
 { href: "/beam", label: "Beam", isSpecial: false },
 { href: "/column", label: "Column", isSpecial: false },
 { href: "/slab", label: "Slab", isSpecial: false },
 { href: "/foundation", label: "Foundation", isSpecial: false },
 { href: "/tank", label: "Tank", isSpecial: false },
 { href: "/stairs", label: "Stairs", isSpecial: false },
 { href: "/utilities", label: "Grid Utils", isSpecial: false },
 { href: "/library", label: "Library", isSpecial: false, isBeta: true },
 { href: "/templates", label: "Templates", isSpecial: false, isBeta: true },
 ];

 return (
 <header className="bg-card border-b border-border px-4 md:px-8 py-4 sticky top-0 z-50">
 <div className="max-w-7xl mx-auto flex items-center justify-between">
 <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
 <Image src="/logo.svg" alt="RDCAD Express Logo" width={32} height={32} className="w-8 h-8" />
 <div className="font-bold text-xl text-primary flex items-center gap-2">
 RDCAD Express
 <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-blue-500/30 uppercase tracking-wider">Beta</span>
 </div>
 </Link>

 {/* Desktop Navigation */}
 <nav className="hidden xl:flex items-center gap-4 xl:gap-6">
 {navLinks.map((link) => (
 <Link 
 key={link.href} 
 href={link.href} 
 className={`flex items-center gap-1.5 text-sm font-medium transition whitespace-nowrap ${
 pathname === link.href ? "text-foreground" : 
 link.isSpecial ? "text-primary hover:text-blue-500 dark:hover:text-blue-300" : 
 link.isBeta ? "text-emerald-700 dark:text-emerald-500/70 hover:text-emerald-600 dark:hover:text-emerald-400" : 
 "text-muted-foreground hover:text-foreground"
 }`}
 >
 {link.label}
 </Link>
 ))}
 <div className="h-6 w-px bg-muted mx-1"></div>
 <div className="flex items-center gap-3">
 <Link 
 href="/project" 
 className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-muted hover:bg-muted text-foreground rounded transition border border-border"
 >
 Project
 {projectItems.length > 0 && (
 <span className="flex items-center justify-center w-5 h-5 text-[10px] bg-primary text-primary-foreground rounded-full">
 {projectItems.length}
 </span>
 )}
 </Link>
 </div>

 </nav>

 {/* Mobile Menu Button */}
 <button 
 onClick={toggleMenu} 
 className="xl:hidden p-2 text-muted-foreground hover:text-foreground transition rounded-md hover:bg-muted"
 >
 {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
 </button>
 </div>

 {/* Mobile Navigation */}
 {isOpen && (
 <div className="xl:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-xl overflow-y-auto max-h-[calc(100vh-73px)]">
 <div className="flex flex-col p-4 gap-2">
 {navLinks.map((link) => (
 <Link 
 key={link.href} 
 href={link.href} 
 onClick={closeMenu}
 className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
 pathname === link.href ? "bg-muted text-foreground" : 
 link.isSpecial ? "text-primary hover:bg-muted/50" : 
 link.isBeta ? "text-emerald-700 dark:text-emerald-500 hover:bg-muted/50" : 
 "text-muted-foreground hover:bg-muted hover:text-foreground"
 }`}
 >
 <span className="text-base font-medium">{link.label}</span>
 </Link>
 ))}
 <div className="h-px bg-muted my-2"></div>
 <div className="flex flex-col gap-2">
 <Link 
 href="/project" 
 onClick={closeMenu}
 className="flex items-center justify-between px-4 py-3 bg-muted hover:bg-muted text-foreground border border-border rounded-lg transition"
 >
 <span className="text-base font-medium">Project</span>
 {projectItems.length > 0 && (
 <span className="flex items-center justify-center w-6 h-6 text-xs bg-primary text-primary-foreground rounded-full">
 {projectItems.length}
 </span>
 )}
 </Link>
 </div>

 </div>
 </div>
 )}
 </header>
 );
}
