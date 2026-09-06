'use client';
import { createContext, useContext, useOptimistic, useState, useTransition, type ReactNode } from 'react';
import { setWishlist } from '@/lib/actions/wishlist';
import { toast } from 'sonner';
const Context = createContext<{ ids: string[]; pending: boolean; toggle: (id: string) => void }>({ ids: [], pending: false, toggle: () => undefined });
export function WishlistProvider({ initialIds, children }: { initialIds: string[]; children: ReactNode }) {
  const [canonical, setCanonical] = useState(initialIds);
  const [ids, apply] = useOptimistic(canonical, (state, change: { id: string; wanted: boolean }) => change.wanted ? [...new Set([...state, change.id])] : state.filter(id => id !== change.id));
  const [pending, startTransition] = useTransition();
  const toggle = (id: string) => {
    if (pending) return;
    const wanted = !ids.includes(id);
    startTransition(async () => {
      apply({ id, wanted });
      try {
        const result = await setWishlist(id, wanted);
        if (!result.success) { toast.error(result.message); return; }
        setCanonical(state => wanted ? [...new Set([...state, id])] : state.filter(value => value !== id));
        toast.success(result.message);
      } catch { toast.error('Unable to update wishlist'); }
    });
  };
  return <Context.Provider value={{ ids, pending, toggle }}>{children}</Context.Provider>;
}
export const useWishlist = () => useContext(Context);
