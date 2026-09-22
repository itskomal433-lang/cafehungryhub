import { Flame, Leaf, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fromPrice, isCustomisable, type MenuItem } from "@/data/menu";
import { formatPrice } from "@/data/restaurant";
import { cn } from "@/lib/utils";

export function FoodCard({
  item,
  onSelect,
  className,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  className?: string;
}) {
  const price = fromPrice(item);
  const multi = item.options.length > 1;

  return (
    <article
      className={cn(
        "group hh-shadow relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-gold/50",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={900}
          height={675}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.bestseller ? (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[0.62rem] font-extrabold tracking-[0.14em] text-gold-foreground uppercase shadow-md animate-bounce-subtle border border-amber-300/40">
              ⭐ Bestseller
            </span>
          ) : null}
          {item.isNew ? (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-accent-foreground uppercase shadow-md">
              Chef Special
            </span>
          ) : null}
        </div>
        {item.vegetarian ? (
          <span
            title="Vegetarian"
            className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-[0.4rem] border-2 border-veg bg-card shadow-sm"
          >
            <Leaf className="h-3 w-3 text-veg" aria-hidden="true" />
            <span className="sr-only">Vegetarian</span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-bold text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          {item.spicy ? (
            <Flame className="mt-1 h-4 w-4 shrink-0 text-accent animate-pulse" aria-label="Spicy" />
          ) : null}
        </div>

        {item.description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground font-medium">
            {item.description}
          </p>
        ) : null}

        <p className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground/80 uppercase">
          {item.group}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-border/60">
          <p className="font-display text-xl font-extrabold text-foreground">
            {multi ? (
              <>
                <span className="text-xs font-semibold text-muted-foreground">from </span>
                {formatPrice(price)}
              </>
            ) : (
              formatPrice(price)
            )}
          </p>

          <Button
            size="sm"
            variant={isCustomisable(item) ? "outline" : "default"}
            onClick={() => onSelect(item)}
            className={cn(
              "rounded-full font-bold text-xs uppercase px-4 py-2 cursor-pointer transition-all",
              isCustomisable(item)
                ? "btn-3d-outline hover:border-amber-500 hover:text-amber-700"
                : "btn-3d-primary btn-shimmer-sweep",
            )}
          >
            {isCustomisable(item) ? (
              "Customise"
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1 group-hover:rotate-90 transition-transform duration-200" />{" "}
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
