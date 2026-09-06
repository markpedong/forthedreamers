import { getSession } from '@/lib/server-actions';
import { redirect } from 'next/navigation';
import { readCart } from '@/lib/services/cart';
import CartItemsList from './cart-items-list';
export default async function CartPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/cart');
  const items = await readCart(session.user.id);
  return <main className="max-w-6xl mx-auto py-8 px-4"><h1 className="text-3xl font-bold mb-8">Your Cart</h1><CartItemsList items={items} /></main>;
}
export const dynamic = 'force-dynamic';
