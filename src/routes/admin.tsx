import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDownUp,
  ArrowUpRight,
  BadgePercent,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Edit3,
  ExternalLink,
  Flame,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Unlock,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminStore,
  type AdminOrder,
  type OrderStatus,
  type OrderType,
  type PaymentMethod,
} from "@/lib/admin-store";
import { categories, type CategoryId, type MenuItem } from "@/data/menu";
import { formatPrice } from "@/data/restaurant";
import { LogoMark } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & POS Portal — Hungry Hub Rajpura" },
      {
        name: "description",
        content: "Hungry Hub live kitchen, POS billing, orders and menu management dashboard.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabKey = "dashboard" | "orders" | "menu" | "offers" | "settings" | "reviews" | "security";

function AdminPage() {
  const store = useAdminStore();
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Modals
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<{
    id?: string;
    badge: string;
    title: string;
    detail: string;
    note: string;
    active: boolean;
  } | null>(null);

  // Filters
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>("all");

  // New POS Order State
  const [posCustomerName, setPosCustomerName] = useState("");
  const [posCustomerPhone, setPosCustomerPhone] = useState("");
  const [posOrderType, setPosOrderType] = useState<OrderType>("Dine-in");
  const [posTableOrAddress, setPosTableOrAddress] = useState("Table 1");
  const [posPaymentMethod, setPosPaymentMethod] = useState<PaymentMethod>("Cash");
  const [posNotes, setPosNotes] = useState("");
  const [posLines, setPosLines] = useState<
    { id: string; name: string; quantity: number; unitPrice: number; selections?: string[] }[]
  >([]);

  // Dish Form State
  const [dishName, setDishName] = useState("");
  const [dishCategory, setDishCategory] = useState<CategoryId>("pizza");
  const [dishGroup, setDishGroup] = useState("Specials");
  const [dishDesc, setDishDesc] = useState("");
  const [dishPrice, setDishPrice] = useState("199");
  const [dishIsVeg, setDishIsVeg] = useState(true);
  const [dishIsSpicy, setDishIsSpicy] = useState(false);
  const [dishIsBestseller, setDishIsBestseller] = useState(false);
  const [dishAvailable, setDishAvailable] = useState(true);

  // Store Settings Form State
  const [storePhone, setStorePhone] = useState(store.settings.phone);
  const [storeWhatsapp, setStoreWhatsapp] = useState(store.settings.whatsappNumber);
  const [storeHours, setStoreHours] = useState(store.settings.hours);
  const [storeTax, setStoreTax] = useState(store.settings.taxPercent.toString());
  const [storeDeliveryFee, setStoreDeliveryFee] = useState(store.settings.deliveryFee.toString());
  const [storeFreeDelivery, setStoreFreeDelivery] = useState(
    store.settings.freeDeliveryAbove.toString(),
  );
  const [storeAddressLine, setStoreAddressLine] = useState(store.settings.address.line1);

  // PIN change state
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const handleLogin = (pinToTest?: string) => {
    const pin = pinToTest ?? pinInput;
    if (store.login(pin)) {
      setPinError(false);
      setPinInput("");
      toast.success("Welcome back to Hungry Hub Admin!");
    } else {
      setPinError(true);
      toast.error("Incorrect PIN. Default PIN is 1234.");
    }
  };

  const handleQuickDemoLogin = () => {
    store.login("1234");
    toast.success("Logged in with default Demo PIN (1234)");
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return store.orders.filter((ord) => {
      if (orderFilter !== "all" && ord.status.toLowerCase() !== orderFilter.toLowerCase())
        return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matches =
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.customerName.toLowerCase().includes(q) ||
          ord.customerPhone.includes(q) ||
          ord.tableOrAddress.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [store.orders, orderFilter, orderSearch]);

  // Filtered Menu Items
  const filteredMenu = useMemo(() => {
    return store.menuItems.filter((item) => {
      if (menuCategoryFilter !== "all" && item.category !== menuCategoryFilter) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [store.menuItems, menuCategoryFilter, menuSearch]);

  // Handle Create POS Order
  const handleCreatePosOrder = () => {
    if (!posCustomerName.trim()) {
      toast.error("Please enter a customer name or Table #");
      return;
    }
    if (posLines.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    const subtotal = posLines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
    const tax = store.settings.taxPercent > 0 ? (subtotal * store.settings.taxPercent) / 100 : 0;
    const deliveryFee = posOrderType === "Delivery" ? store.settings.deliveryFee : 0;
    const total = subtotal + tax + deliveryFee;

    const newOrd = store.addOrder({
      customerName: posCustomerName.trim(),
      customerPhone: posCustomerPhone.trim() || "Walk-in",
      orderType: posOrderType,
      tableOrAddress: posTableOrAddress.trim(),
      items: posLines,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: "New",
      paymentMethod: posPaymentMethod,
      paymentStatus: posPaymentMethod === "Cash" || posPaymentMethod === "UPI" ? "Paid" : "Pending",
      notes: posNotes,
    });

    toast.success(`Order ${newOrd.orderNumber} created successfully!`);
    setNewOrderModalOpen(false);
    setPosCustomerName("");
    setPosCustomerPhone("");
    setPosLines([]);
    setPosNotes("");
    setActiveTab("orders");
  };

  // Add item to POS line
  const handleAddPosItem = (item: MenuItem) => {
    const price = item.options[0]?.price || 150;
    const existingIndex = posLines.findIndex((l) => l.id === item.id);
    if (existingIndex > -1 && posLines[existingIndex]) {
      const copy = [...posLines];
      const target = copy[existingIndex];
      if (target) {
        target.quantity += 1;
        setPosLines(copy);
      }
    } else {
      setPosLines([
        ...posLines,
        {
          id: item.id,
          name: item.name,
          quantity: 1,
          unitPrice: price,
          selections: item.options[0]?.label ? [item.options[0].label] : [],
        },
      ]);
    }
    toast.success(`Added ${item.name}`);
  };

  // Open Dish Edit Modal
  const openEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishCategory(dish.category);
    setDishGroup(dish.group);
    setDishDesc(dish.description || "");
    setDishPrice((dish.options[0]?.price || 150).toString());
    setDishIsVeg(dish.vegetarian);
    setDishIsSpicy(!!dish.spicy);
    setDishIsBestseller(!!dish.bestseller);
    setDishAvailable(dish.available);
    setDishModalOpen(true);
  };

  const openNewDishModal = () => {
    setEditingDish(null);
    setDishName("");
    setDishCategory("pizza");
    setDishGroup("Chef Special");
    setDishDesc("");
    setDishPrice("199");
    setDishIsVeg(true);
    setDishIsSpicy(false);
    setDishIsBestseller(false);
    setDishAvailable(true);
    setDishModalOpen(true);
  };

  const handleSaveDish = () => {
    if (!dishName.trim()) {
      toast.error("Please enter a dish name");
      return;
    }
    const priceNum = parseFloat(dishPrice) || 99;

    if (editingDish) {
      store.updateMenuItem(editingDish.id, {
        name: dishName.trim(),
        category: dishCategory,
        group: dishGroup.trim(),
        description: dishDesc.trim() || undefined,
        options: [{ label: "Standard", price: priceNum }],
        vegetarian: dishIsVeg,
        spicy: dishIsSpicy,
        bestseller: dishIsBestseller,
        available: dishAvailable,
      });
      toast.success(`Updated "${dishName}"`);
    } else {
      const fallbackImg = categories[0]?.image ?? "";
      const newDish: MenuItem = {
        id: `custom-${Date.now()}`,
        name: dishName.trim(),
        category: dishCategory,
        group: dishGroup.trim(),
        description: dishDesc.trim() || undefined,
        image: categories.find((c) => c.id === dishCategory)?.image || fallbackImg,
        options: [{ label: "Standard", price: priceNum }],
        vegetarian: dishIsVeg,
        spicy: dishIsSpicy,
        bestseller: dishIsBestseller,
        isNew: true,
        available: dishAvailable,
      };
      store.addMenuItem(newDish);
      toast.success(`Added new dish "${dishName}"`);
    }
    setDishModalOpen(false);
  };

  // Status Badge Colors
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "New":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold animate-pulse">
            New 🔔
          </Badge>
        );
      case "Preparing":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Kitchen 👨‍🍳</Badge>
        );
      case "Ready":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            Ready 🛎️
          </Badge>
        );
      case "Out for Delivery":
        return (
          <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Out 🛵</Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-muted-foreground/30 text-foreground font-semibold">
            Completed ✅
          </Badge>
        );
      case "Cancelled":
        return <Badge variant="destructive">Cancelled ❌</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!store.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <LogoMark className="w-10 h-10" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
              Hungry Hub Admin
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Kitchen POS & Restaurant Management Portal
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-slate-400">
                Enter 4-Digit Owner / Staff PIN
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="• • • •"
                  className={cn(
                    "text-center text-2xl tracking-widest font-mono bg-slate-950/60 border-slate-700 h-14 text-white focus:ring-emerald-500",
                    pinError && "border-rose-500 text-rose-400 focus:ring-rose-500",
                  )}
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Try default: 1234
                </p>
              )}
            </div>

            {/* Quick Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (btn === "C") setPinInput("");
                    else if (btn === "OK") handleLogin();
                    else setPinInput((prev) => (prev.length < 6 ? prev + btn : prev));
                  }}
                  className={cn(
                    "h-12 rounded-xl text-lg font-bold font-mono transition-all active:scale-95",
                    btn === "OK"
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : btn === "C"
                        ? "bg-rose-950/50 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40"
                        : "bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50",
                  )}
                >
                  {btn}
                </button>
              ))}
            </div>

            <Button
              onClick={() => handleLogin()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-lg mt-2"
            >
              <Unlock className="w-4 h-4 mr-2" /> Unlock Dashboard
            </Button>

            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickDemoLogin}
                className="w-full bg-slate-800/40 hover:bg-slate-800 text-slate-300 border-slate-700 text-xs font-semibold rounded-xl"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Quick Demo Login (Default
                PIN: 1234)
              </Button>

              <Link
                to="/"
                className="text-xs text-center text-slate-500 hover:text-emerald-400 transition-colors mt-2"
              >
                ← Return to Public Customer Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 shadow-md">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <LogoMark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white">HUNGRY HUB</span>
                <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px] uppercase font-bold tracking-wider">
                  Admin & POS
                </Badge>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Kitchen Active · Open 24 Hours
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              onClick={() => setNewOrderModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> + New POS Order
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={openNewDishModal}
              className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl hidden md:inline-flex"
            >
              <UtensilsCrossed className="w-4 h-4 mr-1.5 text-amber-400" /> + Add Dish
            </Button>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors"
            >
              Store <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                store.logout();
                toast.info("Logged out of admin panel");
              }}
              className="h-9 w-9 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl"
              title="Lock / Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mx-auto max-w-7xl mt-3 flex gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/60 pt-2 text-xs font-semibold">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            {
              id: "orders",
              label: `Live Orders (${store.stats.activeOrders})`,
              icon: ShoppingBag,
              badge: store.stats.newOrders > 0 ? store.stats.newOrders : undefined,
            },
            {
              id: "menu",
              label: `Menu Manager (${store.stats.totalMenuItems})`,
              icon: UtensilsCrossed,
            },
            { id: "offers", label: "Offers & Promos", icon: BadgePercent },
            { id: "settings", label: "Store Settings", icon: Settings },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "security", label: "PIN & Security", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer",
                  isActive
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Today's Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-white">
                  {formatPrice(store.stats.todaySales)}
                </p>
                <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Active Kitchen Orders</span>
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-white">
                  {store.stats.activeOrders}
                </p>
                <p className="mt-1 text-xs text-amber-400 font-medium">
                  {store.stats.newOrders} pending review
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Menu Dishes Active</span>
                  <UtensilsCrossed className="w-4 h-4 text-sky-400" />
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-white">
                  {store.stats.availableItems}{" "}
                  <span className="text-sm text-slate-500 font-normal">
                    / {store.stats.totalMenuItems}
                  </span>
                </p>
                <p className="mt-1 text-xs text-sky-400 font-medium">9 Categories Active</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Rating & Reviews</span>
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-white">4.6 ★</p>
                <p className="mt-1 text-xs text-yellow-400 font-medium">
                  41 Verified Google Reviews
                </p>
              </div>
            </div>

            {/* Quick Live Kitchen Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Kitchen Queue & Active Orders
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time tickets currently in prep or waiting for dispatch
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("orders")}
                    className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-xl"
                  >
                    View All Orders ({store.orders.length}) →
                  </Button>
                </div>
              </div>

              {store.orders.filter((o) => ["New", "Preparing", "Ready"].includes(o.status))
                .length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No pending kitchen orders right now. Click "+ New POS Order" to record walk-in
                  bills.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {store.orders
                    .filter((o) => ["New", "Preparing", "Ready"].includes(o.status))
                    .map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono font-bold text-sm text-emerald-400">
                                {ord.orderNumber}
                              </span>
                              <p className="text-xs font-semibold text-white mt-0.5">
                                {ord.customerName} ({ord.orderType})
                              </p>
                              <p className="text-[11px] text-slate-400">{ord.tableOrAddress}</p>
                            </div>
                            {getStatusBadge(ord.status)}
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
                            {ord.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-xs text-slate-300"
                              >
                                <span>
                                  {it.quantity}x {it.name}
                                </span>
                                <span className="font-mono text-slate-400">
                                  {formatPrice(it.unitPrice * it.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="font-bold text-sm font-mono text-white">
                            {formatPrice(ord.total)}
                          </span>

                          <div className="flex gap-1.5">
                            {ord.status === "New" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  store.updateOrderStatus(ord.id, "Preparing");
                                  toast.success(`Order ${ord.orderNumber} sent to Kitchen`);
                                }}
                                className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-500 font-bold rounded-lg"
                              >
                                Accept 👨‍🍳
                              </Button>
                            )}
                            {ord.status === "Preparing" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  store.updateOrderStatus(ord.id, "Ready");
                                  toast.success(`Order ${ord.orderNumber} marked Ready`);
                                }}
                                className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-500 font-bold rounded-lg"
                              >
                                Ready 🛎️
                              </Button>
                            )}
                            {ord.status === "Ready" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  store.updateOrderStatus(ord.id, "Completed");
                                  toast.success(`Order ${ord.orderNumber} marked Completed`);
                                }}
                                className="h-7 px-2 text-xs bg-slate-700 hover:bg-slate-600 font-bold rounded-lg"
                              >
                                Finish ✅
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setOrderModalOpen(true);
                              }}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Store Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-base text-white">Quick Actions</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewOrderModalOpen(true)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 text-left transition-all group"
                  >
                    <ShoppingBag className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-sm text-white">Create POS Order</p>
                    <p className="text-xs text-slate-400">Generate bill for walk-in/table</p>
                  </button>

                  <button
                    onClick={openNewDishModal}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 text-left transition-all group"
                  >
                    <UtensilsCrossed className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-sm text-white">Add New Dish</p>
                    <p className="text-xs text-slate-400">Add pizza, momos, burger, shake</p>
                  </button>

                  <button
                    onClick={() => setActiveTab("offers")}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/40 text-left transition-all group"
                  >
                    <Tag className="w-6 h-6 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-sm text-white">Manage Coupons</p>
                    <p className="text-xs text-slate-400">Configure BOGO & promos</p>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/40 text-left transition-all group"
                  >
                    <Settings className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-sm text-white">Store Operating Info</p>
                    <p className="text-xs text-slate-400">Hours, taxes, WhatsApp line</p>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Hungry Hub Live Status
                  </h3>
                  <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Store Hours:</span>
                      <span className="font-semibold text-emerald-400">
                        Open 24 Hours (Always Active)
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">WhatsApp Ordering:</span>
                      <span className="font-mono text-white">+{store.settings.whatsappNumber}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Delivery Contact:</span>
                      <span className="text-white">{store.settings.deliveryPhones.join(", ")}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-white">
                        {store.settings.address.line1}, {store.settings.address.city}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Active GST / Tax:</span>
                      <span className="text-white">{store.settings.taxPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-500">HungryHub POS v2.4</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      store.resetOrders();
                      toast.success("Demo orders reset to initial test state");
                    }}
                    className="text-xs text-slate-400 hover:text-white h-8"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Reload Sample Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LIVE ORDERS & POS TICKETS */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  "all",
                  "new",
                  "preparing",
                  "ready",
                  "out for delivery",
                  "completed",
                  "cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer",
                      orderFilter === status
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-800 text-slate-400 hover:text-white",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search Order #, customer, phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-9 h-9 bg-slate-950 border-slate-700 text-xs w-48 sm:w-56"
                  />
                </div>
                {store.orders.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to remove all orders from the admin panel?")
                      ) {
                        store.clearAllOrders();
                        toast.success("All orders cleared from admin panel");
                      }
                    }}
                    className="border-rose-800/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-semibold h-9 text-xs rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-400" /> Clear All Orders
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setNewOrderModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 text-xs rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> + Create POS Order
                </Button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-950/60">
                  <TableRow className="border-slate-800 hover:bg-transparent text-slate-400 text-xs uppercase">
                    <TableHead className="w-24">Order #</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type / Dest</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-16 text-slate-400 text-sm">
                        <div className="max-w-xs mx-auto space-y-2">
                          <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="font-semibold text-white">No Orders in System</p>
                          <p className="text-xs text-slate-500">
                            New customer orders and POS bills will appear here in real time.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((ord) => (
                      <TableRow
                        key={ord.id}
                        className="border-slate-800/60 hover:bg-slate-800/40 text-sm"
                      >
                        <TableCell className="font-mono font-bold text-emerald-400">
                          {ord.orderNumber}
                        </TableCell>
                        <TableCell className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-white">{ord.customerName}</div>
                          <div className="text-xs text-slate-400 font-mono">
                            {ord.customerPhone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-700 bg-slate-800/40 text-slate-300"
                          >
                            {ord.orderType}
                          </Badge>
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                            {ord.tableOrAddress}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-300 max-w-xs truncate">
                            {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {ord.items.reduce((acc, i) => acc + i.quantity, 0)} total items
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-white whitespace-nowrap">
                          {formatPrice(ord.total)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-md font-semibold",
                              ord.paymentStatus === "Paid"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-amber-950 text-amber-400 border border-amber-800",
                            )}
                          >
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(ord.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast status buttons */}
                            {ord.status === "New" && (
                              <Button
                                size="sm"
                                onClick={() => store.updateOrderStatus(ord.id, "Preparing")}
                                className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-500 rounded-lg"
                              >
                                Prep 👨‍🍳
                              </Button>
                            )}
                            {ord.status === "Preparing" && (
                              <Button
                                size="sm"
                                onClick={() => store.updateOrderStatus(ord.id, "Ready")}
                                className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                              >
                                Ready 🛎️
                              </Button>
                            )}
                            {ord.status === "Ready" && (
                              <Button
                                size="sm"
                                onClick={() => store.updateOrderStatus(ord.id, "Completed")}
                                className="h-7 px-2 text-xs bg-slate-700 hover:bg-slate-600 rounded-lg"
                              >
                                Finish ✅
                              </Button>
                            )}

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setOrderModalOpen(true);
                              }}
                              className="h-8 w-8 text-slate-400 hover:text-white"
                              title="Print KOT / View Details"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                if (confirm(`Cancel and delete order ${ord.orderNumber}?`)) {
                                  store.deleteOrder(ord.id);
                                  toast.info(`Order ${ord.orderNumber} deleted`);
                                }
                              }}
                              className="h-8 w-8 text-slate-500 hover:text-rose-400"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MENU MANAGER & INVENTORY */}
        {/* ========================================================= */}
        {activeTab === "menu" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setMenuCategoryFilter("all")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer",
                    menuCategoryFilter === "all"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-800 text-slate-400 hover:text-white",
                  )}
                >
                  All Items ({store.menuItems.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMenuCategoryFilter(cat.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer",
                      menuCategoryFilter === cat.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-800 text-slate-400 hover:text-white",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search dishes or ingredients..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="pl-9 h-9 bg-slate-950 border-slate-700 text-xs w-56 sm:w-64"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={openNewDishModal}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 text-xs rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> + Add Dish
                </Button>
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMenu.map((dish) => (
                <div
                  key={dish.id}
                  className={cn(
                    "bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between transition-all",
                    dish.available
                      ? "border-slate-800 hover:border-slate-700"
                      : "border-rose-900/40 opacity-60 bg-slate-950",
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-3 h-3 rounded-full border flex items-center justify-center text-[8px]",
                            dish.vegetarian
                              ? "border-emerald-500 text-emerald-500"
                              : "border-rose-500 text-rose-500",
                          )}
                          title={dish.vegetarian ? "Vegetarian" : "Non-Vegetarian"}
                        >
                          ●
                        </span>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{dish.name}</h4>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase border-slate-700 text-slate-400"
                      >
                        {dish.category}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {dish.description || dish.group}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {dish.options.map((opt, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-950 text-slate-300 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-800"
                        >
                          {opt.label ? `${opt.label}: ` : ""}
                          {formatPrice(opt.price)}
                        </span>
                      ))}
                      {dish.bestseller && (
                        <span className="bg-amber-950/80 text-amber-400 border border-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={dish.available}
                        onCheckedChange={() => {
                          store.toggleItemAvailability(dish.id);
                          toast.info(
                            `Toggled "${dish.name}" ${dish.available ? "Out of Stock" : "In Stock"}`,
                          );
                        }}
                      />
                      <span className="text-xs text-slate-400">
                        {dish.available ? "In Stock" : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDish(dish)}
                        className="h-7 w-7 text-slate-400 hover:text-emerald-400"
                        title="Edit Dish"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Remove "${dish.name}" from the menu?`)) {
                            store.deleteMenuItem(dish.id);
                            toast.info(`Deleted "${dish.name}"`);
                          }
                        }}
                        className="h-7 w-7 text-slate-500 hover:text-rose-400"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: OFFERS & PROMOS */}
        {/* ========================================================= */}
        {activeTab === "offers" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-3xl">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Active Promotional Deals
                </h3>
                <p className="text-xs text-slate-400">
                  Manage coupons, BOGO deals, and website discount banners
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingOffer({
                    id: `offer-${Date.now()}`,
                    badge: "Special Deal",
                    title: "Special Food Lounge Offer",
                    detail: "Available on select menu orders",
                    note: "Please announce coupon at time of order.",
                    active: true,
                  });
                  setOfferModalOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 text-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> + Add Offer
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {store.offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-3xl relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold">
                      {offer.badge}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <Switch
                        checked={offer.active}
                        onCheckedChange={() => {
                          store.updateOffer(offer.id, { active: !offer.active });
                          toast.info(`Offer ${offer.active ? "disabled" : "activated"}`);
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          store.deleteOffer(offer.id);
                          toast.info("Offer deleted");
                        }}
                        className="h-7 w-7 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <h4 className="mt-3 font-display font-bold text-lg text-white">{offer.title}</h4>
                  <p className="mt-1 text-sm text-slate-300">{offer.detail}</p>
                  <p className="mt-2 text-xs text-amber-400/80 italic font-mono">{offer.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: STORE SETTINGS */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Restaurant Profile & Contact Info
                </h3>
                <p className="text-xs text-slate-400">
                  Configure phone lines, WhatsApp integration, and operating hours
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-400 uppercase">Primary Phone Number</Label>
                  <Input
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="mt-1 bg-slate-950 border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400 uppercase">
                    WhatsApp Ordering Line (Numeric with country code)
                  </Label>
                  <Input
                    value={storeWhatsapp}
                    onChange={(e) => setStoreWhatsapp(e.target.value)}
                    className="mt-1 bg-slate-950 border-slate-700 text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400 uppercase">Operating Hours</Label>
                  <Input
                    value={storeHours}
                    onChange={(e) => setStoreHours(e.target.value)}
                    className="mt-1 bg-slate-950 border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400 uppercase">Store Address</Label>
                  <Input
                    value={storeAddressLine}
                    onChange={(e) => setStoreAddressLine(e.target.value)}
                    className="mt-1 bg-slate-950 border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="font-display font-bold text-base text-white">
                  Charges, Taxes & Delivery Thresholds
                </h4>
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label className="text-xs text-slate-400 uppercase">
                      GST / Tax Percentage (%)
                    </Label>
                    <Input
                      type="number"
                      value={storeTax}
                      onChange={(e) => setStoreTax(e.target.value)}
                      className="mt-1 bg-slate-950 border-slate-700 text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400 uppercase">
                      Default Delivery Fee (₹)
                    </Label>
                    <Input
                      type="number"
                      value={storeDeliveryFee}
                      onChange={(e) => setStoreDeliveryFee(e.target.value)}
                      className="mt-1 bg-slate-950 border-slate-700 text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400 uppercase">
                      Free Delivery Above (₹, 0 = disabled)
                    </Label>
                    <Input
                      type="number"
                      value={storeFreeDelivery}
                      onChange={(e) => setStoreFreeDelivery(e.target.value)}
                      className="mt-1 bg-slate-950 border-slate-700 text-white text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    store.resetSettings();
                    toast.info("Reset settings to default");
                  }}
                  className="border-slate-700 text-slate-300"
                >
                  Reset Defaults
                </Button>
                <Button
                  onClick={() => {
                    store.updateSettings({
                      phone: storePhone,
                      whatsappNumber: storeWhatsapp,
                      hours: storeHours,
                      taxPercent: parseFloat(storeTax) || 0,
                      deliveryFee: parseFloat(storeDeliveryFee) || 0,
                      freeDeliveryAbove: parseFloat(storeFreeDelivery) || 0,
                      address: {
                        ...store.settings.address,
                        line1: storeAddressLine,
                      },
                    });
                    toast.success("Restaurant settings updated successfully!");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Store Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: REVIEWS MODERATION */}
        {/* ========================================================= */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Google Reviews & Customer Testimonials
                </h3>
                <p className="text-xs text-slate-400">
                  Published ratings appearing on the public website
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {store.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{rev.name}</span>
                      <span className="text-amber-400 text-xs font-bold font-mono">
                        {"★".repeat(rev.rating)}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-1 text-[10px] border-slate-700 text-slate-400"
                    >
                      {rev.highlight}
                    </Badge>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                    <span>{rev.date}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        store.deleteReview(rev.id);
                        toast.info("Review removed");
                      }}
                      className="h-6 w-6 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: SECURITY & PIN */}
        {/* ========================================================= */}
        {activeTab === "security" && (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Admin Security & Owner Passcode
              </h3>
              <p className="text-xs text-slate-400">
                Update your 4-digit master PIN for admin access.
              </p>

              <div>
                <Label className="text-xs text-slate-400 uppercase">Current Master PIN</Label>
                <Input
                  type="password"
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="Current PIN (e.g. 1234)"
                  className="mt-1 bg-slate-950 border-slate-700 text-white font-mono text-center tracking-widest text-lg"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-400 uppercase">New Master PIN</Label>
                <Input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="New 4-digit PIN"
                  className="mt-1 bg-slate-950 border-slate-700 text-white font-mono text-center tracking-widest text-lg"
                />
              </div>

              <Button
                onClick={() => {
                  if (oldPin !== store.adminPin) {
                    toast.error("Current PIN does not match");
                    return;
                  }
                  if (newPin.length < 4) {
                    toast.error("New PIN must be at least 4 digits");
                    return;
                  }
                  store.changePin(newPin);
                  setOldPin("");
                  setNewPin("");
                  toast.success("Owner PIN updated successfully!");
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 rounded-xl"
              >
                Change Admin PIN
              </Button>
            </div>

            {/* Data Management & Wipe Panel */}
            <div className="bg-slate-900 border border-rose-950/60 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-white">
                  Data Management & Reset
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear all live orders, test bills, and local storage data to start with a fresh
                clean state.
              </p>

              <div className="pt-2 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm("Are you sure you want to clear all orders?")) {
                      store.clearAllOrders();
                      toast.success("All orders cleared from system");
                    }
                  }}
                  className="w-full border-rose-800/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 font-semibold text-xs h-10 rounded-xl"
                >
                  Clear All Live Orders
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (
                      confirm(
                        "This will wipe all custom orders, test promos, and reset the admin store to default clean state. Continue?",
                      )
                    ) {
                      store.wipeAllData();
                      toast.success("All store data reset and cleared successfully");
                    }
                  }}
                  className="w-full text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 h-9"
                >
                  Wipe & Reset Everything
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: NEW MANUAL POS WALK-IN ORDER */}
      {/* ========================================================= */}
      <Dialog open={newOrderModalOpen} onOpenChange={setNewOrderModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              Create New POS Order / Bill
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Generate instant bill for in-restaurant walk-in, table dining or phone delivery.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-400 uppercase">Customer Name / Table</Label>
                <Input
                  placeholder="e.g. Gurpreet Singh / Table 3"
                  value={posCustomerName}
                  onChange={(e) => setPosCustomerName(e.target.value)}
                  className="mt-1 bg-slate-950 border-slate-700 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400 uppercase">Phone Number</Label>
                <Input
                  placeholder="9876543210"
                  value={posCustomerPhone}
                  onChange={(e) => setPosCustomerPhone(e.target.value)}
                  className="mt-1 bg-slate-950 border-slate-700 text-white text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-slate-400 uppercase">Order Type</Label>
                <Select value={posOrderType} onValueChange={(v) => setPosOrderType(v as OrderType)}>
                  <SelectTrigger className="mt-1 bg-slate-950 border-slate-700 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="Dine-in">Dine-in (Table)</SelectItem>
                    <SelectItem value="Takeaway">Takeaway (Counter)</SelectItem>
                    <SelectItem value="Delivery">Home Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-slate-400 uppercase">Table / Destination</Label>
                <Input
                  placeholder="Table 2 or Sector 4"
                  value={posTableOrAddress}
                  onChange={(e) => setPosTableOrAddress(e.target.value)}
                  className="mt-1 bg-slate-950 border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-400 uppercase">Payment Mode</Label>
                <Select
                  value={posPaymentMethod}
                  onValueChange={(v) => setPosPaymentMethod(v as PaymentMethod)}
                >
                  <SelectTrigger className="mt-1 bg-slate-950 border-slate-700 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI (GooglePay/Paytm)</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Menu Dish Selector */}
            <div className="pt-2 border-t border-slate-800">
              <Label className="text-xs text-slate-400 uppercase">Quick Add Dishes to Bill</Label>
              <div className="mt-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                {store.menuItems.slice(0, 30).map((dish) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => handleAddPosItem(dish)}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700 border border-slate-700 rounded-lg text-slate-200 transition-colors cursor-pointer"
                  >
                    + {dish.name} ({formatPrice(dish.options[0]?.price || 150)})
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Items in POS */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-400 uppercase">
                Selected Items ({posLines.length})
              </Label>
              {posLines.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  Click items above to add to this order.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {posLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-900"
                    >
                      <span className="font-semibold text-white">{line.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400">
                          {formatPrice(line.unitPrice)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...posLines];
                              const target = copy[idx];
                              if (target && target.quantity > 1) {
                                target.quantity -= 1;
                                setPosLines(copy);
                              } else {
                                setPosLines(posLines.filter((_, i) => i !== idx));
                              }
                            }}
                            className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold w-4 text-center">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...posLines];
                              const target = copy[idx];
                              if (target) {
                                target.quantity += 1;
                                setPosLines(copy);
                              }
                            }}
                            className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 w-14 text-right">
                          {formatPrice(line.unitPrice * line.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total summary */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between font-bold text-sm">
              <span className="text-slate-300">Grand Total:</span>
              <span className="text-xl font-mono text-emerald-400">
                {formatPrice(posLines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0))}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewOrderModalOpen(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePosOrder}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              <Check className="w-4 h-4 mr-1.5" /> Print & Send to Kitchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: PRINTABLE KOT & RECEIPT */}
      {/* ========================================================= */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-white flex items-center justify-between">
              <span>Order Receipt / KOT</span>
              <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                {selectedOrder?.orderNumber}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-2 space-y-3 font-mono text-xs">
              {/* Receipt Body */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-center pb-2 border-b border-dashed border-slate-800">
                  <p className="font-bold text-sm text-white">HUNGRY HUB RAJPURA</p>
                  <p className="text-[10px] text-slate-400">MLA Road, Banwari Village, Neelpur</p>
                  <p className="text-[10px] text-slate-400">Phone: {store.settings.phone}</p>
                </div>

                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Order: {selectedOrder.orderNumber}</span>
                  <span className="text-slate-400">
                    {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-[11px]">
                  <p className="text-white font-bold">
                    {selectedOrder.customerName} ({selectedOrder.orderType})
                  </p>
                  <p className="text-slate-400">{selectedOrder.tableOrAddress}</p>
                  <p className="text-slate-400">Tel: {selectedOrder.customerPhone}</p>
                </div>

                <div className="py-2 border-y border-dashed border-slate-800 space-y-1">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-200">
                      <span>
                        {it.quantity}x {it.name}
                      </span>
                      <span className="text-right">{formatPrice(it.unitPrice * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.deliveryFee > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Delivery Fee:</span>
                      <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-emerald-400 pt-1 border-t border-slate-800">
                    <span>TOTAL:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 text-[10px]">
                    <span>Payment: {selectedOrder.paymentMethod}</span>
                    <span className="text-emerald-400 uppercase font-bold">
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                window.print();
              }}
              className="border-slate-700 bg-slate-800 text-slate-200"
            >
              <Printer className="w-4 h-4 mr-1.5" /> Print Receipt
            </Button>
            <Button
              onClick={() => setOrderModalOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 3: ADD / EDIT DISH */}
      {/* ========================================================= */}
      <Dialog open={dishModalOpen} onOpenChange={setDishModalOpen}>
        <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              {editingDish ? `Edit "${editingDish.name}"` : "Add New Menu Dish"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Configure name, category, pricing variants, and stock status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-slate-400 uppercase">Dish Name</Label>
              <Input
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Cheese Burst Special Farmhouse"
                className="mt-1 bg-slate-950 border-slate-700 text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-400 uppercase">Category</Label>
                <Select
                  value={dishCategory}
                  onValueChange={(v) => setDishCategory(v as CategoryId)}
                >
                  <SelectTrigger className="mt-1 bg-slate-950 border-slate-700 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-slate-400 uppercase">Price (₹)</Label>
                <Input
                  type="number"
                  value={dishPrice}
                  onChange={(e) => setDishPrice(e.target.value)}
                  className="mt-1 bg-slate-950 border-slate-700 text-white text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-400 uppercase">Menu Group / Section Tag</Label>
              <Input
                value={dishGroup}
                onChange={(e) => setDishGroup(e.target.value)}
                placeholder="e.g. Simply Veg, Italian Delight, Special Shake"
                className="mt-1 bg-slate-950 border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <Label className="text-xs text-slate-400 uppercase">Description / Ingredients</Label>
              <Textarea
                value={dishDesc}
                onChange={(e) => setDishDesc(e.target.value)}
                placeholder="Crispy fresh base with mozzarella, black olives, sweet corn and spicy herbs..."
                className="mt-1 bg-slate-950 border-slate-700 text-white text-xs h-20"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <Switch checked={dishIsVeg} onCheckedChange={setDishIsVeg} />
                <span>Veg 🌱</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <Switch checked={dishIsSpicy} onCheckedChange={setDishIsSpicy} />
                <span>Spicy 🌶️</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <Switch checked={dishIsBestseller} onCheckedChange={setDishIsBestseller} />
                <span>Bestseller ⭐</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <Switch checked={dishAvailable} onCheckedChange={setDishAvailable} />
                <span>In Stock 🟢</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDishModalOpen(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDish}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Save Dish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
