import {
  Award,
  Clock,
  Flame,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { restaurant } from "@/data/restaurant";

const cards = [
  {
    icon: Star,
    iconColor: "text-amber-400 fill-amber-400",
    bgColor: "bg-amber-500/15 border border-amber-500/30",
    title: `${restaurant.rating}/5 Verified Rating`,
    detail: "500+ Reviews across Rajpura",
  },
  {
    icon: Flame,
    iconColor: "text-accent",
    bgColor: "bg-accent/15 border border-accent/30",
    title: "100% Hand-Tossed",
    detail: "Stone-baked artisan dough",
  },
  {
    icon: Clock,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/15 border border-emerald-500/30",
    title: "Open 24 Hours",
    detail: "Botanical lounge & kitchen",
  },
  {
    icon: Sparkles,
    iconColor: "text-amber-300",
    bgColor: "bg-gold/15 border border-gold/40",
    title: "Artisan Hospitality",
    detail: "Dine-in, takeaway & 24/7 delivery",
  },
];

export function TrustBar() {
  return (
    <section className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 90} direction="up">
            <div className="hh-shadow group flex h-full items-center gap-4 rounded-3xl border border-border/90 bg-card/95 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-gold/50 cursor-default">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${card.bgColor} ${card.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs`}
              >
                <card.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {card.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.detail}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
