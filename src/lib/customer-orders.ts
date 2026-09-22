import { useState, useEffect, useCallback } from "react";
import { type AdminOrder, type OrderStatus } from "./admin-store";

const CUSTOMER_ORDERS_KEY = "hh_my_orders_v1";
const ADMIN_ORDERS_KEY = "hh_admin_orders_v1";

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

export function saveCustomerOrderId(orderNumber: string) {
  if (typeof window === "undefined") return;
  const existing = getStored<string[]>(CUSTOMER_ORDERS_KEY, []);
  if (!existing.includes(orderNumber)) {
    setStored(CUSTOMER_ORDERS_KEY, [orderNumber, ...existing]);
  }
}

export function useCustomerOrders() {
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshOrders = useCallback(() => {
    const storedNumbers = getStored<string[]>(CUSTOMER_ORDERS_KEY, []);
    const allOrders = getStored<AdminOrder[]>(ADMIN_ORDERS_KEY, []);

    // Find all matching orders by order number or customer phone
    const myOrders = allOrders.filter((ord) => storedNumbers.includes(ord.orderNumber));

    // If no explicit order is saved yet, check if there's any recent demo order
    setOrderNumbers(storedNumbers);
    setOrders(myOrders);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refreshOrders();

    // Listen for storage changes from admin status updates or new cart checkout
    const handleStorage = () => refreshOrders();
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(refreshOrders, 3000); // 3-second live kitchen status poller

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [refreshOrders]);

  const trackOrderByNumber = (query: string): AdminOrder | null => {
    const cleanQuery = query.trim().toUpperCase();
    const allOrders = getStored<AdminOrder[]>(ADMIN_ORDERS_KEY, []);
    const found = allOrders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanQuery ||
        o.orderNumber.toUpperCase() === `HH-${cleanQuery}` ||
        o.customerPhone.includes(query.trim()),
    );
    if (found) {
      // Save to my orders if found
      saveCustomerOrderId(found.orderNumber);
      refreshOrders();
      return found;
    }
    return null;
  };

  return {
    isLoaded,
    orders,
    orderNumbers,
    latestOrder: orders[0] || null,
    refreshOrders,
    trackOrderByNumber,
  };
}
