import prisma from '@/lib/prisma'
import ProductGallery from './components/product-gallery'
import ProductOverview from './components/product-overview'
import VariantSelector from './components/variant-selector'
import { OmittedProductFields, TVariant } from '@/lib/types'

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
  const products = await prisma.product.findUnique({
    where: {slug},
    include: {
      specs: {
        omit: {createdAt: true, updatedAt: true, productId: true}
      },
      category: {omit: {createdAt: true, updatedAt: true}},
      variants: {
        omit: {createdAt: true, updatedAt: true, productId: true}
      }
    }
  })

  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2'>
        <ProductGallery images={products?.images ?? []} />
        <div className='flex flex-col'>
          <ProductOverview product={products as OmittedProductFields} />
          <VariantSelector variants={products?.variants as unknown as TVariant[]} />
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
