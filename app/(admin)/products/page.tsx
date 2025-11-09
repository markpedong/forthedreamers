import { getCategories } from '@/lib/http';
import Products from './components';

const Page = async () => {
  const [categories] = await Promise.all([getCategories()]);

  return <Products categories={categories.data ?? []} />;
};

export default Page;
