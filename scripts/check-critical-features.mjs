import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

for (const [page, hook] of [
  ['app/products/products-client.tsx', 'useProductsQuery'],
  ['app/categories/page.tsx', 'useCategoriesQuery'],
  ['app/wishlist/page.tsx', 'useWishlistItemsQuery'],
  ['app/orders/page.tsx', 'useOrdersQuery'],
  ['app/support/page.tsx', 'useSupportTicketsQuery'],
]) {
  assert.match(read(page), new RegExp(hook), `${page} must use ${hook}`);
}

const overlay = read('components/navigation/search-overlay.tsx');
assert.match(overlay, /useProductsQuery/);
assert.doesNotMatch(overlay, /SUGGESTIONS|Wireless Headphones/);

const mutations = read('services/useMutation.ts');
assert.match(mutations, /invalidateQueries\(\{ queryKey: wishlistItemsQueryKey \}\)/);
assert.match(mutations, /invalidateQueries\(\{ queryKey: supportTicketsQueryKey \}\)/);

assert.ok(existsSync(new URL('../app/api/support/tickets/[id]/route.ts', import.meta.url)));
assert.ok(existsSync(new URL('../app/api/support/tickets/[id]/messages/route.ts', import.meta.url)));
assert.doesNotMatch(read('components/navigation/footer.tsx'), /href=["']#["']/);

console.log('Critical customer flows are wired through shared hooks and real routes.');
