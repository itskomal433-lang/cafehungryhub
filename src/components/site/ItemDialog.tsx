import { useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  extraCheesePrice,
  extraToppingPrice,
  extraToppings,
  pizzaBases,
  type MenuItem,
  type PizzaSize,
} from "@/data/menu";
import { formatPrice } from "@/data/restaurant";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const DEFAULT_BASE = pizzaBases[0]?.name ?? "Pan";

function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h4 className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[0.62rem] text-primary-foreground">
          {index}
        </span>
        {title}
      </h4>
      {children}
    </section>
  );
}

function Choice({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left transition-all duration-150 cursor-pointer select-none",
        active
          ? "border-amber-500 bg-gradient-to-b from-amber-500/15 to-amber-500/5 ring-2 ring-amber-500/40 shadow-[0_3px_0_#d97706,0_6px_12px_rgba(217,119,6,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] active:translate-y-1 active:shadow-[0_1px_0_#d97706]"
          : "border-border/80 bg-card hover:border-amber-500/40 hover:bg-secondary/40 shadow-[0_2px_0_var(--border)] active:translate-y-0.5",
      )}
    >
      <span className="block text-sm font-semibold">{label}</span>
      {hint ? (
        <span className="block text-xs font-mono font-semibold text-primary">{hint}</span>
      ) : null}
    </button>
  );
}

export function ItemDialog({
  item,
  onOpenChange,
}: {
  item: MenuItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { addLine, setOpen } = useCart();
  const [optionIndex, setOptionIndex] = useState(0);
  const [base, setBase] = useState(DEFAULT_BASE);
  const [toppings, setToppings] = useState<string[]>([]);
  const [extraCheese, setExtraCheese] = useState(false);
  const [addOn, setAddOn] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!item) return;
    setOptionIndex(0);
    setBase(DEFAULT_BASE);
    setToppings([]);
    setExtraCheese(false);
    setAddOn(null);
    setQuantity(1);
  }, [item]);

  const option = item?.options[optionIndex];
  const size = (option?.label || "Regular") as PizzaSize;

  const unitPrice = useMemo(() => {
    if (!item || !option) return 0;
    let price = option.price;
    if (item.pizza) {
      price += pizzaBases.find((entry) => entry.name === base)?.prices[size] ?? 0;
      price += toppings.length * extraToppingPrice[size];
      if (extraCheese) price += extraCheesePrice[size];
    }
    if (addOn) {
      price += item.addOns?.find((entry) => entry.label === addOn)?.price ?? 0;
    }
    return price;
  }, [item, option, base, size, toppings, extraCheese, addOn]);

  if (!item || !option) return null;

  const selections = [
    option.label,
    item.pizza ? `${base} base` : "",
    toppings.length ? `Extra: ${toppings.join(", ")}` : "",
    extraCheese ? "Extra cheese" : "",
    addOn ? `${item.addOnLabel ?? "Choice"}: ${addOn}` : "",
  ].filter(Boolean);

  const handleAdd = () => {
    addLine(
      {
        key: `${item.id}|${selections.join("|")}`,
        itemId: item.id,
        name: item.name,
        image: item.image,
        selections,
        unitPrice,
      },
      quantity,
    );
    onOpenChange(false);
    toast.success(`${item.name} added to cart`, {
      action: { label: "View cart", onClick: () => setOpen(true) },
    });
  };

  let step = 0;

  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-lg">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={900}
          height={506}
          className="h-44 w-full object-cover"
        />
        <div className="space-y-6 p-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="font-display text-2xl">{item.name}</DialogTitle>
            <DialogDescription>
              {item.description ?? `${item.group} · ${item.vegetarian ? "Veg" : ""}`}
            </DialogDescription>
          </DialogHeader>

          {item.options.length > 1 ? (
            <Step index={++step} title={item.pizza ? "Select size" : "Select option"}>
              <div className="grid grid-cols-3 gap-2">
                {item.options.map((entry, index) => (
                  <Choice
                    key={entry.label}
                    active={index === optionIndex}
                    onClick={() => setOptionIndex(index)}
                    label={entry.label}
                    hint={formatPrice(entry.price)}
                  />
                ))}
              </div>
            </Step>
          ) : null}

          {item.pizza ? (
            <>
              <Step index={++step} title="Choice of base">
                <div className="grid gap-2 sm:grid-cols-3">
                  {pizzaBases.map((entry) => (
                    <Choice
                      key={entry.name}
                      active={entry.name === base}
                      onClick={() => setBase(entry.name)}
                      label={entry.name}
                      hint={`+ ${formatPrice(entry.prices[size])}`}
                    />
                  ))}
                </div>
              </Step>

              <Step
                index={++step}
                title={`Extra toppings (+${formatPrice(extraToppingPrice[size])} each)`}
              >
                <div className="grid grid-cols-2 gap-2">
                  {extraToppings.map((topping) => {
                    const checked = toppings.includes(topping);
                    return (
                      <label
                        key={topping}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm transition-colors",
                          checked ? "border-primary bg-primary/8" : "border-border bg-card",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            setToppings((current) =>
                              value
                                ? [...current, topping]
                                : current.filter((entry) => entry !== topping),
                            )
                          }
                        />
                        {topping}
                      </label>
                    );
                  })}
                </div>
              </Step>

              <Step index={++step} title="Extra cheese">
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors",
                    extraCheese ? "border-primary bg-primary/8" : "border-border bg-card",
                  )}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Checkbox
                      checked={extraCheese}
                      onCheckedChange={(value) => setExtraCheese(Boolean(value))}
                    />
                    Add extra cheese
                  </span>
                  <span className="text-muted-foreground">
                    + {formatPrice(extraCheesePrice[size])}
                  </span>
                </label>
              </Step>
            </>
          ) : null}

          {item.addOns?.length ? (
            <Step index={++step} title={item.addOnLabel ?? "Choice"}>
              <div className="grid gap-2 sm:grid-cols-2">
                {item.addOns.map((entry) => (
                  <Choice
                    key={entry.label}
                    active={addOn === entry.label}
                    onClick={() => setAddOn(addOn === entry.label ? null : entry.label)}
                    label={entry.label}
                    hint={`+ ${formatPrice(entry.price)}`}
                  />
                ))}
              </div>
            </Step>
          ) : null}

          <Step index={++step} title="Quantity">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setQuantity((value) => Math.min(30, value + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{formatPrice(unitPrice)} each</p>
            </div>
          </Step>

          <Separator />

          <Button
            size="lg"
            variant="gold"
            className="w-full rounded-full text-base font-black uppercase py-6 btn-3d-gold btn-shimmer-sweep cursor-pointer"
            onClick={handleAdd}
          >
            Add to Cart · {formatPrice(unitPrice * quantity)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
