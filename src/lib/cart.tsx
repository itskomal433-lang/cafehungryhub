import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { charges } from "@/data/restaurant";

export type CartLine = {
  /** Unique per configuration (item + selected options). */
  key: string;
  itemId: string;
  name: string;
  image: string;
  /** Human readable selected options, e.g. ["Large", "Cheese Burst", "Extra Cheese"]. */
  selections: string[];
  unitPrice: number;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "hungry-hub-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const addLine = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((entry) => entry.key === line.key);
      if (existing) {
        return current.map((entry) =>
          entry.key === line.key ? { ...entry, quantity: entry.quantity + quantity } : entry,
        );
      }
      return [...current, { ...line, quantity }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((entry) => entry.key !== key)
        : current.map((entry) => (entry.key === key ? { ...entry, quantity } : entry)),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((current) => current.filter((entry) => entry.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const qualifiesFreeDelivery =
      charges.freeDeliveryAbove > 0 && subtotal >= charges.freeDeliveryAbove;
    const deliveryFee = subtotal > 0 && !qualifiesFreeDelivery ? charges.deliveryFee : 0;
    const tax = Math.round(subtotal * (charges.taxPercent / 100) * 100) / 100;
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      deliveryFee,
      tax,
      total: subtotal + deliveryFee + tax,
      isOpen,
      setOpen,
      addLine,
      setQuantity,
      removeLine,
      clear,
    };
  }, [lines, isOpen, addLine, setQuantity, removeLine, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
