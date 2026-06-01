import { Wind, RefreshCw, Sun, Moon, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { NotificationsBell } from "@/components/NotificationsBell";

interface NavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
}

export function Navbar({ onRefresh, isRefreshing, lastUpdated }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
              <Wind className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">PhillyAir</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">AIR QUALITY MONITOR</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Data Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-foreground/5 px-3 py-1.5 rounded-full">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>Live Data</span>
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 transition-transform ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          )}

          {/* Notifications Bell */}
          <NotificationsBell />

          {/* Theme Toggle - Sun/Moon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all duration-300"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
