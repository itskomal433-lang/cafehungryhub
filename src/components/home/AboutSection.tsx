import {
  Award,
  CheckCircle2,
  Clock,
  Coffee,
  Flame,
  Heart,
  Sparkles,
  Trees,
  Utensils,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import cozyLounge from "@/assets/hungryhub-lounge-cozy.jpg";
import { restaurant } from "@/data/restaurant";

const highlights = [
  { label: "Botanical Mezzanine", icon: Trees },
  { label: "Artisan Espresso Bar", icon: Coffee },
  { label: "Stone-Baked Fresh Dough", icon: Sparkles },
  { label: "24/7 Kitchen & Lounge", icon: Clock },
];

export function AboutSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Left: Image with 3D Depth Card & Floating Badge */}
        <Reveal direction="left">
          <div className="relative group">
            <div className="hh-shadow-lift overflow-hidden rounded-3xl border-2 border-gold/30 bg-card shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={cozyLounge}
                  alt="Warm, glowing botanical cafe & mezzanine lounge at Hungry Hub Rajpura"
                  loading="lazy"
                  width={1400}
                  height={1000}
                  className="h-full w-full object-cover animate-ken-burns transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3.5 py-1 text-xs font-bold text-gold backdrop-blur-md border border-gold/40">
                  <Clock className="h-3.5 w-3.5 text-gold animate-spin-slow" /> Open 24/7 ·
                  Botanical Café · Neelpur, Rajpura
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="animate-float absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl border border-gold/40 bg-primary-deep/95 backdrop-blur-md p-4 text-primary-foreground shadow-2xl">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/20 text-gold border border-gold/40">
                <Award className="h-6 w-6 text-gold animate-bounce-subtle" />
              </span>
              <div>
                <p className="font-display font-extrabold text-base text-gold">
                  Rajpura's Aesthetic Cafe
                </p>
                <p className="text-xs text-primary-foreground/80">
                  Double-Height Lounge & 24/7 Kitchen
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: Typography & Highlights */}
        <Reveal delay={120} direction="right">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold tracking-[0.24em] text-primary uppercase shadow-xs mb-4">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> The Hungry Hub Atmosphere
            </span>

            <h2 className="font-display text-3xl leading-tight font-extrabold text-foreground sm:text-4xl md:text-[2.75rem]">
              Where good food meets good mood.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Designed as an urban botanical sanctuary in Rajpura, Hungry Hub combines double-height
              sunlit architecture, fluted warm timber, plush emerald velvet booths, and glowing
              amber lights. Whether you're here for morning specialty espresso, stone-baked pizzas,
              evening momos with friends, or a midnight bite, our doors are open 24 hours every day.
            </p>
            <p className="font-script mt-6 text-3xl text-primary font-bold">{restaurant.tagline}</p>

            <ul className="mt-8 grid grid-cols-2 gap-3">
              {highlights.map((highlight) => (
                <li
                  key={highlight.label}
                  className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card p-3.5 text-xs font-extrabold tracking-wide text-foreground uppercase shadow-xs transition-all duration-200 hover:border-primary/40 hover:bg-secondary hover:-translate-y-0.5 btn-press"
                >
                  <highlight.icon className="h-4 w-4 text-primary shrink-0" />
                  <span>{highlight.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
