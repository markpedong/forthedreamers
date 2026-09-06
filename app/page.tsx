import LandingPage from './components'
import { homeProducts } from '@/lib/services/catalog'
export default async function Page() { return <LandingPage products={await homeProducts()} /> }
export const dynamic = 'force-dynamic'
