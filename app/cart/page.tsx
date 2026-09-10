import { getCurrentUserID } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { readCart } from '@/lib/services/cart';
import CartItemsList from './cart-items-list';

export default async function CartPage() {
  const userId = await getCurrentUserID();
  if (!userId) redirect('/sign-in?next=/cart');
  const items = await readCart(userId);
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <h1 className="mb-5 text-2xl font-bold md:mb-8 md:text-3xl">Your Cart</h1>
      <CartItemsList items={items} />
    </main>
  );
}
export const dynamic = 'force-dynamic';
