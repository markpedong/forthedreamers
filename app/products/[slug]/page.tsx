import prisma from '@/lib/prisma'
import ProductGallery from './components/product-gallery'
import ProductOverview from './components/product-overview'
import VariantSelector from './components/variant-selector'
import { TProduct, TVariant } from '@/lib/types'
import { getProductPrisma } from '@/lib/server-actions'
import AddToCartSection from './components/add-to-cart-section'
import { ProductInfoTabs } from './components/product-info-tabs'

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

const ProductPage = async (props: PageProps<'/products/[slug]'>) => {
  const {slug} = await props.params
  const product = await getProductPrisma(slug)

  return (
    <>
      {!!product ? (
        <>
          <div className='mx-auto max-w-7xl pt-16 px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2'>
            <ProductGallery images={product?.images ?? []} />
            <div className='flex flex-col'>
              <ProductOverview product={product} />
              <VariantSelector variants={product?.variants as TVariant[]} />
              <AddToCartSection product={product} />
            </div>
          </div>
          <ProductInfoTabs product={product as unknown as TProduct} />
        </>
      ) : (
        <>Loading...</>
      )}
      {/*
      <div className='border-t border-border bg-secondary/30'>
        <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
          <RelatedProducts products={mockProduct.relatedProducts} />
        </div>
      </div> */}
    </>
  )
}

export default ProductPage
