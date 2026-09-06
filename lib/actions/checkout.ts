'use server';
import { getSession } from '@/lib/server-actions';
import { checkout } from '@/lib/services/checkout';
export async function startCheckout() {
  try {
    const session = await getSession();
    if (!session) return { success: false as const, message: 'Please sign in' };
    return { success: true as const, message: 'Continue to secure payment', data: await checkout(session.user.id) };
  } catch { return { success: false as const, message: 'Unable to start payment. Check stock and retry; any pending order is preserved.' }; }
}
