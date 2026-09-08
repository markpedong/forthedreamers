import ProductsClient from './products-client';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sortBy?: string; order?: string }>;
}) {
  const filters = await searchParams;
  const allowedSorts = ['name', 'price', 'rating', 'sold', 'createdAt'];
  const sortBy = allowedSorts.includes(filters.sortBy ?? '') ? filters.sortBy! : 'createdAt';
  return (
    <ProductsClient
      initialQuery={filters.q ?? ''}
      initialCategory={filters.category ?? ''}
      initialSortBy={sortBy}
      initialOrder={filters.order === 'asc' ? 'asc' : 'desc'}
    />
  );
}
