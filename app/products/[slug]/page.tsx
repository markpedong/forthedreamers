import { getProduct } from '@/lib/http'
import ProductGallery from './components/product-gallery'

interface ProductPageProps {
  params: Promise<{slug: string}>
}

const ProductPage = async ({params}: ProductPageProps) => {
  const {slug} = await params
  const products = await getProduct(slug)

  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid gap-16 lg:grid-cols-2'>
          <div>
            <ProductGallery images={products.data?.images || []} />
          </div>
          {/* 
          <div className='flex flex-col gap-10'>
            <ProductOverview product={mockProduct} />ˇ
            <VariantSelector variants={mockProduct.variants} />
            <AddToCartSection product={mockProduct} />
          </div> */}
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
