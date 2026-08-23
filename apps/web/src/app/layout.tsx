import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

const title = "RDCAD Express - Structural Detailing";
const description = "Advanced parametric detailing and Bar Bending Schedule tools for structural engineers.";
const icon = "🛠️";
const ogImageUrl = `https://og-image.org/api/og?template=gradient&title=${encodeURIComponent(title)}&icon=${encodeURIComponent(icon)}&description=${encodeURIComponent(description)}&bg=1e3a5f&text=ffffff`;

export const metadata: Metadata = {
 title,
 description,
 manifest: "/manifest.json",
 openGraph: {
 type: "website",
 title,
 description,
 images: [
 {
 url: ogImageUrl,
 width: 1200,
 height: 630,
 },
 ],
 },
 twitter: {
 card: "summary_large_image",
 title,
 description,
 images: [ogImageUrl],
 },
};

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProjectModal from "@/components/ProjectModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
 <html
 lang="en"
 suppressHydrationWarning
 className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
 >
 <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
 <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
 <Navbar />
 <ProjectModal />
 <main className="flex-1 pb-10">
 {children}
 </main>
 <footer className="bg-background border-t border-slate-400 dark:border-slate-200 py-6 mt-auto transition-colors">
 <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
 <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
 <div>
 Built with ❤️ by <a href="https://rahuldhole.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-blue-500 dark:hover:text-blue-300 transition">rahuldhole.com</a>
 </div>
 <div className="hidden sm:block w-px h-4 bg-muted"></div>
 <div>
 © {new Date().getFullYear()} RDCAD Express. Open Source under MIT License.
 </div>
 </div>
 <div className="flex items-center gap-4">
 <Link href="/guide" className="hover:text-foreground transition-colors hidden sm:inline font-medium">Guide</Link>
 <Link href="/faq" className="hover:text-foreground transition-colors hidden sm:inline font-medium">FAQ</Link>
 <ThemeToggle />
 <a 
 href="https://github.com/rahuldhole/rdcad-express/issues" 
 target="_blank" 
 rel="noopener noreferrer" 
 className="flex items-center gap-2 hover:text-muted-foreground dark:hover:text-foreground transition text-muted-foreground dark:hover:text-foreground"
 title="Report Issue"
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.3 6.5-1.5 6.5-7.1a5.1 5.1 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.5s-1.1-.3-3.5 1.3a11.5 11.5 0 0 0-6 0C7.1 1.7 6 2 6 2a4.8 4.8 0 0 0-.1 3.5 5.1 5.1 0 0 0-1.4 3.6c0 5.6 3.3 6.8 6.5 7.1a4.8 4.8 0 0 0-1 2.93V22"></path>
 <path d="M9 18c-4.5 1.5-5-2.5-7-3"></path>
 </svg>
 <span className="hidden sm:inline">Report Issue</span>
 </a>
 </div>
 </div>
 </footer>
 </ThemeProvider>
 </body>
 </html>
 );
}
