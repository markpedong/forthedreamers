import LandingPage from './components';
import { homeProducts } from '@/lib/services/catalog';

const Page = async () => <LandingPage products={await homeProducts()} />;

export const revalidate = 60;
export default Page;
