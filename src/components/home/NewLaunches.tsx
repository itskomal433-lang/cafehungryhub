import { Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { newLaunches } from "@/data/menu";
import { formatPrice } from "@/data/restaurant";

export function NewLaunches() {
  return (
    <section className="bg-secondary/60 px-4 py-20 sm:px-6 lg:px-8 border-y border-border/60">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Chef's New Specials"
          title="New on the menu"
          subtitle="Exciting fresh recipes, pizzas and kurkure snacks crafted recently in our Rajpura kitchen."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {newLaunches.map((item, index) => (
            <Reveal key={item.id} delay={index * 80} direction="up">
              <Link
                to="/menu"
                className="hh-shadow group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-gold/60 block"
              >
                <div className="h-28 sm:h-32 w-full overflow-hidden bg-muted relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={400}
                    height={260}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[0.58rem] font-extrabold tracking-[0.12em] text-gold-foreground uppercase shadow-md border border-amber-300/40">
                    ✨ Chef's Special
                  </span>
                </div>
                <div className="p-4 flex flex-1 flex-col justify-between">
                  <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-display text-base font-extrabold text-primary">
                      {formatPrice(item.options[0]?.price ?? 0)}
                    </p>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15 text-gold-foreground group-hover:bg-gold transition-colors shadow-xs">
                      <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
