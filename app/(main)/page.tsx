import Home from './components'
import { getProducts } from '@/lib/server'

export default async function Page() {
  const products = await getProducts()

  return <Home products={products as any} />
}
