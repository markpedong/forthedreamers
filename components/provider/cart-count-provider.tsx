'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
const CartCountContext = createContext<{ count: number; setCount: (count: number) => void }>({ count: 0, setCount: () => undefined });
export function CartCountProvider({ initialCount, children }: { initialCount: number; children: ReactNode }) {
  const [count, setCount] = useState(initialCount);
  return <CartCountContext.Provider value={{ count, setCount }}>{children}</CartCountContext.Provider>;
}
export const useCartCount = () => useContext(CartCountContext);
