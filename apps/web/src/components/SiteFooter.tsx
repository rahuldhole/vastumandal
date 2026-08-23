"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SiteFooter() {
  const pathname = usePathname();
  const isWorkbench = pathname === "/workbench";

  if (isWorkbench) return null;

  return (
    <footer className="bg-background border-t border-slate-400 dark:border-slate-200 py-6 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
          <div>
            Built with ❤️ by <a href="https://rahuldhole.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-blue-500 dark:hover:text-blue-300 transition">rahuldhole.com</a>
          </div>
          <div className="hidden sm:block w-px h-4 bg-muted"></div>
          <div>
            © {new Date().getFullYear()} Vastumandal. All rights reserved.
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/guide" className="hover:text-foreground transition-colors hidden sm:inline font-medium">Guide</Link>
          <Link href="/faq" className="hover:text-foreground transition-colors hidden sm:inline font-medium">FAQ</Link>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
