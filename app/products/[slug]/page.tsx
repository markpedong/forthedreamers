import prisma from '@/lib/prisma'
import ProductPageClient from './components/product-page-client'
import { TProduct, TVariant } from '@/lib/types'
import { getProductPrisma } from '@/lib/server-actions'

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        specs: true,
        category: true
      }
    })

    return products?.map(product => ({slug: product.slug})) ?? []
  } catch (error) {
    // Database unreachable during build — fall back to dynamic rendering
    console.warn('⚠️ Database unreachable during build, skipping static params generation')
    return []
  }
}

const ProductPage = async (props: PageProps<'/products/[slug]'>) => {
  const {slug} = await props.params
  const product = await getProductPrisma(slug)

  return (
    <>
      {!!product ? (
        <ProductPageClient product={product} />
      ) : (
        <>Loading...</>
      )}
    </>
  )
}

export const dynamic = 'force-dynamic'

export default ProductPage
