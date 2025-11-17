'use client'

import { useState, useMemo } from 'react'
import { TProduct } from '@/lib/types'
import { LandingProductCard } from './landing-product-card'

interface LandingProductGridProps {
  products: TProduct[]
  selectedCategory?: string | null
  sortBy?: string
}

export function LandingProductGrid({products, selectedCategory, sortBy = 'newest'}: LandingProductGridProps) {
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set())

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.category.name === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => Number(a.basePrice) - Number(b.basePrice))
        break
      case 'price-high':
        result.sort((a, b) => Number(b.basePrice) - Number(a.basePrice))
        break
      case 'popular':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
      default:
        // Newest first (isNew flag takes priority)
        // result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        result
    }

    return result
  }, [products, selectedCategory, sortBy])

  const handleWishlist = (productId: string) => {
    setWishlisted(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8'>
      {filteredAndSortedProducts.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 gap-4 animate-fadeInUp'>
          <p className='text-lg text-muted-foreground'>No products found</p>
          <p className='text-sm text-muted-foreground'>Try adjusting your filters or search</p>
        </div>
      ) : (
        <>
          <div className='mb-6 animate-fadeInUp'>
            <p className='text-sm text-muted-foreground'>Showing {filteredAndSortedProducts.length} products</p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredAndSortedProducts.map((product, index) => (
              <div key={product.id} className={`animate-fadeInUp ${index <= 11 ? `animate-stagger-${index + 1}` : ''}`}>
                <LandingProductCard
                  {...product}
                  sellerName={product.seller.storeName}
                  price={Number(product.basePrice)}
                  image={product.images[0]}
                  onWishlist={() => handleWishlist(product.id)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
