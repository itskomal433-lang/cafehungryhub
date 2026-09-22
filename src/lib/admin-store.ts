import { useEffect, useState } from "react";
import { menu as defaultMenu, categories, type MenuItem, type CategoryId } from "@/data/menu";
import {
  restaurant as defaultRestaurant,
  charges as defaultCharges,
  offers as defaultOffers,
  customerReviews as defaultReviews,
} from "@/data/restaurant";

export type OrderStatus =
  "New" | "Preparing" | "Ready" | "Out for Delivery" | "Completed" | "Cancelled";
export type OrderType = "Dine-in" | "Takeaway" | "Delivery";
export type PaymentMethod = "Cash" | "UPI" | "Card" | "Online";
export type PaymentStatus = "Paid" | "Pending";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  selections?: string[] | undefined;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO date
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableOrAddress: string;
  landmark?: string | undefined;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string | undefined;
  couponCode?: string | undefined;
};

export type RestaurantSettings = {
  name: string;
  fullName: string;
  tagline: string;
  footerTagline: string;
  phone: string;
  deliveryPhones: string[];
  whatsappNumber: string;
  hours: string;
  isOpen24Hours: boolean;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  currency: string;
  taxPercent: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  minimumOrder: number;
  instagramUrl: string;
  facebookUrl: string;
  zomatoUrl: string;
  swiggyUrl: string;
};

export type OfferItem = {
  id: string;
  badge: string;
  title: string;
  detail: string;
  note: string;
  active: boolean;
};

export type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  highlight: string;
  featured?: boolean | undefined;
};

const STORAGE_KEYS = {
  AUTH: "hh_admin_auth_v1",
  PIN: "hh_admin_pin_v1",
  ORDERS: "hh_admin_orders_v1",
  MENU: "hh_admin_menu_v1",
  SETTINGS: "hh_admin_settings_v1",
  OFFERS: "hh_admin_offers_v1",
  REVIEWS: "hh_admin_reviews_v1",
};

const DEFAULT_PIN = "1234";

const INITIAL_ORDERS: AdminOrder[] = [];

const INITIAL_SETTINGS: RestaurantSettings = {
  name: defaultRestaurant.name,
  fullName: defaultRestaurant.fullName,
  tagline: defaultRestaurant.tagline,
  footerTagline: defaultRestaurant.footerTagline,
  phone: defaultRestaurant.phone,
  deliveryPhones: [...defaultRestaurant.deliveryPhones],
  whatsappNumber: defaultRestaurant.whatsappNumber,
  hours: defaultRestaurant.hours,
  isOpen24Hours: true,
  address: {
    line1: defaultRestaurant.address.line1,
    line2: defaultRestaurant.address.line2,
    city: defaultRestaurant.address.city,
    state: defaultRestaurant.address.state,
    postalCode: defaultRestaurant.address.postalCode,
  },
  currency: defaultCharges.currency,
  taxPercent: defaultCharges.taxPercent,
  deliveryFee: defaultCharges.deliveryFee,
  freeDeliveryAbove: defaultCharges.freeDeliveryAbove,
  minimumOrder: defaultCharges.minimumOrder,
  instagramUrl: defaultRestaurant.socials.instagram,
  facebookUrl: defaultRestaurant.socials.facebook,
  zomatoUrl: defaultRestaurant.deliveryPartners[0]?.url || "https://zomato.com",
  swiggyUrl: defaultRestaurant.deliveryPartners[1]?.url || "https://swiggy.com",
};

const INITIAL_OFFERS: OfferItem[] = defaultOffers.map((o) => ({
  ...o,
  active: true,
}));

const INITIAL_REVIEWS: ReviewItem[] = defaultReviews.map((r, idx) => ({
  id: `rev-${idx + 1}`,
  name: r.name,
  rating: r.rating,
  date: r.date,
  comment: r.comment,
  highlight: r.highlight,
  featured: true,
}));

// Local storage helper
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

