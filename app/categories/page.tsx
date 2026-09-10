'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategoriesQuery } from '@/services/useQuery';

export default function CategoriesPage() {
  const categoriesQuery = useCategoriesQuery();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <header className="mb-6 md:mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Discover</p>
        <h1 className="mt-1.5 text-2xl font-light tracking-tight md:mt-2 md:text-4xl">Shop by category</h1>
        <p className="mt-1.5 text-sm text-muted-foreground md:mt-2">Browse categories with active products in the marketplace.</p>
      </header>

      {categoriesQuery.isLoading ? (
        <p className="py-20 text-center text-muted-foreground">Loading categories…</p>
      ) : categoriesQuery.isError ? (
        <div className="space-y-4 py-20 text-center">
          <p className="text-destructive">{categoriesQuery.error.message}</p>
          <Button variant="outline" onClick={() => void categoriesQuery.refetch()}>Try again</Button>
        </div>
      ) : !categoriesQuery.data?.length ? (
        <div className="space-y-3 py-20 text-center">
          <h2 className="text-xl font-medium">No categories available</h2>
          <p className="text-sm text-muted-foreground">Active product categories will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {categoriesQuery.data.map(category => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.id)}`}
              className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50 md:min-h-40 md:p-6"
            >
              <div>
                <h2 className="text-lg font-light md:text-2xl">{category.name}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground md:mt-2">
                  {category._count.products} active product{category._count.products === 1 ? '' : 's'}
                </p>
              </div>
              <span className="mt-5 flex items-center gap-2 text-sm font-medium md:mt-8">
                Browse category <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
