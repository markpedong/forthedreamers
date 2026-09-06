import ProductPageClient from './components/product-page-client'
import { productBySlug } from '@/lib/services/catalog'
import { notFound } from 'next/navigation'
export default async function ProductPage(props: PageProps<'/products/[slug]'>) {
  const { slug } = await props.params
  const product = await productBySlug(slug)
  if (!product) notFound()
  return <ProductPageClient product={product} />
}
export const dynamic = 'force-dynamic'
