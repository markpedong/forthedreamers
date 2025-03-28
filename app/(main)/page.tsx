import Home from './components'
import { getProducts } from '@/utils/request'

export default async function Page() {
	const products = await getProducts()

	return <Home products={products.data} />
}
