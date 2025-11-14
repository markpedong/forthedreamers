import prisma from '@/lib/prisma'
import ProductGallery from './components/product-gallery'
import ProductOverview from './components/product-overview'
import VariantSelector from './components/variant-selector'
import { OmittedProductFields, TVariant } from '@/lib/types'
import { getProductPrisma } from '@/lib/server-actions'

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      specs: true,
      category: true
    }
  })

  return products?.map(product => ({slug: product.slug})) ?? []
}

interface ProductPageProps {
  params: Promise<{slug: string}>
}

const ProductPage = async ({params}: ProductPageProps) => {
  const {slug} = await params
  const product = await getProductPrisma(slug)

  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2'>
        <ProductGallery images={product?.images ?? []} />
        <div className='flex flex-col'>
          <ProductOverview product={product as OmittedProductFields} />
          <VariantSelector variants={product?.variants as unknown as TVariant[]} />
          {/*  <AddToCartSection product={mockProduct} /> */}
        </div>
      </div>

      {/* <div className='border-t border-border'>
        <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
          <ProductInfoTabs product={mockProduct} />
        </div>
      </div>

      <div className='border-t border-border bg-secondary/30'>
        <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
          <RelatedProducts products={mockProduct.relatedProducts} />
        </div>
      </div> */}
    </main>
  )
}

export default ProductPage
