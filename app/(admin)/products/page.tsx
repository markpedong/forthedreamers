import { getCategories, getProducts } from '@/lib/http';
import Products from './components';

const Page = async () => {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return <Products products={products.data ?? []} categories={categories.data ?? []} />;
};

export default Page;
