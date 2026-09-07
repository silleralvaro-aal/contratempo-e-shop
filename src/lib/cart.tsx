import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  count: number;
  total: number;
  open: () => void;
  close: () => void;
  add: (product: Product) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const total = lines.reduce((n, l) => n + l.quantity * l.product.price, 0);
    return {
      lines,
      isOpen,
      count,
      total,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (product) => {
        setLines((prev) => {
          const found = prev.find((l) => l.product.slug === product.slug);
          if (found) {
            return prev.map((l) =>
              l.product.slug === product.slug ? { ...l, quantity: l.quantity + 1 } : l,
            );
          }
          return [...prev, { product, quantity: 1 }];
        });
        setIsOpen(true);
      },
      remove: (slug) => setLines((prev) => prev.filter((l) => l.product.slug !== slug)),
      setQuantity: (slug, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => l.product.slug !== slug)
            : prev.map((l) => (l.product.slug === slug ? { ...l, quantity } : l)),
        ),
      clear: () => setLines([]),
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
