'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/app/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductsQuery } from '@/services/useQuery';

const ProductsClient = ({
  initialQuery,
  initialCategory,
  initialSortBy,
  initialOrder,
}: {
  initialQuery: string;
  initialCategory: string;
  initialSortBy: string;
  initialOrder: 'asc' | 'desc';
}) => {
  const [search, setSearch] = useState(initialQuery);
  const [queryText, setQueryText] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [maxRating, setMaxRating] = useState('5');
  const [inStock, setInStock] = useState<'' | '0' | '1'>('');
  const [sort, setSort] = useState(`${initialSortBy}:${initialOrder}`);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, order] = sort.split(':') as ['name' | 'price' | 'rating' | 'sold' | 'createdAt', 'asc' | 'desc'];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQueryText(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const productsQuery = useProductsQuery({
    q: queryText,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    inStock,
    sortBy,
    order,
    page,
    limit: 20,
  });
  const data = productsQuery.data;

  const clearFilters = () => {
    setSearch('');
    setQueryText('');
    setCategory('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('0');
    setMaxRating('5');
    setInStock('');
    setSort('createdAt:desc');
    setPage(1);
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Shop</p>
        <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">Browse products</h1>
        <p className="mt-2 text-sm text-muted-foreground">Search and filter the active marketplace catalog.</p>
      </header>

      <div className="mb-6 rounded-md border border-border bg-card p-3 shadow-sm sm:p-4">
        <Input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search by product name or description"
          aria-label="Search products"
          className="h-11 bg-background"
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside aria-label="Product filters" className="rounded-md border border-border bg-card p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Search filters</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="link"
                className="h-auto p-0 text-xs lg:hidden"
                aria-expanded={filtersOpen}
                aria-controls="product-filter-fields"
                onClick={() => setFiltersOpen(value => !value)}
              >
                {filtersOpen ? 'Hide' : 'Show'}
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>

          <div id="product-filter-fields" className={`${filtersOpen ? 'block' : 'hidden'} mt-6 space-y-6 lg:block`}>
            <div className="space-y-2 text-sm font-medium">
              <span>Category</span>
              <Select
                value={category || 'all'}
                onValueChange={value => {
                  setCategory(value === 'all' ? '' : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-background font-normal" aria-label="Category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {data?.categories.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-sm font-medium">
              <span>Brand</span>
              <Select
                value={brand || 'all'}
                onValueChange={value => {
                  setBrand(value === 'all' ? '' : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-background font-normal" aria-label="Brand">
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All brands</SelectItem>
                  {data?.brands.map(item => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-sm font-medium">
              <span>Availability</span>
              <Select
                value={inStock || 'any'}
                onValueChange={value => {
                  setInStock(value === 'any' ? '' : (value as '0' | '1'));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-background font-normal" aria-label="Stock availability">
                  <SelectValue placeholder="Any availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any availability</SelectItem>
                  <SelectItem value="1">In stock</SelectItem>
                  <SelectItem value="0">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Price range</legend>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={event => {
                    setMinPrice(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Min"
                  aria-label="Minimum price"
                />
                <Input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={event => {
                    setMaxPrice(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Max"
                  aria-label="Maximum price"
                />
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Rating</legend>
              <div className="space-y-2">
                <Select
                  value={minRating}
                  onValueChange={value => {
                    setMinRating(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-background" aria-label="Minimum rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map(value => (
                      <SelectItem key={value} value={String(value)}>
                        {value === 0 ? 'Any rating' : `${value} stars and up`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={maxRating}
                  onValueChange={value => {
                    setMaxRating(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-background" aria-label="Maximum rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(value => (
                      <SelectItem key={value} value={String(value)}>
                        Up to {value} stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
          </div>
        </aside>

        <section aria-label="Product results" className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 rounded-md border border-border bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {data?.products.length
                ? `Showing ${(data.page - 1) * data.limit + 1}–${(data.page - 1) * data.limit + data.products.length}`
                : data
                  ? 'No products'
                  : 'Loading products…'}
              {productsQuery.isFetching && !productsQuery.isLoading && <span className="ml-2">Updating…</span>}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="shrink-0 text-muted-foreground">Sort by</span>
              <Select
                value={sort}
                onValueChange={value => {
                  setSort(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-48 bg-background" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="createdAt:desc">Newest</SelectItem>
                  <SelectItem value="sold:desc">Best selling</SelectItem>
                  <SelectItem value="rating:desc">Highest rated</SelectItem>
                  <SelectItem value="price:asc">Price: low to high</SelectItem>
                  <SelectItem value="price:desc">Price: high to low</SelectItem>
                  <SelectItem value="name:asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {productsQuery.isLoading ? (
            <p className="py-20 text-center text-muted-foreground">Loading products…</p>
          ) : productsQuery.isError ? (
            <div className="space-y-4 py-20 text-center">
              <p className="text-destructive">{productsQuery.error.message}</p>
              <Button variant="outline" onClick={() => void productsQuery.refetch()}>
                Try again
              </Button>
            </div>
          ) : !data?.products.length ? (
            <div className="space-y-3 py-20 text-center">
              <h2 className="text-xl font-medium">No products found</h2>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {data.products.map(product => (
                  <ProductCard key={product.id} {...product} compact />
                ))}
              </div>
              <nav aria-label="Product pagination" className="mt-10 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={page <= 1 || productsQuery.isFetching}
                  onClick={() => setPage(value => value - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button
                  variant="outline"
                  disabled={!data.hasMore || productsQuery.isFetching}
                  onClick={() => setPage(value => value + 1)}
                >
                  Next
                </Button>
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductsClient;
