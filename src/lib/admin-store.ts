import { useEffect, useState, useCallback } from "react";
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

export type SecurityLogEntry = {
  id: string;
  timestamp: string;
  event: string;
  status: "success" | "warning" | "error" | "info";
  details?: string;
};

export type AuthSession = {
  token: string;
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
};

const STORAGE_KEYS = {
  AUTH_SESSION: "hh_admin_session_v2",
  PASSWORD_HASH: "hh_admin_pwd_hash_v2",
  SECURITY_META: "hh_admin_sec_meta_v2",
  SECURITY_LOGS: "hh_admin_sec_logs_v2",
  ORDERS: "hh_admin_orders_v1",
  MENU: "hh_admin_menu_v1",
  SETTINGS: "hh_admin_settings_v1",
  OFFERS: "hh_admin_offers_v1",
  REVIEWS: "hh_admin_reviews_v1",
  // Legacy keys to purge
  LEGACY_AUTH: "hh_admin_auth_v1",
  LEGACY_PIN: "hh_admin_pin_v1",
};

// Security Constants
const SALT = "hh_rajpura_pepper_2026_x89!";
const MAX_FAILED_ATTEMPTS = 5;
const BASE_LOCKOUT_MS = 60 * 1000; // 1 minute lockout
const DEFAULT_SESSION_HOURS = 4;
const DEFAULT_AUTOLOCK_MINUTES = 15;

