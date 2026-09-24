import { useMemo, useState } from "react";
import { LayoutGrid, List, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/site/FoodCard";
import { ItemDialog } from "@/components/site/ItemDialog";
import {
  categories,
  fromPrice,
  isCustomisable,
  menu,
  type CategoryId,
  type MenuItem,
} from "@/data/menu";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortMode = "featured" | "low" | "high";

export function MenuBrowser({
  initialCategory = "all",
  limit,
}: {
  initialCategory?: CategoryId | "all";
  limit?: number;
}) {
  const { addLine, setOpen } = useCart();
  const [category, setCategory] = useState<CategoryId | "all">(initialCategory);
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [bestOnly, setBestOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [active, setActive] = useState<MenuItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: menu.length };
    for (const cat of categories) {
      counts[cat.id] = menu.filter((item) => item.category === cat.id).length;
    }
    return counts;
  }, []);

  const items = useMemo(() => {
    const text = query.trim().toLowerCase();
    let result = menu.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (vegOnly && !item.vegetarian) return false;
      if (bestOnly && !item.bestseller) return false;
      if (
        text &&
        !`${item.name} ${item.group} ${item.description ?? ""}`.toLowerCase().includes(text)
      )
        return false;
      return true;
    });
    if (sort === "low") result = [...result].sort((a, b) => fromPrice(a) - fromPrice(b));
    if (sort === "high") result = [...result].sort((a, b) => fromPrice(b) - fromPrice(a));
    return limit ? result.slice(0, limit) : result;
  }, [category, query, vegOnly, bestOnly, sort, limit]);

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setVegOnly(false);
    setBestOnly(false);
    setSort("featured");
  };

  const handleSelect = (item: MenuItem) => {
    if (isCustomisable(item)) {
      setActive(item);
      return;
    }
    const option = item.options[0];
    if (!option) return;
    addLine({
      key: item.id,
      itemId: item.id,
      name: item.name,
      image: item.image,
      selections: [],
      unitPrice: option.price,
    });
    toast.success(`${item.name} added to cart`, {
      action: { label: "View cart", onClick: () => setOpen(true) },
    });
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs with Item Counts */}
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {[{ id: "all" as const, label: "All" }, ...categories].map((entry) => {
          const count = categoryCounts[entry.id] ?? 0;
          const isActive = category === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setCategory(entry.id as CategoryId | "all")}
              className={cn(
                "group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all duration-150 cursor-pointer select-none",
                isActive ? "btn-3d-gold" : "btn-3d-outline hover:border-amber-500/60",
              )}
            >
              <span>{entry.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.68rem] font-bold",
                  isActive
                    ? "bg-stone-950/20 text-stone-950"
                    : "bg-muted text-muted-foreground group-hover:bg-amber-500/15 group-hover:text-amber-700",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="hh-shadow flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pizzas, momos, pasta, shakes…"
            aria-label="Search the menu"
            className="h-11 rounded-full pr-9 pl-10"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={vegOnly ? "gold" : "outline"}
            onClick={() => setVegOnly((value) => !value)}
            className={cn(
              "rounded-full cursor-pointer text-xs font-bold",
              vegOnly ? "btn-3d-gold" : "btn-3d-outline",
            )}
            size="sm"
          >
            Veg only
          </Button>
          <Button
            type="button"
            variant={bestOnly ? "gold" : "outline"}
            onClick={() => setBestOnly((value) => !value)}
            className={cn(
              "rounded-full cursor-pointer text-xs font-bold",
              bestOnly ? "btn-3d-gold" : "btn-3d-outline",
            )}
            size="sm"
          >
            Bestsellers
          </Button>
          <label className="flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-bold shadow-[0_2px_0_var(--border)]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="sr-only">Sort by price</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="cursor-pointer bg-transparent text-xs font-bold outline-none"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-full border border-border/80 bg-card p-1 shadow-[0_2px_0_var(--border)]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-full p-1.5 transition-colors cursor-pointer",
                viewMode === "grid"
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Grid view (small images)"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("compact")}
              className={cn(
                "rounded-full p-1.5 transition-colors cursor-pointer",
                viewMode === "compact"
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Compact list view (small thumbnails)"
              aria-label="Compact list view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List or Zero State */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <p className="font-display text-xl font-bold">No dishes found</p>
          <p className="max-w-md text-sm text-muted-foreground">
            We couldn't find anything matching your filters or search keywords.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            className="gap-2 rounded-full font-semibold cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Reset all filters
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4 sm:gap-5",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 lg:grid-cols-2",
          )}
        >
          {items.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onSelect={handleSelect}
              layout={viewMode}
            />
          ))}
        </div>
      )}

      <ItemDialog item={active} onOpenChange={(open) => !open && setActive(null)} />
    </div>
  );
}
