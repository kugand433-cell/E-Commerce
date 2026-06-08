import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

export interface CartItem {
  product: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  stock?: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (p: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "shopnest_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextValue["addItem"] = (p, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product === p._id);
      const price = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
      if (found) {
        return prev.map((i) =>
          i.product === p._id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          product: p._id,
          title: p.title,
          image: p.images?.[0] || "",
          price,
          quantity: qty,
          stock: p.stock,
        },
      ];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (id) =>
    setItems((prev) => prev.filter((i) => i.product !== id));

  const updateQuantity: CartContextValue["updateQuantity"] = (id, qty) => {
    if (qty <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.product === id ? { ...i, quantity: qty } : i)));
  };

  const clear = () => setItems([]);

  const { subtotal, count } = useMemo(() => {
    const s = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const c = items.reduce((acc, i) => acc + i.quantity, 0);
    return { subtotal: s, count: c };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((v) => !v),
        addItem,
        removeItem,
        updateQuantity,
        clear,
        subtotal,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
