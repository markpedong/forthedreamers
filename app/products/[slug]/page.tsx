import {notFound} from 'next/navigation'
import {productBySlug, productSlugs} from '@/lib/services/catalog'
import ProductGallery from './components/product-gallery'
import ProductInfoTabs from './components/product-info-tabs'
import ProductPageClient from './components/product-page-client'
import ProductReviews from './components/product-reviews'
import RelatedProducts from './components/related-products'

const ProductPage = async (props: PageProps<'/products/[slug]'>) => {
  const {slug} = await props.params
  const product = await productBySlug(slug)
  if (!product) notFound()

  const purchaseProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    basePrice: product.basePrice,
    categoryName: product.category.name,
    rating: product.reviewSummary.average,
    reviewCount: product.reviewSummary.count,
    soldCount: product.soldCount,
    images: product.images,
    variants: product.variants
  }

  return (
    <main className='min-h-screen'>
      <div className='mx-auto max-w-7xl space-y-16 px-4 pb-20 pt-12 sm:px-6 lg:px-8'>
        <div className='text-xs uppercase tracking-widest text-muted-foreground'>Home / {product.category.name} / {product.name}</div>

        <section className='grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16'>
          <ProductGallery images={product.images} alt={product.name} />
          <ProductPageClient product={purchaseProduct} />
        </section>

        <ProductInfoTabs
          product={{
            brand: product.brand,
            description: product.description,
            tags: product.tags,
            category: product.category,
            specs: product.specs,
            variants: product.variants,
            seller: product.seller,
            sellerProductCount: product.sellerProductCount
          }}
        />

        <ProductReviews slug={slug} initialReviews={product.reviews} summary={product.reviewSummary} />

        <RelatedProducts
          title='More from this seller'
          description={`Explore more products from ${product.seller.storeName}.`}
          products={product.sellerProducts}
        />

        <RelatedProducts
          title='You may also like'
          description={`More products from ${product.category.name}.`}
          products={product.relatedProducts}
        />
      </div>
    </main>
  )
}

export const generateStaticParams = async () => (await productSlugs()).map(({slug}) => ({slug}))
export const revalidate = 60
export default ProductPage
