import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Coffee,
  Flame,
  Heart,
  Sparkles,
  Star,
  Trees,
  Utensils,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import cafeTableSetting from "@/assets/cafe-table-setting.jpg";
import cafeBakeryCounter from "@/assets/cafe-bakery-counter.jpg";
import cozyLounge from "@/assets/hungryhub-lounge-cozy.jpg";
import kurkureMomos from "@/assets/kurkure-momos-motion.jpg";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SHOWCASE_ITEMS = [
  {
    id: "woodfired-pizza",
    name: "Woodfired Burrata Pizza & Latte",
    category: "Artisan Dining",
    badge: "100% Hand-Tossed Dough",
    price: 260,
    image: cafeTableSetting,
    description:
      "Stone-baked to perfection on Italian Carrara marble tables. Charred bubbly artisan crust with melted burrata, fragrant basil, paired with swan latte art.",
    details: [
      "Fresh burrata & mozzarella cheese pull",
      "Specialty swan foam latte art",
      "Stone oven baked at 400°C",
      "Never frozen base",
    ],
    steam: true,
  },
  {
    id: "espresso-bakery",
    name: "Fluted Wood Espresso & Bakery Bar",
    category: "Specialty Coffee",
    badge: "Fresh Baked Croissants & Brews",
    price: 150,
    image: cafeBakeryCounter,
    description:
      "Watch our baristas craft signature espresso blends and pour silky steamed milk at the fluted oak counter, surrounded by fresh artisan bakery treats.",
    details: [
      "Freshly ground espresso beans",
      "Golden butter croissants & tarts",
      "Warm glowing under-counter bar",
      "Iced frappes & cold brews",
    ],
    steam: true,
  },
  {
    id: "botanical-mezzanine",
    name: "Botanical Mezzanine & Cafe Lounge",
    category: "Atmosphere",
    badge: "Open 24 Hours Everyday",
    price: 0,
    image: cozyLounge,
    description:
      "Relax amidst cascading green ivy, plush emerald velvet booths, cream boucle armchairs, and glowing 'Good Food Good Mood' neon sign in our double-height lounge.",
    details: [
      "Sunlit double-height architecture",
      "Mezzanine level cozy tables",
      "24/7 round-the-clock service",
      "Parties, study sessions & dates",
    ],
    steam: false,
  },
  {
    id: "kurkure-momos",
    name: "Crunchy Kurkure Momos",
    category: "Rajpura Favorite",
    badge: "Bestseller in Rajpura",
    price: 130,
    image: kurkureMomos,
    description:
      "Extra crispy golden coating on the outside with juicy seasoned paneer and vegetable filling, served with fiery garlic chili dip and creamy mayo.",
    details: [
      "Crispy Kurkure crust",
      "Juicy spiced filling",
      "Fiery Schezwan dip",
      "Creamy garlic mayo",
    ],
    steam: true,
  },
];

export function InteractiveFoodShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const cart = useCart();
  const current = SHOWCASE_ITEMS[activeTab] ?? SHOWCASE_ITEMS[0]!;

  const handleAddCurrent = () => {
    if (current.price === 0) return;
    cart.addLine({
      key: `${current.id}-${Date.now()}`,
      itemId: current.id,
      name: current.name,
      image: current.image,
      selections: ["Chef's Special"],
      unitPrice: current.price,
    });
    toast.success(`${current.name} added to cart!`);
    cart.setOpen(true);
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden bg-primary-deep text-primary-foreground">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none animate-gold-glow" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="mx-auto max-w-7xl relative z-10">
        <SectionHeading
          eyebrow="Living Motion & Taste"
          title="Feel the Craving in Motion"
          subtitle="Real food, real ambiance, and steaming hot flavors crafted fresh in our Rajpura kitchen."
          className="text-primary-foreground"
        />

        {/* Interactive Dish Selector Tabs with 3D Depth */}
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {SHOWCASE_ITEMS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(index)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer select-none",
                activeTab === index
                  ? "btn-3d-gold"
                  : "border-white/20 bg-white/10 text-white/85 shadow-[0_3px_0_rgba(0,0,0,0.35)] hover:bg-white/20 hover:text-white hover:-translate-y-0.5 active:translate-y-1 active:shadow-none",
              )}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Main Interactive Motion Showcase Card */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 items-center">
          {/* Left Column: Living Moving Picture Frame */}
          <div className="lg:col-span-7">
            <Reveal key={current.id}>
              <div className="relative group overflow-hidden rounded-3xl border border-white/20 bg-black shadow-2xl">
                <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Lighting & Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-1 text-xs font-bold text-black uppercase shadow-md">
                    <Flame className="h-3.5 w-3.5" />
                    {current.badge}
                  </div>

                  {/* Live Status Indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Baking Fresh 24/7
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="font-display text-2xl sm:text-3xl font-bold drop-shadow-md">
                      {current.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gold mt-1 font-medium">
                      {current.category} · Crafted Daily in Rajpura
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Dish Narrative, Features & Direct Action */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal delay={100} key={`text-${current.id}`}>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3.5 py-1 text-xs font-bold tracking-wider text-gold uppercase border border-gold/30">
                  <Star className="h-3.5 w-3.5 fill-gold" /> Authentic Taste & Craft
                </span>

                <h3 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {current.name}
                </h3>

                <p className="mt-4 text-base leading-relaxed text-primary-foreground/85">
                  {current.description}
                </p>

                {/* Key Dish Highlights */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {current.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-2xl border border-primary-foreground/20 bg-primary-deep/80 p-3 text-xs font-semibold text-primary-foreground/90 backdrop-blur-sm hover:border-gold/50 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* 3D Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
                  {current.price > 0 ? (
                    <Button
                      onClick={handleAddCurrent}
                      size="lg"
                      variant="gold"
                      className="rounded-full px-8 py-6 text-sm font-black uppercase btn-3d-gold btn-shimmer-sweep cursor-pointer"
                    >
                      <Utensils className="h-4 w-4 mr-2" />
                      Order for ₹{current.price}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      variant="gold"
                      className="rounded-full px-8 py-6 text-sm font-black uppercase btn-3d-gold btn-shimmer-sweep cursor-pointer"
                    >
                      <Link to="/contact">
                        <Clock className="h-4 w-4 mr-2" />
                        Visit & Reserve a Table
                      </Link>
                    </Button>
                  )}

                  <Button
                    asChild
                    size="lg"
                    variant="glass"
                    className="rounded-full px-6 py-6 text-sm font-bold btn-3d-glass cursor-pointer"
                  >
                    <Link to="/menu">
                      Explore Full Menu <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
