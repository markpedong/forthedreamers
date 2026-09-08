'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductsQuery } from '@/services/useQuery';

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const query = useProductsQuery({ q: debouncedSearch, limit: 6 }, isOpen && debouncedSearch.length >= 2);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const openResults = () => {
    const value = search.trim();
    if (!value) return;
    router.push(`/products?q=${encodeURIComponent(value)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-20 z-50 mx-auto w-auto max-w-2xl md:top-32"
          >
            <form
              onSubmit={event => {
                event.preventDefault();
                openResults();
              }}
              className="relative mb-4 overflow-hidden rounded-lg bg-background shadow-lg"
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full border-0 bg-background py-3 pl-12 pr-12 text-base focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Button type="button" variant="ghost" size="icon" onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </form>

            <div className="overflow-hidden rounded-lg bg-background shadow-lg">
              {search.trim().length < 2 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">Type at least 2 characters to search.</p>
              ) : query.isLoading || debouncedSearch !== search.trim() ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">Searching products…</p>
              ) : query.isError ? (
                <div className="space-y-3 px-4 py-8 text-center">
                  <p className="text-sm text-destructive">{query.error.message}</p>
                  <Button variant="outline" size="sm" onClick={() => void query.refetch()}>Try again</Button>
                </div>
              ) : query.data?.products.length ? (
                <div className="divide-y divide-border">
                  {query.data.products.map(product => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => {
                        router.push(`/products/${product.slug}`);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted"
                    >
                      <span>
                        <span className="block text-sm font-medium">{product.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {product.category.name} · {product.seller.storeName}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.basePrice != null || product.variants[0]
                          ? `$${(product.basePrice ?? product.variants[0].price).toFixed(2)}`
                          : 'Price unavailable'}
                      </span>
                    </button>
                  ))}
                  <button type="button" onClick={openResults} className="w-full px-4 py-3 text-sm font-medium hover:bg-muted">
                    View all results
                  </button>
                </div>
              ) : (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No products found for “{debouncedSearch}”.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
