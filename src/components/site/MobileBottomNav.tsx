import { Link } from "@tanstack/react-router";
import { Home, Package, ShoppingBag, Tag, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useCustomerOrders } from "@/lib/customer-orders";

const itemClass =
  "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.65rem] font-bold tracking-wider uppercase text-foreground/70 transition-all duration-200 active:scale-90 cursor-pointer";

export function MobileBottomNav() {
  const cart = useCart();
  const { orders } = useCustomerOrders();

  const activeLiveOrdersCount = orders.filter((o) =>
    ["New", "Preparing", "Ready", "Out for Delivery"].includes(o.status),
  ).length;

  return (
    <nav
      aria-label="Quick mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-cream/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className={itemClass}
          activeProps={{ className: "text-primary scale-105 font-extrabold" }}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/menu"
          className={itemClass}
          activeProps={{ className: "text-primary scale-105 font-extrabold" }}
        >
          <UtensilsCrossed className="h-5 w-5" />
          <span>Menu</span>
        </Link>
        <Link
          to="/offers"
          className={itemClass}
          activeProps={{ className: "text-primary scale-105 font-extrabold" }}
        >
          <Tag className="h-5 w-5" />
          <span>Offers</span>
        </Link>
        <Link
          to="/orders"
          className={itemClass}
          activeProps={{ className: "text-primary scale-105 font-extrabold" }}
        >
          <span className="relative">
            <Package className="h-5 w-5" />
            {activeLiveOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-emerald-600 px-1 text-[0.55rem] font-bold text-white animate-pulse">
                {activeLiveOrdersCount}
              </span>
            )}
          </span>
          <span>Orders</span>
        </Link>
        <button type="button" onClick={() => cart.setOpen(true)} className={itemClass}>
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cart.count > 0 ? (
              <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-accent-foreground shadow-sm animate-bounce-subtle">
                {cart.count}
              </span>
            ) : null}
          </span>
          <span>Cart</span>
        </button>
      </div>
    </nav>
  );
}
