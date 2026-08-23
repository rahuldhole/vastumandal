/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
 interface WorkerGlobalScope extends SerwistGlobalConfig {
 __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
 }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
 precacheEntries: self.__SW_MANIFEST,
 skipWaiting: true,
 clientsClaim: true,
 navigationPreload: false, // Disabled to prevent ERR_FAILED on hard reloads while offline
 runtimeCaching: defaultCache,
});

// serwist.addEventListeners() moved to the bottom

const HTML_ROUTES = [
 "/",
 "/bbs",
 "/beam",
 "/column",
 "/setup",
 "/foundation",
 "/library",
 "/project",
 "/slab",
 "/stairs",
 "/tank",
 "/templates",
 "/utilities"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline-html-cache").then((cache) => {
      // Fetch the routes exactly as defined (e.g. "/beam")
      // This works on both Next.js dev server and static hosting (which maps /beam to beam.html)
      return cache.addAll(HTML_ROUTES).catch(err => console.error("Cache addAll failed", err));
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    const url = new URL(event.request.url);
    const path = url.pathname;
    
    // We only provide a fallback if the network fails
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open("offline-html-cache");
        
        // 1. Try to find the exact route HTML in our offline cache
        const cachedResponse = await cache.match(path);
        if (cachedResponse) return cachedResponse;
        
        // 2. Try falling back to the home page if specific route isn't cached
        const fallbackResponse = await cache.match("/");
        if (fallbackResponse) return fallbackResponse;
        
        // 3. Complete failure
        return new Response("Network error happened and offline cache is empty.", {
          status: 408,
          headers: { "Content-Type": "text/plain" },
        });
      })
    );
  }
});

serwist.addEventListeners();
