import { getProducts } from '@/lib/http';
import Products from './components';

const Page = async () => {
  const products = await getProducts();

  return <Products products={products.data ?? []} />;
};

export default Page;
