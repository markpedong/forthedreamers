'use server';
import { getSession } from '@/lib/server-actions';
import { CartError, mutateCart } from '@/lib/services/cart';
export type ActionResult<T = undefined> = { success: true; message: string; data: T } | { success: false; message: string };
async function change(operation: 'add' | 'update' | 'remove', id: string, quantity?: number): Promise<ActionResult<Awaited<ReturnType<typeof mutateCart>>>> {
  try {
    const session = await getSession();
    if (!session) return { success: false, message: 'Please sign in first' };
    const data = await mutateCart(session.user.id, operation, id, quantity);
    return { success: true, message: operation === 'add' ? 'Added to cart' : operation === 'remove' ? 'Removed from cart' : 'Cart updated', data };
  } catch (error) {
    return { success: false, message: error instanceof CartError ? error.message : 'Unable to update cart. Please try again.' };
  }
}
export async function addToCart(id: string, quantity: number) { return change('add', id, quantity); }
export async function updateCartQuantity(id: string, quantity: number) { return change('update', id, quantity); }
export async function removeCartItem(id: string) { return change('remove', id); }
