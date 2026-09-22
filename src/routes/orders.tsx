import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  HelpCircle,
  MapPin,
  Package,
  Phone,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useCustomerOrders } from "@/lib/customer-orders";
import { useCart } from "@/lib/cart";
import { type AdminOrder, type OrderStatus } from "@/lib/admin-store";
import { formatPrice, restaurant } from "@/data/restaurant";
import { cn } from "@/lib/utils";

const title = "My Orders & Live Order Tracking — Hungry Hub Rajpura";
const description =
  "Track your live Hungry Hub pizza, momos and food order status, view order receipts and re-order with 1-click.";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/orders" },
    ],
    links: [{ rel: "canonical", href: "/orders" }],
  }),
  component: MyOrdersPage,
});

const STATUS_STEPS: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
  {
    status: "New",
    label: "Order Received",
    icon: "📝",
    desc: "Order sent to kitchen for confirmation",
  },
  {
    status: "Preparing",
    label: "Kitchen Preparing",
    icon: "👨‍🍳",
    desc: "Fresh ingredients being cooked to order",
  },
  {
    status: "Ready",
    label: "Food Ready",
    icon: "🛎️",
    desc: "Packed steaming hot in the kitchen",
  },
  {
    status: "Out for Delivery",
    label: "Out for Delivery",
    icon: "🛵",
    desc: "Rider is heading to your location",
  },
  {
    status: "Completed",
    label: "Delivered",
    icon: "🎉",
    desc: "Enjoy your fresh meal from Hungry Hub!",
  },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "New":
      return 0;
    case "Preparing":
      return 1;
    case "Ready":
      return 2;
    case "Out for Delivery":
      return 3;
    case "Completed":
      return 4;
    case "Cancelled":
      return -1;
    default:
      return 0;
  }
}

