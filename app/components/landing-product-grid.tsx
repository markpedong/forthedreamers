'use client';

import { TProduct } from '@/lib/types';
import { LandingProductCard } from './landing-product-card';

interface LandingProductGridProps {
  products: TProduct[];
  selectedCategory?: string | null;
  sortBy?: string;
}

export const LandingProductGrid = ({ products, selectedCategory, sortBy = 'newest' }: LandingProductGridProps) => {
  const filteredAndSortedProducts = selectedCategory
    ? products.filter(product => product.category.name === selectedCategory)
    : [...products];

  if (sortBy === 'price-low') {
    filteredAndSortedProducts.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
  } else if (sortBy === 'price-high') {
    filteredAndSortedProducts.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
  } else if (sortBy === 'popular') {
    filteredAndSortedProducts.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  } else if (sortBy === 'rating') {
    filteredAndSortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {filteredAndSortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fadeInUp">
          <p className="text-lg text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search</p>
        </div>
      ) : (
        <>
          <div className="mb-6 animate-fadeInUp">
            <p className="text-sm text-muted-foreground">Showing {filteredAndSortedProducts.length} products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <div key={product.id} className={`animate-fadeInUp ${index <= 11 ? `animate-stagger-${index + 1}` : ''}`}>
                <LandingProductCard
                  {...product}
                  sellerName={product.seller.storeName}
                  price={Number(product.basePrice)}
                  image={product.images[0]}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
