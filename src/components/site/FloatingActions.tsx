import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone, Sparkles } from "lucide-react";
import { restaurant } from "@/data/restaurant";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-3">
      {/* WhatsApp Quick Order 3D Floating Button */}
      <a
        href={`https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(
          "Hi Hungry Hub! I'd like to place an order or inquire about your menu.",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-[0_5px_0_#064e3b,0_12px_24px_rgba(5,150,105,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] border-t border-emerald-300/40 transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_7px_0_#064e3b,0_16px_28px_rgba(5,150,105,0.55)] active:translate-y-1.5 active:shadow-[0_1px_0_#064e3b,0_2px_4px_rgba(0,0,0,0.2)]"
      >
        {/* Radar ping effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-radar-ping pointer-events-none" />
        <MessageCircle className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
        {/* Tooltip on desktop hover */}
        <span className="pointer-events-none absolute right-15 whitespace-nowrap rounded-full bg-stone-900 px-3.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 hidden sm:inline-block border border-amber-400/30">
          WhatsApp 24/7 Order
        </span>
      </a>

      {/* Back to Top 3D with Scroll Progress SVG Ring */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={cn(
          "relative grid h-12 w-12 place-items-center rounded-full bg-card text-foreground border border-border/80 shadow-[0_4px_0_var(--border),0_8px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-150 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-[0_5px_0_var(--border),0_12px_20px_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0_1px_0_var(--border)] cursor-pointer",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none",
        )}
      >
        <svg className="absolute inset-0 h-12 w-12 -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-muted"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-primary transition-all duration-150"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <ArrowUp className="h-5 w-5 text-primary animate-bounce-subtle" />
      </button>
    </div>
  );
}
