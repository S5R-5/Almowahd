import { X, Share2, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Ensure body scroll is locked when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const qrColor = theme === "dark" ? "10b981" : "047857";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 start-0 z-50 w-full max-w-[320px] bg-card border-e border-border shadow-2xl flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-xl font-display font-bold flex items-center gap-2 text-foreground">
                <Share2 className="w-5 h-5 text-primary" />
                شارك الموقع
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">
              
              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-4 bg-muted/30 p-6 rounded-3xl border border-border/50 shadow-inner">
                <div className="p-4 bg-white rounded-2xl shadow-md">
                  {/* Using QR Server API with dynamic color based on theme */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=${qrColor}&bgcolor=ffffff`}
                    alt="QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground font-medium">
                  امسح رمز الاستجابة السريعة لمشاركة الأداة مع من تحب
                </p>
              </div>

              {/* Copy Link Section */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground">أو انسخ الرابط مباشرة:</p>
                <div className="flex items-center p-1 bg-muted rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-muted-foreground font-mono"
                    dir="ltr"
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        نسخ
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                الدال على الخير كفاعله. ساهم في نشر هذه الأداة لتيسير الوصول لفتاوى وعلم مشايخنا.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
