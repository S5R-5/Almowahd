import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Check, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { SITES } from "@/lib/data";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: {
      search?: {
        cse?: {
          element?: {
            render: (config: { div: string; tag: string; gname: string }) => void;
            getElement: (gname: string) => { execute: (query: string) => void } | null;
          };
        };
      };
    };
  }
}

const CSE_GNAME = "almowahid-results";
const CSE_DIV_ID = "gcse-results-container";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cseInitialized = useRef(false);

  const selectedSite = SITES.find((s) => s.id === selectedSiteId) || SITES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize the Google CSE results-only element once
  const initCSE = useCallback(() => {
    if (cseInitialized.current) return true;
    const el = window.google?.search?.cse?.element;
    if (!el) return false;
    try {
      el.render({ div: CSE_DIV_ID, tag: "searchresults-only", gname: CSE_GNAME });
      cseInitialized.current = true;
      return true;
    } catch {
      // Already rendered — mark as initialized
      cseInitialized.current = true;
      return true;
    }
  }, []);

  // Execute search once CSE is ready
  const executeCSESearch = useCallback((searchQuery: string) => {
    const tryExecute = (attempts = 0) => {
      if (attempts > 40) {
        setIsSearching(false);
        return;
      }
      const initialized = initCSE();
      if (!initialized) {
        setTimeout(() => tryExecute(attempts + 1), 250);
        return;
      }
      const cseEl = window.google?.search?.cse?.element?.getElement(CSE_GNAME);
      if (!cseEl) {
        setTimeout(() => tryExecute(attempts + 1), 250);
        return;
      }
      cseEl.execute(searchQuery);
      setIsSearching(false);
    };
    tryExecute();
  }, [initCSE]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setIsDropdownOpen(false);

    // Build the query: if a specific site is selected, prefix with site: filter
    const selectedSiteData = SITES.find((s) => s.id === selectedSiteId);
    let finalQuery = query.trim();
    if (selectedSiteId !== "all" && selectedSiteData?.url) {
      const domain = selectedSiteData.url.replace(/^https?:\/\/(www\.)?/, "");
      finalQuery = `site:${domain} ${query.trim()}`;
    }

    executeCSESearch(finalQuery);
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-6 ring-4 ring-primary/5">
          <BookOpen className="w-10 h-10" />
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
          أداة البحث الموحد في الفتاوى
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          اكتب موضوع بحثك، وسنقوم بالبحث عنه مباشرة في المواقع الرسمية لمشايخنا.
        </p>
      </motion.div>

      {/* Search Form Card */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSearch}
        className="w-full max-w-3xl bg-card rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-primary/5 border border-border/60 relative z-20"
      >
        <div className="flex flex-col gap-6">

          {/* Main Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-5 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب كلمة البحث هنا (مثال: الصلاة، الزكاة...)"
              className="w-full h-16 ps-14 pe-6 bg-background border-2 border-border text-foreground text-lg rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/70 shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Custom Select Dropdown */}
            <div className="relative flex-1" ref={dropdownRef}>
              <label className="block text-sm font-bold text-foreground mb-2 ms-1">
                مكان البحث:
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "w-full h-14 px-5 flex items-center justify-between bg-background border-2 text-start rounded-xl transition-all focus:outline-none",
                  isDropdownOpen ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-foreground font-medium truncate pe-4">
                  {selectedSite.name}
                </span>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full start-0 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto py-2"
                >
                  {SITES.map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => {
                        setSelectedSiteId(site.id);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-5 py-3 flex items-center justify-between text-start hover:bg-muted transition-colors",
                        selectedSiteId === site.id ? "bg-primary/5 text-primary" : "text-foreground"
                      )}
                    >
                      <span className={cn("font-medium", selectedSiteId === site.id && "font-bold")}>
                        {site.name}
                      </span>
                      {selectedSiteId === site.id && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Search Button */}
            <div className="sm:w-40 flex items-end">
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="w-full h-14 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>بحث</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.form>

      {/* Results Section — always in DOM so Google CSE can render into it */}
      <div className={cn("w-full mt-10 transition-all duration-500", hasSearched ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden mt-0")}>

        {/* Divider + Title */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px flex-1 bg-border" />
            <h3 className="text-2xl font-display font-bold text-foreground px-4">
              نتائج البحث
            </h3>
            <div className="h-px flex-1 bg-border" />
          </motion.div>
        )}

        {/* Spinner while waiting for CSE */}
        {isSearching && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Google CSE Results Container */}
        <div
          id={CSE_DIV_ID}
          className="gcse-searchresults-only w-full"
        />
      </div>
    </div>
  );
}
