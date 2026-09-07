'use server';
import { getSession } from '@/lib/server-actions';
import { checkout } from '@/lib/services/checkout';
export async function startCheckout() {
  try {
    const session = await getSession();
    if (!session) return { success: false as const, message: 'Please sign in' };
    return { success: true as const, message: 'Order confirmed', data: await checkout(session.user.id) };
  } catch (error) {
    const message = (error instanceof Error) ? error.message : 'Failed to place order. Check stock and retry.';
    return { success: false as const, message };
  }
}
