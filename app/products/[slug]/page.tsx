import ProductPageClient from './components/product-page-client'
import {productBySlug, productSlugs} from '@/lib/services/catalog'
import {notFound} from 'next/navigation'

const ProductPage = async (props: PageProps<'/products/[slug]'>) => {
  const {slug} = await props.params
  const product = await productBySlug(slug)
  if (!product) notFound()
  return <ProductPageClient product={product} />
}

export const generateStaticParams = async () => (await productSlugs()).map(({slug}) => ({slug}))
export const revalidate = 60
export default ProductPage
