import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Lock, Menu, Package, Phone, ShoppingBag, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/site/Logo";
import { navLinks, restaurant } from "@/data/restaurant";
import { useCart } from "@/lib/cart";
import { useCustomerOrders } from "@/lib/customer-orders";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();
  const { orders } = useCustomerOrders();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isHome = pathname === "/";
  const isSolid = !isHome || scrolled || menuOpen;

  const activeLiveOrdersCount = orders.filter((o) =>
    ["New", "Preparing", "Ready", "Out for Delivery"].includes(o.status),
  ).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid
          ? "border-b border-border/70 bg-cream/95 backdrop-blur-md hh-shadow shadow-xs"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          aria-label={`${restaurant.fullName} home`}
          className="shrink-0 transition-transform duration-200 hover:scale-103 mr-1"
        >
          <Wordmark
            className={cn(
              "transition-colors",
              isSolid ? "text-foreground" : "text-primary-foreground",
            )}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isOrders = link.to === "/orders";
            return (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-2.5 xl:px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200",
                  isSolid
                    ? "text-foreground/80 hover:text-foreground hover:bg-black/5"
                    : "text-white/85 hover:text-white hover:bg-white/10",
                )}
                activeProps={{
                  className: isSolid
                    ? "text-foreground font-bold bg-black/5"
                    : "text-amber-300 font-bold bg-white/15",
                }}
              >
                <span className="flex items-center gap-1">
                  {link.label}
                  {isOrders && activeLiveOrdersCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.2 text-[0.6rem] font-bold text-white shadow-xs animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
                      {activeLiveOrdersCount}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side Utility Group */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto lg:ml-0">
          {/* Phone Quick Call */}
          <a
            href={restaurant.phoneHref}
            className={cn(
              "hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 2xl:flex",
              isSolid
                ? "text-foreground/85 hover:text-foreground"
                : "text-white/90 hover:text-amber-300",
            )}
          >
            <Phone className="h-3.5 w-3.5 text-amber-400" />
            <span className="whitespace-nowrap">{restaurant.phone}</span>
          </a>

          {/* Shopping Cart Trigger with 3D effect */}
          <button
            type="button"
            aria-label={`Open cart, ${cart.count} items`}
            onClick={() => cart.setOpen(true)}
            className={cn(
              "relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-150 active:translate-y-1 cursor-pointer",
              isSolid
                ? "border border-border/80 bg-card text-foreground shadow-[0_3px_0_var(--border),0_5px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_4px_0_var(--border),0_8px_14px_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_var(--border)]"
                : "border border-white/30 bg-white/15 text-white backdrop-blur-md shadow-[0_3px_0_rgba(0,0,0,0.4),0_6px_14px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 hover:bg-white/25 active:shadow-[0_1px_0_rgba(0,0,0,0.4)]",
            )}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cart.count > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[0.65rem] font-black text-stone-950 shadow-md animate-bounce-subtle border border-amber-300">
                {cart.count}
              </span>
            ) : null}
          </button>

          {/* Attractive 3D ORDER NOW Hero Action Button */}
          <Button
            asChild
            variant="gold"
            size="sm"
            className="hidden sm:inline-flex shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-xs font-black tracking-wider uppercase btn-3d-gold btn-shimmer-sweep"
          >
            <Link to="/menu">
              <Sparkles className="h-3.5 w-3.5 mr-1 shrink-0" />
              Order Now
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all lg:hidden cursor-pointer active:translate-y-1 duration-150",
              isSolid
                ? "text-foreground hover:bg-secondary border border-border shadow-[0_2px_0_var(--border)] active:shadow-none"
                : "text-white hover:bg-white/15 border border-white/30 shadow-[0_2px_0_rgba(0,0,0,0.3)] active:shadow-none",
            )}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen ? (
        <div className="border-t border-border bg-cream/98 px-4 pt-3 pb-6 shadow-2xl backdrop-blur-xl lg:hidden max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col py-2 space-y-1.5" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                activeOptions={{ exact: link.to === "/" }}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold tracking-wide uppercase transition-all hover:bg-secondary active:scale-98"
                activeProps={{
                  className:
                    "text-primary bg-secondary font-extrabold shadow-xs ring-1 ring-primary/20",
                }}
              >
                <span>{link.label}</span>
                {link.to === "/orders" && activeLiveOrdersCount > 0 && (
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[0.65rem] font-bold text-white animate-pulse">
                    {activeLiveOrdersCount} Live Order{activeLiveOrdersCount > 1 ? "s" : ""}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2.5 pt-3 border-t border-border/70">
            <Button
              asChild
              size="lg"
              variant="gold"
              className="rounded-full font-black uppercase btn-3d-gold btn-shimmer-sweep"
              onClick={() => setMenuOpen(false)}
            >
              <Link to="/menu">Order Food Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full font-bold border-border bg-card btn-3d-outline"
              onClick={() => setMenuOpen(false)}
            >
              <a href={restaurant.phoneHref}>
                <Phone className="h-4 w-4 mr-2 text-primary" /> Call {restaurant.phone}
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