function MyOrdersPage() {
  const { orders, latestOrder, trackOrderByNumber, refreshOrders } = useCustomerOrders();
  const cart = useCart();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const selectedOrderId = selectedOrder?.id;
  // Sync selected order with latest order or active item
  useEffect(() => {
    if (!selectedOrderId && latestOrder) {
      setSelectedOrder(latestOrder);
    } else if (selectedOrderId) {
      const refreshed = orders.find((o) => o.id === selectedOrderId);
      if (refreshed && refreshed !== selectedOrder) {
        setSelectedOrder(refreshed);
      }
    }
  }, [orders, latestOrder, selectedOrderId, selectedOrder]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter an Order ID (e.g. HH-1094) or phone number");
      return;
    }
    setIsSearching(true);
    const found = trackOrderByNumber(searchQuery);
    setIsSearching(false);
    if (found) {
      setSelectedOrder(found);
      toast.success(`Found Order ${found.orderNumber}! Live status loaded.`);
    } else {
      toast.error(`No order found matching "${searchQuery}". Please verify your Order # or phone.`);
    }
  };

  const handleReorder = (order: AdminOrder) => {
    order.items.forEach((item) => {
      cart.addLine(
        {
          key: `${item.id}-${Date.now()}-${Math.random()}`,
          itemId: item.id,
          name: item.name,
          image: "/favicon.ico",
          selections: item.selections || [],
          unitPrice: item.unitPrice,
        },
        item.quantity,
      );
    });
    cart.setOpen(true);
    toast.success(`Added ${order.items.length} items from ${order.orderNumber} to cart!`);
  };

  const activeStep = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="hh-cream-gradient min-h-screen px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Track & Manage"
          title="My Orders"
          subtitle="View live kitchen status, tracking progress, order receipts, and 1-click reordering."
        />

        {/* Order Lookup Search Bar */}
        <div className="mx-auto mt-8 max-w-xl">
          <form
            onSubmit={handleSearchOrder}
            className="flex gap-2 rounded-2xl border border-border/80 bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Track by Order # (e.g. HH-1094) or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 border-none bg-transparent pl-10 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" className="h-11 rounded-xl px-5 font-bold">
              {isSearching ? "Searching..." : "Track Order"}
            </Button>
          </form>
        </div>

        {/* Main Content Layout */}
        {orders.length === 0 && !selectedOrder ? (
          /* Empty State */
          <div className="mx-auto mt-12 max-w-md rounded-3xl border border-border/70 bg-card p-8 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-secondary text-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">No orders placed yet</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              You haven't placed an order from this browser yet. Browse our menu to satisfy your
              cravings!
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild size="lg" className="rounded-full font-bold uppercase">
                <Link to="/menu">Explore Menu & Order Now</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  trackOrderByNumber("HH-1094");
                  toast.success("Loaded demo order HH-1094 for demonstration!");
                }}
                className="rounded-full text-xs text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-gold" /> Load Demo Order (HH-1094)
              </Button>
            </div>
          </div>
        ) : (
          /* Orders Grid & Tracker */
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            {/* Left Column: Order History Cards */}
            <div className="space-y-4 lg:col-span-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Order History</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    refreshOrders();
                    toast.info("Refreshed live kitchen statuses");
                  }}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="mr-1.5 h-3 w-3" /> Refresh
                </Button>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className={cn(
                        "w-full rounded-2xl border p-4 text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-secondary/70 shadow-md ring-1 ring-primary"
                          : "border-border/70 bg-card hover:border-border hover:bg-card/80",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-sm font-bold text-primary">
                            {ord.orderNumber}
                          </span>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] font-bold",
                            ord.status === "New" && "border-amber-500 text-amber-600 bg-amber-50",
                            ord.status === "Preparing" &&
                              "border-blue-500 text-blue-600 bg-blue-50",
                            ord.status === "Ready" &&
                              "border-emerald-500 text-emerald-600 bg-emerald-50",
                            ord.status === "Completed" && "border-slate-300 text-slate-600",
                            ord.status === "Cancelled" && "border-rose-300 text-rose-600",
                          )}
                        >
                          {ord.status}
                        </Badge>
                      </div>

                      <div className="mt-3 text-xs text-foreground/80 line-clamp-1">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                        <span className="font-semibold text-muted-foreground">{ord.orderType}</span>
                        <span className="font-mono font-bold text-foreground">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Tracker & Selected Order Receipt */}
            <div className="space-y-6 lg:col-span-8">
              {selectedOrder && (
                <div className="hh-shadow rounded-3xl border border-border/80 bg-card p-6 sm:p-8">
                  {/* Header of Active Order */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-primary">
                          {selectedOrder.orderNumber}
                        </span>
                        <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                          {selectedOrder.orderType}
                        </Badge>
                        {selectedOrder.status !== "Completed" &&
                          selectedOrder.status !== "Cancelled" && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-pulse">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Live in Kitchen
                            </span>
                          )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Placed on{" "}
                        {new Date(selectedOrder.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => handleReorder(selectedOrder)}
                        className="rounded-full text-xs font-black uppercase px-4 btn-3d-gold btn-shimmer-sweep cursor-pointer group"
                      >
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-stone-950 group-hover:rotate-180 transition-transform duration-500" />{" "}
                        Re-Order Items
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.print()}
                        className="rounded-full text-xs font-bold btn-3d-outline cursor-pointer"
                      >
                        <Printer className="mr-1.5 h-3.5 w-3.5" /> Print Bill
                      </Button>
                    </div>
                  </div>

                  {/* Live Progress Stepper */}
                  {selectedOrder.status !== "Cancelled" ? (
                    <div className="my-8 rounded-3xl bg-secondary/60 p-6 border border-border/80 shadow-xs">
                      <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Live Kitchen Progress</span>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          Real-time Sync Active
                        </span>
                      </h4>

                      {/* Animated Delivery Scooter Track for Live Orders */}
                      {selectedOrder.status !== "Completed" && (
                        <div className="my-4 rounded-2xl bg-primary-deep/90 p-3 text-primary-foreground flex items-center justify-between overflow-hidden relative shadow-md">
                          <div className="flex items-center gap-3 z-10">
                            <span className="text-2xl animate-delivery-ride inline-block">🛵</span>
                            <div>
                              <p className="text-xs font-bold text-gold uppercase tracking-wider">
                                {selectedOrder.status === "Preparing"
                                  ? "👨‍🍳 Kitchen Baking Fresh to Order"
                                  : selectedOrder.status === "Ready"
                                    ? "🛎️ Steaming Hot & Packed"
                                    : selectedOrder.status === "Out for Delivery"
                                      ? "🛵 Rider Out for Delivery in Rajpura"
                                      : "📝 Order Confirmed & Queued"}
                              </p>
                              <p className="text-[11px] text-primary-foreground/80">
                                Fresh hand-tossed dough crafted with authentic ingredients
                              </p>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-gold/80 z-10">
                            <Clock className="h-3.5 w-3.5 animate-spin-slow" />
                            {selectedOrder.orderType}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 grid grid-cols-5 gap-2 text-center relative">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = activeStep >= idx;
                          const isCurrent = activeStep === idx;

                          return (
                            <div key={step.status} className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "grid h-11 w-11 sm:h-14 sm:w-14 place-items-center rounded-2xl text-lg sm:text-2xl transition-all duration-300",
                                  isCurrent
                                    ? "bg-primary text-white shadow-xl ring-4 ring-primary/25 scale-110 animate-pulse-glow"
                                    : isDone
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : "bg-muted text-muted-foreground opacity-50",
                                )}
                              >
                                {isDone && !isCurrent ? "✓" : step.icon}
                              </div>
                              <p
                                className={cn(
                                  "mt-2 text-[11px] sm:text-xs font-bold leading-tight",
                                  isCurrent
                                    ? "text-primary font-extrabold"
                                    : isDone
                                      ? "text-foreground font-semibold"
                                      : "text-muted-foreground",
                                )}
                              >
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" /> Estimated Preparation &
                          Delivery:
                        </span>
                        <span className="font-bold text-foreground">
                          {selectedOrder.status === "Completed"
                            ? "Delivered & Complete"
                            : selectedOrder.orderType === "Delivery"
                              ? "25 - 35 mins"
                              : "15 - 20 mins"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="my-6 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-rose-700 text-sm">
                      This order was cancelled. If you have questions, please call our hotline.
                    </div>
                  )}

                  {/* Order Details & Items Breakdown */}
                  <div className="grid gap-6 md:grid-cols-2 pt-2">
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">
                        Ordered Items
                      </h4>
                      <div className="mt-3 space-y-2.5">
                        {selectedOrder.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/50 p-3 text-xs"
                          >
                            <div>
                              <p className="font-semibold text-foreground">
                                {item.quantity} × {item.name}
                              </p>
                              {item.selections && item.selections.length > 0 && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {item.selections.join(" · ")}
                                </p>
                              )}
                            </div>
                            <span className="font-mono font-bold text-foreground whitespace-nowrap">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-display text-sm font-bold text-foreground">
                          Delivery / Dining Info
                        </h4>
                        <div className="mt-3 rounded-xl border border-border/60 bg-background/50 p-3 text-xs space-y-1.5">
                          <p className="text-foreground">
                            <span className="font-semibold text-muted-foreground">Recipient:</span>{" "}
                            {selectedOrder.customerName}
                          </p>
                          <p className="text-foreground">
                            <span className="font-semibold text-muted-foreground">Phone:</span>{" "}
                            {selectedOrder.customerPhone}
                          </p>
                          <p className="text-foreground">
                            <span className="font-semibold text-muted-foreground">
                              Destination:
                            </span>{" "}
                            {selectedOrder.tableOrAddress}
                          </p>
                          {selectedOrder.landmark && (
                            <p className="text-muted-foreground text-[11px]">
                              Landmark: {selectedOrder.landmark}
                            </p>
                          )}
                          {selectedOrder.notes && (
                            <p className="text-amber-700 font-medium text-[11px] pt-1">
                              Special Instructions: "{selectedOrder.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Financial Bill Summary */}
                      <div className="rounded-xl border border-border/60 bg-background/50 p-3 text-xs space-y-1.5">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal:</span>
                          <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span>
                        </div>
                        {selectedOrder.deliveryFee > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Delivery Fee:</span>
                            <span className="font-mono">
                              {formatPrice(selectedOrder.deliveryFee)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.tax > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Taxes:</span>
                            <span className="font-mono">{formatPrice(selectedOrder.tax)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-bold text-foreground">
                          <span>Grand Total:</span>
                          <span className="font-mono text-primary">
                            {formatPrice(selectedOrder.total)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] pt-1 text-muted-foreground">
                          <span>Payment Method:</span>
                          <span className="font-semibold text-foreground">
                            {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Need Help Footer */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-6">
                    <div className="text-xs text-muted-foreground">
                      Need help or modifications with your order?
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
                        <a href={restaurant.phoneHref}>
                          <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" /> Call{" "}
                          {restaurant.phone}
                        </a>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-500 font-bold"
                      >
                        <a
                          href={`https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(
                            `Hi Hungry Hub! I'd like to check on my order ${selectedOrder.orderNumber}.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp Inquiry
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
