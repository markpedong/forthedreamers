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

const signInRoute = read('app/api/auth/sign-in/route.ts');
assert.match(signInRoute, /upsertAuthUser\(authUser\)/);
assert.doesNotMatch(signInRoute, /getSession/);
assert.match(signInRoute, /rateLimited \? 429 : 401/);

const middleware = read('lib/middleware.ts');
assert.match(middleware, /auth\.getClaims\(\)/);
assert.doesNotMatch(middleware, /auth\.getUser\(\)/);

const authService = read('lib/services/auth.ts');
assert.match(authService, /getSessionClaims\(\)/);
assert.doesNotMatch(authService, /upsertAuthUser/);
assert.doesNotMatch(authService, /auth\.getSession\(\)/);
assert.match(authService, /signOut\(\{ scope: 'local' \}\)/);

const provider = read('components/provider/main-provider.tsx');
assert.match(provider, /useCurrentUserQuery\(!isAuthRoute\)/);
assert.doesNotMatch(provider, /fetch\(['"]\/api\/auth\/me/);

for (const signInForm of [
  'app/(auth)/sign-in/components/sign-in.tsx',
  'app/(auth)/seller/components/seller-sign-in.tsx',
]) {
  assert.doesNotMatch(read(signInForm), /setValueAs/);
}

const signOutMutation = read('services/useMutation.ts');
assert.match(signOutMutation, /export const useSignOutMutation/);
assert.match(signOutMutation, /queryClient\.removeQueries\(\)/);
assert.match(signOutMutation, /Please sign in first/);
assert.match(signOutMutation, /label: 'Sign in'/);

const reduxStore = read('redux/store/index.ts');
assert.match(reduxStore, /whitelist: \['appData'\]/);
assert.doesNotMatch(reduxStore, /cartData/);
assert.ok(!existsSync(new URL('../redux/reducers/cartData.ts', import.meta.url)));
assert.match(read('components/navigation/cart-item-count.tsx'), /useCartCountQuery/);

for (const signOutSurface of [
  'components/navigation/navbar.tsx',
  'app/(admin)/components/admin-header.tsx',
  'app/(main)/profile/components/profile-header.tsx',
]) {
  const source = read(signOutSurface);
  assert.match(source, /useSignOutMutation/);
  assert.doesNotMatch(source, /fetch\(['"]\/api\/auth\/sign-out/);
}

const toastListener = read('components/provider/toast-listener.tsx');
assert.match(toastListener, /queryClient\.removeQueries\(\)/);
assert.doesNotMatch(toastListener, /fetch\(['"]\/api\/auth\/sign-out/);
assert.ok(!existsSync(new URL('../hooks/useSignOut.ts', import.meta.url)));

console.log('Critical customer and authentication flows are wired through shared hooks and real routes.');
