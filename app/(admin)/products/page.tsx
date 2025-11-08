import { getCategories, getProducts } from '@/lib/http';
import Products from './components';
import { getSession } from '@/lib/server-actions';

const Page = async () => {
  const [products, categories, session] = await Promise.all([
    getProducts(),
    getCategories(),
    getSession(),
  ]);

  return (
    <Products products={products.data ?? []} categories={categories.data ?? []} session={session?.user} />
  );
};

export default Page;