// High-speed deterministic SHA-256 standard hash implementation
function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = "length";
  let i = 0,
    j = 0;
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let composite = ascii + "\x80";
  while ((composite[lengthProperty] % 64) - 56) composite += "\x00";
  for (i = 0; i < composite[lengthProperty]; i++) {
    j = composite.charCodeAt(i);
    words[i >> 2] = (words[i >> 2] ?? 0) | (j << ((3 - (i % 4)) * 8));
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15] ?? 0;
      const w2 = w[i - 2] ?? 0;
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? (w[i] ?? 0)
          : (((w[i - 16] ?? 0) + s0 + (w[i - 7] ?? 0) + s1) & 0xffffffff);

      const h0 = hash[0] ?? 0;
      const h1 = hash[1] ?? 0;
      const h2 = hash[2] ?? 0;
      const h3 = hash[3] ?? 0;
      const h4 = hash[4] ?? 0;
      const h5 = hash[5] ?? 0;
      const h6 = hash[6] ?? 0;
      const h7 = hash[7] ?? 0;

      const sA = rightRotate(h0, 2) ^ rightRotate(h0, 13) ^ rightRotate(h0, 22);
      const maj = (h0 & h1) ^ (h0 & h2) ^ (h1 & h2);
      const t2 = (sA + maj) & 0xffffffff;
      const sE = rightRotate(h4, 6) ^ rightRotate(h4, 11) ^ rightRotate(h4, 25);
      const ch = (h4 & h5) ^ (~h4 & h6);
      const t1 = (h7 + sE + ch + (k[i] ?? 0) + (w[i] ?? 0)) & 0xffffffff;

      hash = [(t1 + t2) & 0xffffffff, h0, h1, h2, (h3 + t1) & 0xffffffff, h4, h5, h6];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = ((hash[i] ?? 0) + (oldHash[i] ?? 0)) & 0xffffffff;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = ((hash[i] ?? 0) >> (j * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

export function hashCredential(secret: string): string {
  return sha256Sync(secret + ":" + SALT);
}

// Initial hashed passcode for "1234"
const INITIAL_HASH = hashCredential("1234");

type SecurityMeta = {
  failedAttempts: number;
  lockoutUntil: number;
  autoLockMinutes: number;
  lastPasswordChange: string;
};

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

// Local storage helpers
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
  const [passwordHash, setPasswordHash] = useState<string>(INITIAL_HASH);
  const [securityMeta, setSecurityMeta] = useState<SecurityMeta>({
    failedAttempts: 0,
    lockoutUntil: 0,
    autoLockMinutes: DEFAULT_AUTOLOCK_MINUTES,
    lastPasswordChange: new Date().toISOString(),
  });
  const [securityLogs, setSecurityLogs] = useState<SecurityLogEntry[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [offers, setOffers] = useState<OfferItem[]>(INITIAL_OFFERS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Append security audit log
  const logSecurityEvent = useCallback(
    (event: string, status: SecurityLogEntry["status"], details?: string) => {
      const entry: SecurityLogEntry = {
        id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        event,
        status,
        details,
      };
      setSecurityLogs((prev) => {
        const updated = [entry, ...prev.slice(0, 49)];
        setStored(STORAGE_KEYS.SECURITY_LOGS, updated);
        return updated;
      });
    },
    [],
  );

  // Initialize and validate session
  useEffect(() => {
    // Purge insecure legacy storage
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.LEGACY_AUTH);
      window.localStorage.removeItem(STORAGE_KEYS.LEGACY_PIN);
    }

    // Load or initialize hashed credentials
    const storedHash = getStored<string>(STORAGE_KEYS.PASSWORD_HASH, INITIAL_HASH);
    setPasswordHash(storedHash);

    const storedMeta = getStored<SecurityMeta>(STORAGE_KEYS.SECURITY_META, {
      failedAttempts: 0,
      lockoutUntil: 0,
      autoLockMinutes: DEFAULT_AUTOLOCK_MINUTES,
      lastPasswordChange: new Date().toISOString(),
    });
    setSecurityMeta(storedMeta);

    const storedLogs = getStored<SecurityLogEntry[]>(STORAGE_KEYS.SECURITY_LOGS, []);
    setSecurityLogs(storedLogs);

    // Validate active session
    const session = getStored<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (session && session.expiresAt > Date.now()) {
      const autoLockMs = (storedMeta.autoLockMinutes || DEFAULT_AUTOLOCK_MINUTES) * 60 * 1000;
      const isInactive = autoLockMs > 0 && Date.now() - session.lastActiveAt > autoLockMs;

      if (!isInactive) {
        setIsAuthenticated(true);
        // Refresh last active
        const refreshed: AuthSession = { ...session, lastActiveAt: Date.now() };
        setStored(STORAGE_KEYS.AUTH_SESSION, refreshed);
      } else {
        setIsAuthenticated(false);
        setStored(STORAGE_KEYS.AUTH_SESSION, null);
      }
    } else {
      setIsAuthenticated(false);
      setStored(STORAGE_KEYS.AUTH_SESSION, null);
    }

    // Clean mock orders
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

  // Update session active timestamp periodically
  const recordActivity = useCallback(() => {
    if (!isAuthenticated) return;
    const session = getStored<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (session) {
      const updated: AuthSession = { ...session, lastActiveAt: Date.now() };
      setStored(STORAGE_KEYS.AUTH_SESSION, updated);
    }
  }, [isAuthenticated]);

  // Secure Login with Rate Limiting and Hashing
  const login = (inputSecret: string): { success: boolean; message: string; lockoutSeconds?: number } => {
    const now = Date.now();

    // Check Lockout
    if (securityMeta.lockoutUntil > now) {
      const remainingSec = Math.ceil((securityMeta.lockoutUntil - now) / 1000);
      logSecurityEvent("Login blocked (Brute force lockout)", "warning", `${remainingSec}s remaining`);
      return {
        success: false,
        message: `Too many failed attempts. Account locked for ${remainingSec}s.`,
        lockoutSeconds: remainingSec,
      };
    }

    const inputHash = hashCredential(inputSecret);
    const isValid = inputHash === passwordHash;

    if (isValid) {
      // Create secure session
      const newSession: AuthSession = {
        token: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        createdAt: now,
        expiresAt: now + DEFAULT_SESSION_HOURS * 60 * 60 * 1000,
        lastActiveAt: now,
      };

      const updatedMeta: SecurityMeta = {
        ...securityMeta,
        failedAttempts: 0,
        lockoutUntil: 0,
      };

      setIsAuthenticated(true);
      setSecurityMeta(updatedMeta);
      setStored(STORAGE_KEYS.AUTH_SESSION, newSession);
      setStored(STORAGE_KEYS.SECURITY_META, updatedMeta);
      logSecurityEvent("Successful admin login", "success");
      return { success: true, message: "Welcome back to Hungry Hub Admin!" };
    } else {
      const newFailed = securityMeta.failedAttempts + 1;
      let lockoutDuration = 0;

      if (newFailed >= MAX_FAILED_ATTEMPTS) {
        lockoutDuration = BASE_LOCKOUT_MS * Math.pow(2, newFailed - MAX_FAILED_ATTEMPTS);
      }

      const lockoutUntil = lockoutDuration > 0 ? now + lockoutDuration : 0;
      const updatedMeta: SecurityMeta = {
        ...securityMeta,
        failedAttempts: newFailed,
        lockoutUntil,
      };

      setSecurityMeta(updatedMeta);
      setStored(STORAGE_KEYS.SECURITY_META, updatedMeta);

      if (lockoutDuration > 0) {
        const lockoutSec = Math.ceil(lockoutDuration / 1000);
        logSecurityEvent("Lockout triggered", "error", `${newFailed} failed attempts`);
        return {
          success: false,
          message: `Maximum attempts reached. Locked out for ${lockoutSec} seconds.`,
          lockoutSeconds: lockoutSec,
        };
      }

      const attemptsLeft = MAX_FAILED_ATTEMPTS - newFailed;
      logSecurityEvent("Failed login attempt", "warning", `${attemptsLeft} attempts remaining`);
      return {
        success: false,
        message: `Incorrect passcode. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining before lockout.`,
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStored(STORAGE_KEYS.AUTH_SESSION, null);
    logSecurityEvent("Admin session logged out", "info");
  };

  const changePassword = (currentPass: string, newPass: string): { success: boolean; message: string } => {
    const currentHash = hashCredential(currentPass);
    if (currentHash !== passwordHash) {
      logSecurityEvent("Password change failed (Wrong current password)", "warning");
      return { success: false, message: "Current passcode is incorrect" };
    }

    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: "New passcode must be at least 4 characters/digits" };
    }

    const newHash = hashCredential(newPass.trim());
    setPasswordHash(newHash);
    setStored(STORAGE_KEYS.PASSWORD_HASH, newHash);

    const updatedMeta: SecurityMeta = {
      ...securityMeta,
      lastPasswordChange: new Date().toISOString(),
    };
    setSecurityMeta(updatedMeta);
    setStored(STORAGE_KEYS.SECURITY_META, updatedMeta);

    logSecurityEvent("Master passcode updated", "success");
    return { success: true, message: "Admin passcode changed successfully!" };
  };

  const setAutoLockTimeout = (minutes: number) => {
    const updatedMeta: SecurityMeta = {
      ...securityMeta,
      autoLockMinutes: minutes,
    };
    setSecurityMeta(updatedMeta);
    setStored(STORAGE_KEYS.SECURITY_META, updatedMeta);
    logSecurityEvent("Auto-lock timeout updated", "info", `${minutes} minutes`);
  };

  const revokeAllSessions = () => {
    setIsAuthenticated(false);
    setStored(STORAGE_KEYS.AUTH_SESSION, null);
    logSecurityEvent("All admin sessions revoked", "warning");
  };

  // Orders Actions
  const addOrder = (orderData: Omit<AdminOrder, "id" | "orderNumber" | "createdAt">) => {
    recordActivity();
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
    recordActivity();
    const updated = orders.map((ord) => (ord.id === id ? { ...ord, status } : ord));
    setOrders(updated);
    setStored(STORAGE_KEYS.ORDERS, updated);
  };

  const updatePaymentStatus = (
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
  ) => {
    recordActivity();
    const updated = orders.map((ord) =>
      ord.id === id ? { ...ord, paymentStatus, ...(paymentMethod ? { paymentMethod } : {}) } : ord,
    );
    setOrders(updated);
    setStored(STORAGE_KEYS.ORDERS, updated);
  };

  const deleteOrder = (id: string) => {
    recordActivity();
    const updated = orders.filter((ord) => ord.id !== id);
    setOrders(updated);
    setStored(STORAGE_KEYS.ORDERS, updated);
  };

  const clearAllOrders = () => {
    recordActivity();
    setOrders([]);
    setStored(STORAGE_KEYS.ORDERS, []);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("hh_my_orders_v1");
    }
    logSecurityEvent("All live orders cleared", "warning");
  };

  const wipeAllData = () => {
    recordActivity();
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
    logSecurityEvent("All store data wiped & reset", "error");
  };

  const resetOrders = () => {
    recordActivity();
    setOrders([]);
    setStored(STORAGE_KEYS.ORDERS, []);
  };

  // Menu Actions
  const addMenuItem = (item: MenuItem) => {
    recordActivity();
    const updated = [item, ...menuItems];
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const updateMenuItem = (id: string, patch: Partial<MenuItem>) => {
    recordActivity();
    const updated = menuItems.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const deleteMenuItem = (id: string) => {
    recordActivity();
    const updated = menuItems.filter((item) => item.id !== id);
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const toggleItemAvailability = (id: string) => {
    recordActivity();
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, available: !item.available } : item,
    );
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const toggleItemBestseller = (id: string) => {
    recordActivity();
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, bestseller: !item.bestseller } : item,
    );
    setMenuItems(updated);
    setStored(STORAGE_KEYS.MENU, updated);
  };

  const resetMenu = () => {
    recordActivity();
    setMenuItems(defaultMenu);
    setStored(STORAGE_KEYS.MENU, defaultMenu);
  };

  // Settings Actions
  const updateSettings = (patch: Partial<RestaurantSettings>) => {
    recordActivity();
    const updated = { ...settings, ...patch };
    setSettings(updated);
    setStored(STORAGE_KEYS.SETTINGS, updated);
  };

  const resetSettings = () => {
    recordActivity();
    setSettings(INITIAL_SETTINGS);
    setStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  };

  // Offers Actions
  const addOffer = (offer: OfferItem) => {
    recordActivity();
    const updated = [...offers, offer];
    setOffers(updated);
    setStored(STORAGE_KEYS.OFFERS, updated);
  };

  const updateOffer = (id: string, patch: Partial<OfferItem>) => {
    recordActivity();
    const updated = offers.map((o) => (o.id === id ? { ...o, ...patch } : o));
    setOffers(updated);
    setStored(STORAGE_KEYS.OFFERS, updated);
  };

  const deleteOffer = (id: string) => {
    recordActivity();
    const updated = offers.filter((o) => o.id !== id);
    setOffers(updated);
    setStored(STORAGE_KEYS.OFFERS, updated);
  };

  // Reviews Actions
  const addReview = (review: ReviewItem) => {
    recordActivity();
    const updated = [review, ...reviews];
    setReviews(updated);
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  const deleteReview = (id: string) => {
    recordActivity();
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

  const lockoutRemaining =
    securityMeta.lockoutUntil > Date.now()
      ? Math.ceil((securityMeta.lockoutUntil - Date.now()) / 1000)
      : 0;

  return {
    isLoaded,
    isAuthenticated,
    securityMeta,
    securityLogs,
    lockoutRemaining,
    orders,
    menuItems,
    settings,
    offers,
    reviews,
    stats,
    login,
    logout,
    changePassword,
    setAutoLockTimeout,
    revokeAllSessions,
    recordActivity,
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
    const existing = getStored<AdminOrder[]>(STORAGE_KEYS.ORDERS, []);
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
