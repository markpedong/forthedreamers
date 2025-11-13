import { getProduct } from '@/lib/http'
import ProductGallery from './components/product-gallery'
import ProductOverview from './components/product-overview'
import { OmittedProductFields } from '@/lib/types'

interface ProductPageProps {
  params: Promise<{slug: string}>
}

const ProductPage = async ({params}: ProductPageProps) => {
  const {slug} = await params
  const products = await getProduct(slug)

  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2'>
        <ProductGallery images={products.data?.images ?? []} />
        <div className='flex flex-col'>
          <ProductOverview product={products.data as OmittedProductFields} />
          {/* <VariantSelector
            variants={[
              // Black variants
              {
                id: 'v1',
                name: 'Black Compact',
                price: 299.99,
                stock: 15,
                image: '/premium-wireless-headphones-black.jpg',
                attributes: {color: 'Black', size: 'Compact', material: 'Aluminum'}
              },
              {
                id: 'v2',
                name: 'Black Standard',
                price: 299.99,
                stock: 8,
                image: '/premium-wireless-headphones-black.jpg',
                attributes: {color: 'Black', size: 'Standard', material: 'Aluminum'}
              },
              {
                id: 'v3',
                name: 'Black Compact Leather',
                price: 349.99,
                stock: 5,
                image: '/premium-wireless-headphones-black.jpg',
                attributes: {color: 'Black', size: 'Compact', material: 'Leather'}
              },
              // Silver variants
              {
                id: 'v4',
                name: 'Silver Compact',
                price: 299.99,
                stock: 12,
                image: '/premium-wireless-headphones-silver.jpg',
                attributes: {color: 'Silver', size: 'Compact', material: 'Aluminum'}
              },
              {
                id: 'v5',
                name: 'Silver Standard',
                price: 299.99,
                stock: 6,
                image: '/premium-wireless-headphones-silver.jpg',
                attributes: {color: 'Silver', size: 'Standard', material: 'Aluminum'}
              },
              {
                id: 'v6',
                name: 'Silver Standard Leather',
                price: 349.99,
                stock: 3,
                image: '/premium-wireless-headphones-silver.jpg',
                attributes: {color: 'Silver', size: 'Standard', material: 'Leather'}
              },
              // Gold variants
              {
                id: 'v7',
                name: 'Gold Compact',
                price: 329.99,
                stock: 8,
                image: '/premium-wireless-headphones-gold.jpg',
                attributes: {color: 'Gold', size: 'Compact', material: 'Aluminum'}
              },
              {
                id: 'v8',
                name: 'Gold Standard',
                price: 329.99,
                stock: 5,
                image: '/premium-wireless-headphones-gold.jpg',
                attributes: {color: 'Gold', size: 'Standard', material: 'Aluminum'}
              },
              {
                id: 'v9',
                name: 'Gold Compact Leather',
                price: 379.99,
                stock: 2,
                image: '/premium-wireless-headphones-gold.jpg',
                attributes: {color: 'Gold', size: 'Compact', material: 'Leather'}
              }
            ]}
          /> */}
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
