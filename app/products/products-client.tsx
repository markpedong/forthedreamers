'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/app/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [sortBy, order] = sort.split(':') as [
    'name' | 'price' | 'rating' | 'sold' | 'createdAt',
    'asc' | 'desc',
  ];

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
    limit: 12,
  });
  const data = productsQuery.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

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
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Shop</p>
        <h1 className="mt-2 text-4xl font-light tracking-tight">Browse products</h1>
        <p className="mt-2 text-sm text-muted-foreground">Search and filter the active marketplace catalog.</p>
      </header>

      <section aria-label="Product filters" className="mb-10 space-y-4 border-y border-border py-6">
        <Input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search by product name or description"
          aria-label="Search products"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={category}
            onChange={event => { setCategory(event.target.value); setPage(1); }}
            aria-label="Category"
            className="h-9 border border-input bg-background px-3 text-sm"
          >
            <option value="">All categories</option>
            {data?.categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select
            value={brand}
            onChange={event => { setBrand(event.target.value); setPage(1); }}
            aria-label="Brand"
            className="h-9 border border-input bg-background px-3 text-sm"
          >
            <option value="">All brands</option>
            {data?.brands.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
          <select
            value={inStock}
            onChange={event => { setInStock(event.target.value as '' | '0' | '1'); setPage(1); }}
            aria-label="Stock availability"
            className="h-9 border border-input bg-background px-3 text-sm"
          >
            <option value="">Any availability</option>
            <option value="1">In stock</option>
            <option value="0">Out of stock</option>
          </select>
          <select
            value={sort}
            onChange={event => { setSort(event.target.value); setPage(1); }}
            aria-label="Sort products"
            className="h-9 border border-input bg-background px-3 text-sm"
          >
            <option value="createdAt:desc">Newest</option>
            <option value="sold:desc">Best selling</option>
            <option value="rating:desc">Highest rated</option>
            <option value="price:asc">Price: low to high</option>
            <option value="price:desc">Price: high to low</option>
            <option value="name:asc">Name: A to Z</option>
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input type="number" min="0" value={minPrice} onChange={event => { setMinPrice(event.target.value); setPage(1); }} placeholder="Minimum price" />
          <Input type="number" min="0" value={maxPrice} onChange={event => { setMaxPrice(event.target.value); setPage(1); }} placeholder="Maximum price" />
          <select value={minRating} onChange={event => { setMinRating(event.target.value); setPage(1); }} aria-label="Minimum rating" className="h-9 border border-input bg-background px-3 text-sm">
            {[0, 1, 2, 3, 4, 5].map(value => <option key={value} value={value}>Minimum rating: {value}</option>)}
          </select>
          <select value={maxRating} onChange={event => { setMaxRating(event.target.value); setPage(1); }} aria-label="Maximum rating" className="h-9 border border-input bg-background px-3 text-sm">
            {[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>Maximum rating: {value}</option>)}
          </select>
          <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
        </div>
      </section>

      {productsQuery.isLoading ? (
        <p className="py-20 text-center text-muted-foreground">Loading products…</p>
      ) : productsQuery.isError ? (
        <div className="space-y-4 py-20 text-center">
          <p className="text-destructive">{productsQuery.error.message}</p>
          <Button variant="outline" onClick={() => void productsQuery.refetch()}>Try again</Button>
        </div>
      ) : !data?.products.length ? (
        <div className="space-y-3 py-20 text-center">
          <h2 className="text-xl font-medium">No products found</h2>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>{data.total} product{data.total === 1 ? '' : 's'}</span>
            {productsQuery.isFetching && <span>Updating…</span>}
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {data.products.map(product => <ProductCard key={product.id} {...product} />)}
          </div>
          <nav aria-label="Product pagination" className="mt-12 flex items-center justify-center gap-4">
            <Button variant="outline" disabled={page <= 1 || productsQuery.isFetching} onClick={() => setPage(value => value - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
            <Button variant="outline" disabled={page >= pages || productsQuery.isFetching} onClick={() => setPage(value => value + 1)}>Next</Button>
          </nav>
        </>
      )}
    </main>
  );
};

export default ProductsClient;
