'use server';
import * as service from '@/lib/services/admin-catalog';
async function run<T>(work: () => Promise<T>) {
  try { return { success: true as const, message: 'Saved successfully', data: await work() }; }
  catch { return { success: false as const, message: 'Unable to save. Check your permissions and input, then retry.' }; }
}
export async function createProduct(input: unknown) { return run(() => service.saveProduct(input, false)); }
export async function updateProduct(input: unknown) { return run(() => service.saveProduct(input, true)); }
export async function deleteProduct(id: string) { return run(() => service.deleteProduct(id)); }
export async function setProductStatus(id: string, active: boolean) { return run(() => service.setProductStatus(id, active)); }
export async function addCategory(name: string) { return run(() => service.saveCategory(name)); }
export async function updateCategory(input: { id: string; name: string }) { return run(() => service.saveCategory(input.name, input.id)); }
