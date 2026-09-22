import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Coffee, Phone, Sparkles, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroLounge from "@/assets/hungryhub-lounge-cozy.jpg";
import cafeTableSetting from "@/assets/cafe-table-setting.jpg";
import { restaurant } from "@/data/restaurant";

export function Hero() {
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden flex items-center">
      {/* Botanical Cafe Atmosphere Background */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-black">
        <img
          src={heroLounge}
          alt="Botanical cafe and mezzanine lounge at Hungry Hub Rajpura"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="h-full w-full object-cover scale-105 animate-ken-burns opacity-85 transition-transform duration-1000"
        />
      </div>

      {/* Atmospheric Clean Vignette Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/75 to-transparent sm:w-4/5" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-transparent to-black/50" />

      {/* Subtle Warm Glows */}
      <div className="absolute top-1/3 left-1/4 -z-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

      <div className="mx-auto flex min-h-[92svh] max-w-7xl items-center justify-between px-4 pt-28 pb-20 sm:px-6 lg:px-8 w-full gap-12">
        {/* Left Column: Clean & Aesthetic Hero Typography */}
        <div className="animate-rise max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/40 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase backdrop-blur-md shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Open 24 Hours · Botanical Café & Lounge
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
            Crave it.
            <br />
            Love it.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 font-serif italic">
              Hungry Hub.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 font-normal leading-relaxed">
            A sunlit botanical sanctuary on MLA Road, Neelpur. Enjoy stone-baked artisan pizzas,
            specialty coffees, crispy kurkure momos, and casual lounge dining — served 24 hours a
            day.
          </p>

          {/* Clean 3D Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              variant="gold"
              className="rounded-full font-bold uppercase tracking-wider text-xs px-8 py-6 cursor-pointer btn-3d-gold"
            >
              <Link to="/menu">
                <Sparkles className="h-4 w-4 mr-1.5 text-stone-950" />
                Order Online
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="glass"
              className="rounded-full font-bold uppercase tracking-wider text-xs px-8 py-6 cursor-pointer btn-3d-glass"
            >
              <Link to="/about">
                <Coffee className="h-4 w-4 mr-1.5 text-amber-300" />
                Explore Ambiance
              </Link>
            </Button>
          </div>

          {/* Clean Info Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-4 pt-2 text-xs text-white/75 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-amber-400" /> Dine-in • Takeaway • 24/7 Delivery
            </span>
            <span className="text-white/40">•</span>
            <a
              href={restaurant.phoneHref}
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5" /> {restaurant.phone}
            </a>
          </div>
        </div>

        {/* Right Column: Clean & Aesthetic Showcase Card */}
        <div className="hidden lg:flex flex-col gap-4 shrink-0 max-w-md relative z-10">
          <div className="relative rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl p-3 shadow-2xl text-white group hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
              <img
                src={cafeTableSetting}
                alt="Artisanal stone-baked burrata pizza and latte art on marble table"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[0.65rem] font-bold text-amber-300 uppercase">
                Artisan Dining
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                <p className="font-display text-base font-bold text-white">
                  Stone-Baked Burrata Pizza & Brews
                </p>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  Carrara Marble Table · Freshly Crafted
                </p>
              </div>
            </div>
          </div>

          {/* Simple Rating Strip */}
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-black/40 backdrop-blur-xl px-5 py-3 text-white">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">4.6 Google Rating</span>
            </div>
            <span className="text-xs text-white/70">500+ Verified Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