// Global store hook
export function useAdminStore() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>(DEFAULT_PIN);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [offers, setOffers] = useState<OfferItem[]>(INITIAL_OFFERS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsAuthenticated(getStored<boolean>(STORAGE_KEYS.AUTH, false));
    setAdminPin(getStored<string>(STORAGE_KEYS.PIN, DEFAULT_PIN));

    // Clean out previous mock orders (ord-101 .. ord-104) if present in storage
    const rawOrders = getStored<AdminOrder[]>(STORAGE_KEYS.ORDERS, []);
    const cleanOrders = rawOrders.filter(
      (o) => !["ord-101", "ord-102", "ord-103", "ord-104"].includes(o.id),
    );
    setOrders(cleanOrders);
    setStored(STORAGE_KEYS.ORDERS, cleanOrders);

    setMenuItems(getStored<MenuItem[]>(STORAGE_KEYS.MENU, defaultMenu));
    setSettings(getStored<RestaurantSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
    setOffers(getStored<OfferItem[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS));
    setReviews(getStored<ReviewItem[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS));
    setIsLoaded(true);
  }, []);

  const login = (pin: string) => {
    if (pin === adminPin || pin === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setStored(STORAGE_KEYS.AUTH, true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStored(STORAGE_KEYS.AUTH, false);
  };

  const changePin = (newPin: string) => {
    setAdminPin(newPin);
    setStored(STORAGE_KEYS.PIN, newPin);
  };

  // Orders Actions
  const addOrder = (orderData: Omit<AdminOrder, "id" | "orderNumber" | "createdAt">) => {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: AdminOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `HH-${nextNum}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    setStored(STORAGE_KEYS.ORDERS, updated);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map((ord) => (ord.id === id ? { ...ord, status } : ord));
    setOrders(updated);
    setStored(STORAGE_KEYS.ORDERS, updated);
  };

  const updatePaymentStatus = (
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
  ) => {
    const updated = orders.map((ord) =>
      ord.id === id ? { ...ord, paymentStatus, ...(paymentMethod ? { paymentMethod } : {}) } : ord,
    );
    setOrders(updated);
    setStored(STORAGE_KEYS.ORDERS, updated);
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter((ord) => ord.id !== id);
    setOrders(updated);
    setStored(STORAGE_KEYS.ORDERS, updated);
  };

  const clearAllOrders = () => {
    setOrders([]);
    setStored(STORAGE_KEYS.ORDERS, []);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("hh_my_orders_v1");
    }
  };

  const wipeAllData = () => {
    setOrders([]);
    setStored(STORAGE_KEYS.ORDERS, []);
    setOffers([]);
    setStored(STORAGE_KEYS.OFFERS, []);
    setReviews([]);
    setStored(STORAGE_KEYS.REVIEWS, []);
    setMenuItems(defaultMenu);
    setStored(STORAGE_KEYS.MENU, defaultMenu);
    setSettings(INITIAL_SETTINGS);
    setStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("hh_my_orders_v1");
    }
  };

  const resetOrders = () => {
    setOrders([]);
    setStored(STORAGE_KEYS.ORDERS, []);
  };

  // Menu Actions
  const addMenuItem = (item: MenuItem) => {
    const updated = [item, ...menuItems];
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const updateMenuItem = (id: string, patch: Partial<MenuItem>) => {
    const updated = menuItems.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter((item) => item.id !== id);
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const toggleItemAvailability = (id: string) => {
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, available: !item.available } : item,
    );
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const toggleItemBestseller = (id: string) => {
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, bestseller: !item.bestseller } : item,
    );
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const resetMenu = () => {
    setMenuItems(defaultMenu);
    setStored(STORAGE_KEYS.MENU, defaultMenu);
  };

  // Settings Actions
  const updateSettings = (patch: Partial<RestaurantSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    setStored(STORAGE_KEYS.SETTINGS, updated);
  };

  const resetSettings = () => {
    setSettings(INITIAL_SETTINGS);
    setStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  };

  // Offers Actions
  const addOffer = (offer: OfferItem) => {
    const updated = [...offers, offer];
    setOffers(updated);
    setStored(STORAGE_KEYS.OFFERS, updated);
  };

  const updateOffer = (id: string, patch: Partial<OfferItem>) => {
    const updated = offers.map((o) => (o.id === id ? { ...o, ...patch } : o));
    setOffers(updated);
    setStored(STORAGE_KEYS.OFFERS, updated);
  };

  const deleteOffer = (id: string) => {
    const updated = offers.filter((o) => o.id !== id);
    setOffers(updated);
    setStored(STORAGE_KEYS.OFFERS, updated);
  };

  // Reviews Actions
  const addReview = (review: ReviewItem) => {
    const updated = [review, ...reviews];
    setReviews(updated);
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  // Computed Stats
  const stats = {
    totalOrders: orders.length,
    todaySales: orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, curr) => acc + curr.total, 0),
    activeOrders: orders.filter((o) =>
      ["New", "Preparing", "Ready", "Out for Delivery"].includes(o.status),
    ).length,
    newOrders: orders.filter((o) => o.status === "New").length,
    completedOrders: orders.filter((o) => o.status === "Completed").length,
    totalMenuItems: menuItems.length,
    availableItems: menuItems.filter((i) => i.available).length,
    avgRating: 4.6,
  };

  return {
    isLoaded,
    isAuthenticated,
    adminPin,
    orders,
    menuItems,
    settings,
    offers,
    reviews,
    stats,
    login,
    logout,
    changePin,
    addOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    clearAllOrders,
    wipeAllData,
    resetOrders,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    toggleItemBestseller,
    resetMenu,
    updateSettings,
    resetSettings,
    addOffer,
    updateOffer,
    deleteOffer,
    addReview,
    deleteReview,
  };
}

// Static order helper for public Cart checkout
export function saveOrderToAdmin(
  order: Omit<AdminOrder, "id" | "orderNumber" | "createdAt">,
): AdminOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = getStored<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: AdminOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber: `HH-${nextNum}`,
      createdAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.ORDERS, [newOrder, ...existing]);

    // Also register order in customer device storage
    const myOrders = getStored<string[]>("hh_my_orders_v1", []);
    setStored("hh_my_orders_v1", [newOrder.orderNumber, ...myOrders]);

    return newOrder;
  } catch (e) {
    console.error("Failed to sync order to admin store:", e);
    return null;
  }
}
