import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Minus,
  Package,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { charges, formatPrice, restaurant } from "@/data/restaurant";
import { useCart, type CartLine } from "@/lib/cart";
import { saveOrderToAdmin } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import catPizza from "@/assets/cat-pizza.jpg";
import catMomos from "@/assets/cat-momos.jpg";
import catDrinks from "@/assets/cat-drinks.jpg";

type OrderType = "Dine-in" | "Takeaway" | "Delivery";

const QUICK_STARTERS = [
  {
    id: "pizza-margherita",
    name: "Margherita Pizza",
    price: 150,
    image: catPizza,
    tag: "Bestseller",
  },
  {
    id: "momos-veg-steam",
    name: "Veg Steamed Momos",
    price: 70,
    image: catMomos,
    tag: "Popular",
  },
  {
    id: "mojito-mint",
    name: "Mint Mojito",
    price: 90,
    image: catDrinks,
    tag: "Cooler",
  },
];

function LineRow({
  line,
  onQuantity,
  onRemove,
}: {
  line: CartLine;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-xs">
      <img
        src={line.image}
        alt={line.name}
        loading="lazy"
        width={120}
        height={120}
        className="h-16 w-16 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold">{line.name}</p>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.name}`}
            className="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {line.selections.length ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {line.selections.join(" · ")}
          </p>
        ) : null}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/40">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full"
              onClick={() => onQuantity(line.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-6 text-center text-xs font-bold">{line.quantity}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full"
              onClick={() => onQuantity(line.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-sm font-bold text-primary">
            {formatPrice(line.unitPrice * line.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const cart = useCart();
  const [checkout, setCheckout] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("Delivery");
  const [couponCode, setCouponCode] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    pickupTime: "",
    table: "",
    notes: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleQuickAdd = (item: (typeof QUICK_STARTERS)[number]) => {
    cart.addLine({
      key: item.id,
      itemId: item.id,
      name: item.name,
      image: item.image,
      selections: [],
      unitPrice: item.price,
    });
    toast.success(`${item.name} added to cart`);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanPhone = form.phone.replace(/[^0-9+]/g, "");
    if (!form.name.trim() || cleanPhone.length < 10) {
      toast.error("Please provide your name and a valid 10-digit phone number.");
      return;
    }
    if (orderType === "Delivery" && !form.address.trim()) {
      toast.error("Please add a delivery address.");
      return;
    }

    const lines = cart.lines
      .map(
        (line) =>
          `• ${line.quantity} × ${line.name}${
            line.selections.length ? ` (${line.selections.join(", ")})` : ""
          } — ${formatPrice(line.unitPrice * line.quantity)}`,
      )
      .join("\n");

    const details = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      orderType === "Delivery" ? `Address: ${form.address}` : "",
      orderType === "Delivery" && form.landmark ? `Landmark: ${form.landmark}` : "",
      orderType === "Takeaway" && form.pickupTime ? `Pickup: ${form.pickupTime}` : "",
      orderType === "Dine-in" && form.table ? `Table: ${form.table}` : "",
      couponCode.trim() ? `Coupon/Offer: ${couponCode.trim()}` : "",
      form.notes ? `Special Notes: ${form.notes}` : "",
    ].filter(Boolean);

    const message = [
      `🔔 *New Order — ${restaurant.fullName}*`,
      `*Order Type:* ${orderType}`,
      "",
      `*Items:*`,
      lines,
      "",
      `Subtotal: ${formatPrice(cart.subtotal)}`,
      cart.deliveryFee ? `${charges.deliveryFeeLabel}: ${formatPrice(cart.deliveryFee)}` : "",
      cart.tax ? `${charges.taxLabel}: ${formatPrice(cart.tax)}` : "",
      `*Grand Total: ${formatPrice(cart.total)}*`,
      "",
      `*Customer Details:*`,
      ...details,
    ]
      .filter((row) => row !== "")
      .join("\n");

    // Auto-save to Admin Live Kitchen POS Queue
    saveOrderToAdmin({
      customerName: form.name.trim() || "Online Customer",
      customerPhone: form.phone.trim() || "WhatsApp",
      orderType,
      tableOrAddress:
        orderType === "Delivery"
          ? form.address.trim()
          : orderType === "Takeaway"
            ? `Takeaway (Pickup: ${form.pickupTime || "ASAP"})`
            : `Table ${form.table || "1"}`,
      landmark: form.landmark.trim() || undefined,
      items: cart.lines.map((l) => ({
        id: l.itemId,
        name: l.name,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        selections: l.selections,
      })),
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      tax: cart.tax,
      total: cart.total,
      status: "New",
      paymentMethod: "Online",
      paymentStatus: "Pending",
      notes: form.notes.trim() || undefined,
      couponCode: couponCode.trim() || undefined,
    });

    window.open(
      `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    toast.success("Order summary prepared! Please tap send on WhatsApp to confirm.");
    cart.clear();
    setCheckout(false);
    cart.setOpen(false);
  };

  return (
    <Sheet open={cart.isOpen} onOpenChange={cart.setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border bg-cream/40 px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl">
              {checkout ? "Order Details" : "Your Cart"}
            </SheetTitle>
            {cart.lines.length > 0 && !checkout ? (
              <button
                type="button"
                onClick={() => {
                  cart.clear();
                  toast.info("Cart cleared");
                }}
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
              >
                Clear all
              </button>
            ) : null}
          </div>
          <SheetDescription>
            {checkout
              ? "We'll send this order straight to the Hungry Hub kitchen."
              : `${cart.count} item${cart.count === 1 ? "" : "s"} · Open 24 Hours`}
          </SheetDescription>
        </SheetHeader>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-secondary text-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Craving delicious pizza, momos, or a chilled shake?
              </p>
            </div>

            <div className="mt-4 w-full text-left">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Popular Quick Adds
              </p>
              <div className="mt-3 space-y-2">
                {QUICK_STARTERS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-2.5 transition-colors hover:border-primary/40"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="text-xs font-bold text-primary">{formatPrice(item.price)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAdd(item)}
                      className="h-8 rounded-full px-3 text-xs font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col gap-2">
              <Button className="w-full rounded-full font-bold" onClick={() => cart.setOpen(false)}>
                <Utensils className="h-4 w-4" /> Explore Full Menu
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full text-xs font-semibold"
                onClick={() => cart.setOpen(false)}
              >
                <Link to="/orders">
                  <Package className="mr-1.5 h-3.5 w-3.5 text-primary" /> Track My Live Orders
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {checkout ? (
              <form id="hh-order-form" onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(["Dine-in", "Takeaway", "Delivery"] as OrderType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={cn(
                        "rounded-2xl border px-2 py-3 text-sm font-semibold transition-all",
                        orderType === type
                          ? "border-primary bg-primary text-primary-foreground shadow-xs"
                          : "border-border bg-card hover:border-primary/50",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hh-name">Your Full Name *</Label>
                  <Input
                    id="hh-name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hh-phone">Phone Number *</Label>
                  <Input
                    id="hh-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="e.g. 98765 43210"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    required
                  />
                </div>

                {orderType === "Delivery" ? (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="hh-address">Delivery Address *</Label>
                      <Textarea
                        id="hh-address"
                        placeholder="House / Flat No., Street, Area in Rajpura..."
                        value={form.address}
                        onChange={(event) => update("address", event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hh-landmark">Nearest Landmark (optional)</Label>
                      <Input
                        id="hh-landmark"
                        placeholder="Near MLA Road / Gurudwara / School"
                        value={form.landmark}
                        onChange={(event) => update("landmark", event.target.value)}
                      />
                    </div>
                  </>
                ) : null}

                {orderType === "Takeaway" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="hh-pickup">Pickup Time Preference</Label>
                    <Input
                      id="hh-pickup"
                      placeholder="e.g. in 20 minutes / 8:30 PM"
                      value={form.pickupTime}
                      onChange={(event) => update("pickupTime", event.target.value)}
                    />
                  </div>
                ) : null}

                {orderType === "Dine-in" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="hh-table">Table Number / Guests</Label>
                    <Input
                      id="hh-table"
                      placeholder="e.g. Table 4 / 3 Guests"
                      value={form.table}
                      onChange={(event) => update("table", event.target.value)}
                    />
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <Label htmlFor="hh-coupon">Coupon Code or Offer Name (optional)</Label>
                  <Input
                    id="hh-coupon"
                    placeholder="e.g. WEDNESDAY-BOGO / FREE-PASTA"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hh-notes">Special Cooking / Delivery Instructions</Label>
                  <Textarea
                    id="hh-notes"
                    placeholder="e.g. Less spicy, extra oregano, call before ringing bell"
                    value={form.notes}
                    onChange={(event) => update("notes", event.target.value)}
                  />
                </div>
              </form>
            ) : (
              <ul className="space-y-3">
                {cart.lines.map((line) => (
                  <LineRow
                    key={line.key}
                    line={line}
                    onQuantity={(quantity) => cart.setQuantity(line.key, quantity)}
                    onRemove={() => cart.removeLine(line.key)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}

        {cart.lines.length > 0 ? (
          <div className="space-y-3 border-t border-border bg-secondary/60 px-5 py-4">
            {/* Animated Delivery Reward Meter */}
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="h-3.5 w-3.5 text-gold animate-sparkle" />
                  {cart.subtotal >= 400
                    ? "🎉 You unlocked Free Garlic Dip & Priority Prep!"
                    : `Add ${formatPrice(400 - cart.subtotal)} more for Free Garlic Dip!`}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {Math.min(100, Math.round((cart.subtotal / 400) * 100))}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (cart.subtotal / 400) * 100)}%` }}
                />
              </div>
            </div>

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(cart.subtotal)}</dd>
              </div>
              {cart.deliveryFee > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{charges.deliveryFeeLabel}</dt>
                  <dd className="font-semibold">{formatPrice(cart.deliveryFee)}</dd>
                </div>
              ) : null}
              {cart.tax > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{charges.taxLabel}</dt>
                  <dd className="font-semibold">{formatPrice(cart.tax)}</dd>
                </div>
              ) : null}
              <Separator className="my-2" />
              <div className="flex justify-between text-base">
                <dt className="font-display font-bold">Grand Total</dt>
                <dd className="font-display font-bold text-primary">{formatPrice(cart.total)}</dd>
              </div>
            </dl>

            {checkout ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full btn-3d-outline"
                    onClick={() => setCheckout(false)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    form="hh-order-form"
                    variant="gold"
                    className="flex-1 rounded-full text-sm font-black uppercase btn-3d-gold btn-shimmer-sweep"
                    size="lg"
                  >
                    Send Order on WhatsApp <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-primary"
                >
                  <a href={restaurant.phoneHref}>
                    <Phone className="h-3.5 w-3.5 mr-1" /> Prefer calling? Call {restaurant.phone}
                  </a>
                </Button>
              </div>
            ) : (
              <Button
                variant="gold"
                className="w-full rounded-full text-base font-black uppercase btn-3d-gold btn-shimmer-sweep"
                size="lg"
                onClick={() => setCheckout(true)}
              >
                Proceed to Checkout ({formatPrice(cart.total)})
              </Button>
            )}
            <p className="text-center text-[0.72rem] text-muted-foreground">
              Orders are confirmed directly by Hungry Hub Rajpura. Cash on delivery & UPI accepted.
            </p>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
