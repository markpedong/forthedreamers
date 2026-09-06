export const stableSerialize = (value: Record<string, unknown>) => JSON.stringify(Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))));
export const cacheKeys = {
  generation: (scope: string) => `ftd:v1:generation:${scope}`,
  home: 'home:public:cards',
  product: (slug: string) => `product:public:${encodeURIComponent(slug)}`,
  categories: 'categories:public',
  products: (params: Record<string, unknown>) => `products:public:cards:${stableSerialize(params)}`,
  entry: (scope: string, generation: string, key: string) => `ftd:v1:${scope}:${generation}:${key}`,
};
