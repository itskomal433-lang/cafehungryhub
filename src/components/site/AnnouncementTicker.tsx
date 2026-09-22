import { Link } from "@tanstack/react-router";
import { Clock, Flame, Phone, Sparkles, Star, Truck, Utensils } from "lucide-react";
import { restaurant } from "@/data/restaurant";

const TICKER_ITEMS = [
  { icon: Flame, text: "🔥 BUY 1 GET 1 FREE EVERY WEDNESDAY ON PIZZAS", link: "/offers" },
  { icon: Sparkles, text: "🍕 100% FRESH HAND-TOSSED DOUGH — NEVER FROZEN", link: "/menu" },
  { icon: Truck, text: "🛵 24/7 FAST DOORSTEP DELIVERY ACROSS RAJPURA", link: "/menu" },
  { icon: Star, text: "⭐ 4.6 GOOGLE RATING · 500+ HAPPY FOODIES", link: "/reviews" },
  { icon: Clock, text: "🕒 OPEN 24 HOURS · DINE-IN, TAKEAWAY & DELIVERY", link: "/contact" },
  { icon: Phone, text: `📞 QUICK HOTLINE: ${restaurant.phone}`, link: restaurant.phoneHref },
];

export function AnnouncementTicker() {
  return (
    <div className="relative z-40 overflow-hidden bg-primary-deep py-2 text-primary-foreground border-b border-primary-foreground/10 text-xs font-bold tracking-wider">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Repeating twice for smooth infinite loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
          <div key={index} className="inline-flex items-center gap-2 mx-6">
            <item.icon className="h-3.5 w-3.5 text-gold shrink-0 animate-pulse" />
            {item.link.startsWith("http") || item.link.startsWith("tel") ? (
              <a
                href={item.link}
                className="text-primary-foreground/90 hover:text-gold transition-colors inline-flex items-center gap-1.5"
              >
                {item.text}
              </a>
            ) : (
              <Link
                to={item.link}
                className="text-primary-foreground/90 hover:text-gold transition-colors inline-flex items-center gap-1.5"
              >
                {item.text}
              </Link>
            )}
            <span className="text-gold/40 mx-2">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
