"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
 const { theme, setTheme } = useTheme();
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setMounted(true);
 }, []);

 if (!mounted) {
 return <div className="w-8 h-8" />;
 }

 return (
 <button
 onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
 className="p-2 rounded-md hover:bg-muted dark:hover:bg-muted transition text-muted-foreground hover:text-foreground dark:hover:text-foreground"
 title="Toggle theme"
 >
 {theme === "dark" ? (
 <Sun className="w-5 h-5" />
 ) : (
 <Moon className="w-5 h-5" />
 )}
 </button>
 );
}
