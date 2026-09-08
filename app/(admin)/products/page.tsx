import Products from './components';
import { adminProducts, adminCategories } from '@/lib/services/admin-catalog';
export default async function Page() {
  const [products, categories] = await Promise.all([adminProducts(), adminCategories()]);
  return <Products initialProducts={products} initialCategories={categories} />;
}
