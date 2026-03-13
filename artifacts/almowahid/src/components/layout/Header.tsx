import { Moon, Sun, Menu, Search } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Right side (start in RTL) - Hamburger Menu */}
        <button
          onClick={onOpenSidebar}
          className="p-2 -ms-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="القائمة الجانبية"
        >
          <Menu className="w-7 h-7" />
        </button>

        {/* Center - Logo/Title */}
        <div className="flex flex-col items-center justify-center text-center flex-1">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-secondary hidden sm:block" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide">
              الموحد
            </h1>
          </div>
          <p className="text-primary-foreground/75 text-xs sm:text-sm font-medium mt-0.5 hidden sm:block">
            أداة للبحث في بعض مواقع مشايخ أهل السنة والجماعة
          </p>
        </div>

        {/* Left side (end in RTL) - Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 -me-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="تبديل المظهر"
        >
          {theme === "light" ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </button>

      </div>
    </header>
  );
}
