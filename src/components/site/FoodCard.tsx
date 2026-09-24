import { Flame, Leaf, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fromPrice, isCustomisable, type MenuItem } from "@/data/menu";
import { formatPrice } from "@/data/restaurant";
import { cn } from "@/lib/utils";

export interface FoodCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  className?: string;
  layout?: "grid" | "compact";
}

export function FoodCard({
  item,
  onSelect,
  className,
  layout = "grid",
}: FoodCardProps) {
  const price = fromPrice(item);
  const multi = item.options.length > 1;

  if (layout === "compact") {
    return (
      <article
        className={cn(
          "group hh-shadow relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gold/50",
          className,
        )}
      >
        <div className="flex flex-1 flex-col gap-1.5 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            {item.vegetarian ? (
              <span
                title="Vegetarian"
                className="grid h-4 w-4 place-items-center rounded-[0.25rem] border border-veg bg-card shrink-0"
              >
                <Leaf className="h-2.5 w-2.5 text-veg" aria-hidden="true" />
                <span className="sr-only">Vegetarian</span>
              </span>
            ) : null}
            {item.bestseller ? (
              <span className="rounded-full bg-gold/15 text-gold-foreground dark:text-amber-300 px-2 py-0.5 text-[0.6rem] font-extrabold tracking-wider uppercase border border-gold/30">
                ⭐ Bestseller
              </span>
            ) : null}
            {item.isNew ? (
              <span className="rounded-full bg-accent/15 text-accent px-2 py-0.5 text-[0.6rem] font-bold uppercase border border-accent/30">
                Chef Special
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {item.name}
            </h3>
            {item.spicy ? (
              <Flame className="h-3.5 w-3.5 shrink-0 text-accent animate-pulse" aria-label="Spicy" />
            ) : null}
          </div>

          {item.description ? (
            <p className="line-clamp-1 text-xs text-muted-foreground font-medium">
              {item.description}
            </p>
          ) : null}

          <div className="mt-1 flex items-center gap-3">
            <p className="font-display text-base sm:text-lg font-extrabold text-foreground">
              {multi ? (
                <>
                  <span className="text-[0.7rem] font-semibold text-muted-foreground">from </span>
                  {formatPrice(price)}
                </>
              ) : (
                formatPrice(price)
              )}
            </p>
            <span className="text-[0.62rem] font-bold tracking-wider text-muted-foreground/70 uppercase">
              {item.group}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative h-20 w-20 sm:h-22 sm:w-22 overflow-hidden rounded-xl bg-muted border border-border/60 shadow-xs">
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              width={200}
              height={200}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <Button
            size="sm"
            variant={isCustomisable(item) ? "outline" : "default"}
            onClick={() => onSelect(item)}
            className={cn(
              "h-7 rounded-full font-bold text-[0.68rem] uppercase px-3 py-1 cursor-pointer transition-all w-full",
              isCustomisable(item)
                ? "btn-3d-outline hover:border-amber-500 hover:text-amber-700"
                : "btn-3d-primary",
            )}
          >
            {isCustomisable(item) ? (
              "Customise"
            ) : (
              <>
                <Plus className="h-3 w-3 mr-0.5" /> Add
              </>
            )}
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group hh-shadow relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold/50",
        className,
      )}
    >
      {/* Minimized Small Image Container */}
      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={400}
          height={260}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {item.bestseller ? (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[0.58rem] font-extrabold tracking-[0.12em] text-gold-foreground uppercase shadow-md border border-amber-300/40">
              ⭐ Bestseller
            </span>
          ) : null}
          {item.isNew ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.12em] text-accent-foreground uppercase shadow-md">
              Chef Special
            </span>
          ) : null}
        </div>
        {item.vegetarian ? (
          <span
            title="Vegetarian"
            className="absolute top-2.5 right-2.5 grid h-5 w-5 place-items-center rounded-[0.35rem] border border-veg bg-card/95 shadow-sm backdrop-blur-xs"
          >
            <Leaf className="h-2.5 w-2.5 text-veg" aria-hidden="true" />
            <span className="sr-only">Vegetarian</span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base leading-snug font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          {item.spicy ? (
            <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent animate-pulse" aria-label="Spicy" />
          ) : null}
        </div>

        {item.description ? (
          <p className="line-clamp-2 text-[0.78rem] leading-relaxed text-muted-foreground font-medium">
            {item.description}
          </p>
        ) : null}

        <p className="text-[0.62rem] font-bold tracking-[0.16em] text-muted-foreground/80 uppercase">
          {item.group}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 border-t border-border/60">
          <p className="font-display text-lg font-extrabold text-foreground">
            {multi ? (
              <>
                <span className="text-[0.7rem] font-semibold text-muted-foreground">from </span>
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
              "h-8 rounded-full font-bold text-xs uppercase px-3.5 py-1.5 cursor-pointer transition-all",
              isCustomisable(item)
                ? "btn-3d-outline hover:border-amber-500 hover:text-amber-700 text-[0.68rem]"
                : "btn-3d-primary btn-shimmer-sweep text-[0.68rem]",
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
