import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, ExternalLink, Globe, BookOpen, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITES, type Site } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchedSites, setSearchedSites] = useState<Site[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedSite = SITES.find((s) => s.id === selectedSiteId) || SITES[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    setIsDropdownOpen(false);

    // Simulate a brief processing time for better UX
    setTimeout(() => {
      let targets: Site[] = [];

      if (selectedSiteId === "all") {
        targets = SITES.filter((s) => s.id !== "all");
      } else {
        const target = SITES.find((s) => s.id === selectedSiteId);
        if (target) targets = [target];
      }

      // Open tabs
      targets.forEach((site) => {
        const searchUrl = `${site.url}/?s=${encodeURIComponent(query)}`;
        window.open(searchUrl, "_blank", "noopener,noreferrer");
      });

      setSearchedSites(targets);
      setIsSearching(false);
      setHasSearched(true);
    }, 600);
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
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">أداة البحث الموحد في الفتاوى </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">اكتب موضوع بحثك، وسنقوم بالبحث عنه مباشرة في المواقع الرسمية لمشايخنا .</p>
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

              <AnimatePresence>
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
              </AnimatePresence>
            </div>

            {/* Search Button */}
            <div className="sm:w-40 flex items-end">
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="w-full h-14 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>بحث</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {selectedSiteId === "all" && (
            <div className="flex items-start gap-3 p-4 bg-secondary/10 text-secondary-foreground rounded-xl border border-secondary/20 mt-2">
              <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">
                ملاحظة: اختيار "كل المواقع" سيقوم بفتح عدة نوافذ (تبويبات) في متصفحك مرة واحدة. يرجى التأكد من السماح بالنوافذ المنبثقة (Pop-ups) لهذا الموقع.
              </p>
            </div>
          )}
        </div>
      </motion.form>
      {/* Search Results Area */}
      <AnimatePresence mode="wait">
        {hasSearched && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full mt-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-border" />
              <h3 className="text-2xl font-display font-bold text-foreground px-4">
                نتائج البحث
              </h3>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedSites.map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-primary/40 transition-all group flex flex-col h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 end-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Globe className="w-24 h-24 text-primary" />
                  </div>
                  
                  <div className="relative z-10 flex-1">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2 leading-snug">
                      {site.label}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      تم فتح علامة تبويب جديدة لهذا الموقع للبحث عن: 
                      <span className="font-bold text-foreground ms-1 bg-muted px-2 py-0.5 rounded">
                        {query}
                      </span>
                    </p>
                  </div>
                  
                  <a
                    href={`${site.url}/?s=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors mt-auto w-fit"
                  >
                    الانتقال للموقع مباشرة
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center p-6 bg-muted/50 rounded-2xl border border-border border-dashed max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">قم بمشاركة الموقع فالدال على الخير كفاعله .</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
