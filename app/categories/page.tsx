'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategoriesQuery } from '@/services/useQuery';

export default function CategoriesPage() {
  const categoriesQuery = useCategoriesQuery();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Discover</p>
        <h1 className="mt-2 text-4xl font-light tracking-tight">Shop by category</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse categories with active products in the marketplace.</p>
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesQuery.data.map(category => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.id)}`}
              className="group flex min-h-40 flex-col justify-between border border-border bg-card p-6 transition-colors hover:bg-muted/50"
            >
              <div>
                <h2 className="text-2xl font-light">{category.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {category._count.products} active product{category._count.products === 1 ? '' : 's'}
                </p>
              </div>
              <span className="mt-8 flex items-center gap-2 text-sm font-medium">
                Browse category <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
