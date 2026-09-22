import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Maximize2,
  Sparkles,
  Trees,
  Utensils,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { categories } from "@/data/menu";
import interior from "@/assets/interior.jpg";
import cafeTableSetting from "@/assets/cafe-table-setting.jpg";
import cafeBakeryCounter from "@/assets/cafe-bakery-counter.jpg";
import catFries from "@/assets/cat-fries.jpg";
import catSoup from "@/assets/cat-soup.jpg";
import catChaap from "@/assets/cat-chaap.jpg";
import catShake from "@/assets/cat-shake.jpg";
import heroPizza from "@/assets/hero-pizza.jpg";
import { cn } from "@/lib/utils";

type GalleryTile = {
  label: string;
  image: string;
  category: "all" | "pizza" | "fastfood" | "drinks" | "space";
  caption: string;
};

const galleryItems: GalleryTile[] = [
  {
    label: "Botanical Mezzanine & Lounge",
    image: interior,
    category: "space",
    caption:
      "Double-height sunlit cafe sanctuary with plush velvet seating, hanging greenery, and warm neon ambiance.",
  },
  {
    label: "Fluted Wood Espresso & Bakery Bar",
    image: cafeBakeryCounter,
    category: "drinks",
    caption:
      "Artisan coffee bar with warm oak fluting, fresh morning pastries, croissants, and specialty espresso blends.",
  },
  {
    label: "Marble Table Burrata Pizza & Brews",
    image: cafeTableSetting,
    category: "pizza",
    caption:
      "Stone-baked bubbly crust topped with creamy burrata cheese and fresh basil on Italian Carrara marble.",
  },
  {
    label: "Hand-Tossed Gourmet Pizzas",
    image: heroPizza,
    category: "pizza",
    caption:
      "100% fresh base dough, hand-stretched with rich garlic herbs and melted golden mozzarella.",
  },
  {
    label: "Steamed & Crunchy Kurkure Momos",
    image: categories[2]?.image || catSoup,
    category: "fastfood",
    caption: "Rajpura's top rated crunchy kurkure and tender steamed dumplings with spicy dip.",
  },
  {
    label: "Loaded Gourmet Burgers",
    image: categories[1]?.image || catFries,
    category: "fastfood",
    caption:
      "Crispy patties layered with fresh garden veggies, herbs, and signature house cafe sauce.",
  },
  {
    label: "Wok-Tossed Chinese & Noodles",
    image: categories[3]?.image || catChaap,
    category: "fastfood",
    caption: "Sizzling spicy Hakka noodles, crispy Manchurian, and fiery chili paneer specialties.",
  },
  {
    label: "Creamy Italian Pasta Bowls",
    image: categories[4]?.image || catSoup,
    category: "fastfood",
    caption:
      "Al dente penne bathed in rich Alfredo cream sauce, garden herbs, and toasted garlic bread.",
  },
  {
    label: "Artisan Shakes & Frappes",
    image: catShake,
    category: "drinks",
    caption: "Belgian chocolate, Oreo crunch, strawberry velvet, and chilled cold coffee frappes.",
  },
  {
    label: "Tandoori & Charred Chaap",
    image: catChaap,
    category: "fastfood",
    caption: "Smoky marinated soya chaap grilled over coals with mint chutney and lemon wedges.",
  },
  {
    label: "Seasoned Peri-Peri Fries",
    image: catFries,
    category: "fastfood",
    caption: "Golden crisp French fries tossed in signature peri-peri spice with garlic mayo dip.",
  },
  {
    label: "Refreshing Coolers & Mojitos",
    image: categories[7]?.image || catShake,
    category: "drinks",
    caption:
      "Ice-cold mint mojitos, blue curacao, and fresh zesty coolers served in crystal glassware.",
  },
];

export function GallerySection({ full = false }: { full?: boolean }) {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "pizza" | "fastfood" | "drinks" | "space"
  >("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const displayedTiles = full
    ? galleryItems.filter((t) => selectedFilter === "all" || t.category === selectedFilter)
    : galleryItems.slice(0, 8);

  const activeImage = activeIndex !== null ? displayedTiles[activeIndex] : null;

  const handleNext = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % displayedTiles.length);
    }
  };

  const handlePrev = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + displayedTiles.length) % displayedTiles.length);
    }
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Visual Feast"
          title="Straight from the kitchen"
          subtitle="A look at what comes out of the Hungry Hub kitchen and our cozy dining space."
        />

        {full ? (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "all" as const, label: "All Photos" },
              { id: "pizza" as const, label: "Pizzas" },
              { id: "fastfood" as const, label: "Momos, Burgers & Chinese" },
              { id: "drinks" as const, label: "Shakes & Drinks" },
              { id: "space" as const, label: "Our Space" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer select-none",
                  selectedFilter === tab.id
                    ? "btn-3d-gold"
                    : "btn-3d-outline hover:border-amber-500",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {displayedTiles.map((tile, index) => (
            <Reveal key={tile.label} delay={(index % 4) * 60}>
              <figure
                onClick={() => setActiveIndex(index)}
                className="group card-hover-lift relative cursor-pointer overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all hover:border-primary/50"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={tile.image}
                    alt={`${tile.label} at Hungry Hub Rajpura`}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Subtle Gradient & Hover Glare */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="btn-shimmer-sweep absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <span className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:scale-105 shadow-md">
                  <Maximize2 className="h-4 w-4 text-primary" />
                </span>

                <figcaption className="absolute inset-x-0 bottom-0 p-3.5 text-xs sm:text-sm font-bold text-primary-foreground">
                  <p className="drop-shadow-sm leading-tight">{tile.label}</p>
                  <p className="text-[10px] text-gold font-normal mt-0.5 line-clamp-1 opacity-90 drop-shadow-xs">
                    {tile.caption}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {!full ? (
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="gold"
              className="rounded-full px-9 py-6 text-sm font-black uppercase btn-3d-gold btn-shimmer-sweep cursor-pointer"
            >
              <Link to="/gallery">
                <Sparkles className="h-4 w-4 mr-2 text-stone-950 animate-sparkle" />
                Explore Full Gallery
              </Link>
            </Button>
          </div>
        ) : null}

        <p className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Sparkles className="h-3 w-3 text-gold" />
          Images represent our fresh creations; authentic taste and presentation crafted daily in
          Rajpura.
        </p>
      </div>

      {/* Lightbox Dialog with Smooth Navigation */}
      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-3xl p-0 border border-border shadow-2xl bg-card">
          {activeImage ? (
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeImage.image}
                  alt={activeImage.label}
                  className="h-full w-full object-cover animate-in zoom-in-95 duration-200"
                />

                {/* Left/Right Carousel Arrows */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 active:scale-95 shadow-[0_3px_0_rgba(0,0,0,0.5)] cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 active:scale-95 shadow-[0_3px_0_rgba(0,0,0,0.5)] cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-card">
                <div>
                  <DialogTitle className="font-display text-xl font-bold text-foreground">
                    {activeImage.label}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">{activeImage.caption}</p>
                </div>
                <Button
                  asChild
                  variant="gold"
                  className="rounded-full font-black uppercase text-xs btn-3d-gold btn-shimmer-sweep cursor-pointer"
                >
                  <Link to="/menu">
                    <Utensils className="h-4 w-4 mr-1.5" /> Order This Dish
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
