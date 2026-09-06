import Categories from './components';
import { adminCategories } from '@/lib/services/admin-catalog';
export default async function Page() { return <Categories initialCategories={await adminCategories()} />; }
