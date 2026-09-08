import Products from '../../products/components';
import { adminCategories, adminProducts } from '@/lib/services/admin-catalog';

export default async function Page() {
  const [products, categories] = await Promise.all([adminProducts(), adminCategories()]);
  return <Products initialProducts={products} initialCategories={categories} />;
}
