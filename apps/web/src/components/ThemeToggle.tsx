"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

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

 const cycleTheme = () => {
 if (theme === "system") setTheme("light");
 else if (theme === "light") setTheme("dark");
 else setTheme("system");
 };

 return (
 <button
 onClick={cycleTheme}
 className="p-2 rounded-md hover:bg-muted dark:hover:bg-muted transition text-muted-foreground hover:text-foreground dark:hover:text-foreground flex items-center justify-center w-8 h-8"
 title={`Toggle theme (Current: ${theme})`}
 >
 {theme === "light" && <Sun className="w-5 h-5" />}
 {theme === "dark" && <Moon className="w-5 h-5" />}
 {theme === "system" && <Monitor className="w-5 h-5" />}
 </button>
 );
}
