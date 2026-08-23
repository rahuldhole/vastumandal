"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
 readonly platforms: Array<string>;
 readonly userChoice: Promise<{
 outcome: "accepted" | "dismissed";
 platform: string;
 }>;
 prompt(): Promise<void>;
}

export function PwaInstallButton() {
 const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
 const [isInstalled, setIsInstalled] = useState(false);

 useEffect(() => {
 const handler = (e: Event) => {
 e.preventDefault();
 setDeferredPrompt(e as BeforeInstallPromptEvent);
 };

 window.addEventListener("beforeinstallprompt", handler);

 let mounted = true;
 if (window.matchMedia('(display-mode: standalone)').matches) {
 setTimeout(() => {
 if (mounted) setIsInstalled(true);
 }, 0);
 }

 return () => {
 mounted = false;
 window.removeEventListener("beforeinstallprompt", handler);
 };
 }, []);

 const handleInstallClick = async () => {
 if (!deferredPrompt) return;
 deferredPrompt.prompt();
 const { outcome } = await deferredPrompt.userChoice;
 if (outcome === 'accepted') {
 setDeferredPrompt(null);
 }
 };

 if (isInstalled) {
 return (
 <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-semibold border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
 Installed Desktop App
 </div>
 );
 }

 if (!deferredPrompt) {
 return (
 <div className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-full font-semibold border border-border shadow-md">
 <span className="w-2.5 h-2.5 rounded-full bg-background0" />
 Offline Ready PWA
 </div>
 );
 }

 return (
 <button
 onClick={handleInstallClick}
 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold border border-blue-400/30 hover:border-blue-400/50 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:scale-105 cursor-pointer"
 >
 <Download className="w-6 h-6 animate-bounce" />
 Install Desktop App
 </button>
 );
}
