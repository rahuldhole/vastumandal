"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RefreshCw, ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface DXFPreviewProps {
 dxfString: string;
 staticMode?: boolean;
}

export default function DXFPreview({ dxfString, staticMode = false }: DXFPreviewProps) {
 const containerWrapperRef = useRef<HTMLDivElement>(null);
 const containerRef = useRef<HTMLDivElement>(null);
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const viewerRef = useRef<any>(null);
 const [error, setError] = useState<string | null>(null);
 const [isVisible, setIsVisible] = useState(!staticMode);

 useEffect(() => {
 if (!staticMode) return; // Only use intersection observer for static thumbnails
 if (!containerWrapperRef.current) return;
 
 const observer = new IntersectionObserver(
 (entries) => {
 setIsVisible(entries[0].isIntersecting);
 },
 { rootMargin: "200px" } // Pre-load slightly before coming into view
 );
 
 observer.observe(containerWrapperRef.current);
 return () => observer.disconnect();
 }, [staticMode]);

 useEffect(() => {
 if (!containerRef.current || typeof window === "undefined" || !isVisible) return;

 let isMounted = true;

 // Use dynamic import for dxf-viewer to avoid SSR issues
 const initViewer = async () => {
 try {
 if (!viewerRef.current) {
 const { DxfViewer } = await import("dxf-viewer");
 // Initialize viewer with clear color matching slate-900
 viewerRef.current = new DxfViewer(containerRef.current as HTMLElement, {
 clearColor: new THREE.Color("#0f172a"),
 autoResize: true,
 // @ts-expect-error fontUrls is not in the type definition but works at runtime
 fontUrls: ['https://raw.githubusercontent.com/bjnortier/dxf/master/fonts/Roboto-Light.ttf'],
 });
 }

 if (dxfString && isMounted) {
 setError(null);
 const blob = new Blob([dxfString], { type: "text/plain" });
 const url = URL.createObjectURL(blob);
 try {
 // Wait for load to finish
 await viewerRef.current.Load({ url });

 // Automatically fit and render after loading
 const bounds = viewerRef.current.GetBounds();
 if (bounds) {
 viewerRef.current.FitView(bounds.minX, bounds.maxX, bounds.minY, bounds.maxY, 1.2);
 viewerRef.current.Render();
 }
 } finally {
 URL.revokeObjectURL(url);
 }
 }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 } catch (err: any) {
 console.error("Error rendering DXF:", err);
 if (isMounted) setError(err.message || "Failed to render DXF");
 }
 };

 const resizeObserver = new ResizeObserver((entries) => {
 for (const entry of entries) {
 if (viewerRef.current && viewerRef.current.SetSize) {
 viewerRef.current.SetSize(entry.contentRect.width, entry.contentRect.height);
 viewerRef.current.Render();
 }
 }
 });

 resizeObserver.observe(containerRef.current);
 initViewer();

 return () => {
 isMounted = false;
 resizeObserver.disconnect();
 if (viewerRef.current) {
 if (viewerRef.current.Destroy) {
 viewerRef.current.Destroy();
 }
 viewerRef.current = null;
 }
 };
 }, [dxfString, isVisible]);

 const handleZoom = (factor: number) => {
 if (!viewerRef.current) return;
 const camera = viewerRef.current.GetCamera();
 if (camera) {
 camera.zoom *= factor;
 camera.updateProjectionMatrix();
 viewerRef.current.Render();
 }
 };

 const handleFit = () => {
 if (!viewerRef.current) return;
 const bounds = viewerRef.current.GetBounds();
 if (bounds) {
 // Use 1.2 padding which is equivalent to 20% margin
 viewerRef.current.FitView(bounds.minX, bounds.maxX, bounds.minY, bounds.maxY, 1.2);
 viewerRef.current.Render();
 }
 };

 const handleFullscreen = () => {
 if (containerWrapperRef.current) {
 if (document.fullscreenElement) {
 document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
 } else {
 containerWrapperRef.current.requestFullscreen().catch(err => console.error("Error entering fullscreen:", err));
 }
 }
 };

 return (
 <div ref={containerWrapperRef} className="w-full h-full flex flex-col relative overflow-hidden bg-background" style={staticMode ? {} : { minHeight: "500px" }}>
 {!staticMode && (
 <div className="flex items-center gap-2 p-2 border-b border-border bg-background/80 z-10 relative shadow-sm">
 <button onClick={handleFit} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Reset View">
 <RefreshCw className="w-4 h-4" />
 </button>
 <button onClick={() => handleZoom(1.2)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Zoom In">
 <ZoomIn className="w-4 h-4" />
 </button>
 <button onClick={() => handleZoom(0.8)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Zoom Out">
 <ZoomOut className="w-4 h-4" />
 </button>
 <button onClick={handleFullscreen} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors ml-auto" title="Full Screen">
 <Maximize className="w-4 h-4" />
 </button>
 </div>
 )}
 <div className="flex-1 relative w-full h-full">
 {staticMode && <div className="absolute inset-0 z-20 cursor-pointer" />}
 {isVisible && <div ref={containerRef} className="w-full h-full absolute inset-0" />}
 </div>
 {error && (
 <div className="absolute inset-0 flex items-center justify-center bg-card/80 text-red-700 dark:text-red-500 z-30 font-medium p-4 text-center">
 Render Error: {error}
 </div>
 )}
 </div>
 );
}
