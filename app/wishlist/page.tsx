'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddCartMutation, useWishlistMutation } from '@/services/useMutation';
import { useWishlistItemsQuery } from '@/services/useQuery';

export default function WishlistPage() {
  const [page, setPage] = useState(1);
  const wishlistQuery = useWishlistItemsQuery(page);
  const wishlistMutation = useWishlistMutation();
  const cartMutation = useAddCartMutation();
  const data = wishlistQuery.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Saved</p>
        <h1 className="mt-2 text-4xl font-light tracking-tight">Your wishlist</h1>
      </header>

      {wishlistQuery.isLoading ? (
        <p className="py-20 text-center text-muted-foreground">Loading your wishlist…</p>
      ) : wishlistQuery.isError ? (
        <div className="space-y-4 py-20 text-center">
          <p className="text-destructive">{wishlistQuery.error.message}</p>
          <Button asChild><Link href="/sign-in?next=/wishlist">Sign in</Link></Button>
        </div>
      ) : !data?.wishlist.length ? (
        <div className="space-y-4 py-20 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-medium">Your wishlist is empty</h2>
          <p className="text-sm text-muted-foreground">Save products to find them here later.</p>
          <Button asChild><Link href="/products">Browse products</Link></Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.wishlist.map(item => {
              const product = item.product;
              const variant = product.variants.find(candidate => candidate.stock > 0);
              const cartPending = cartMutation.isPending && cartMutation.variables?.variantId === variant?.id;
              const removePending = wishlistMutation.isPending && wishlistMutation.variables?.id === product.id;
              return (
                <article key={item.id} className="overflow-hidden border border-border bg-card">
                  <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-muted">
                    {product.images[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-sm text-muted-foreground">Image unavailable</span>
                    )}
                  </Link>
                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.seller.storeName}</p>
                      <Link href={`/products/${product.slug}`} className="mt-1 block text-lg font-medium hover:underline">{product.name}</Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {product.basePrice != null || product.variants[0]
                          ? `$${(product.basePrice ?? product.variants[0].price).toFixed(2)}`
                          : 'Price unavailable'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        disabled={!variant || cartPending}
                        onClick={() => variant && cartMutation.mutate({ variantId: variant.id, quantity: 1, buyNow: false })}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {cartPending ? 'Adding…' : variant ? 'Add to cart' : 'Unavailable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={removePending}
                        onClick={() => wishlistMutation.mutate({ id: product.id, wanted: false })}
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <nav aria-label="Wishlist pagination" className="mt-12 flex items-center justify-center gap-4">
            <Button variant="outline" disabled={page <= 1 || wishlistQuery.isFetching} onClick={() => setPage(value => value - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
            <Button variant="outline" disabled={page >= pages || wishlistQuery.isFetching} onClick={() => setPage(value => value + 1)}>Next</Button>
          </nav>
        </>
      )}
    </main>
  );
}
