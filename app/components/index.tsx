'use client'

import { FC, useState } from 'react'
import { LandingHero } from './landing-hero'
import { LandingFilters } from './landing-filters'
import { TProduct } from '@/lib/types'
import { LandingProductGrid } from './landing-product-grid'

const LandingPage: FC<{products: TProduct[]}> = ({products = []}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const categories = [
    {id: 'electronics', name: 'Electronics', count: 24},
    {id: 'accessories', name: 'Accessories', count: 18},
    {id: 'home', name: 'Home & Living', count: 32},
    {id: 'fashion', name: 'Fashion', count: 27},
    {id: 'beauty', name: 'Beauty', count: 15}
  ]

  return (
    <main className='min-h-screen bg-background'>
      {/* Hero Section */}
      <LandingHero />

      {/* Filters Section */}
      <LandingFilters categories={categories} onCategoryChange={setSelectedCategory} onSortChange={setSortBy} />

      {/* Product Grid */}
      <LandingProductGrid products={products} selectedCategory={selectedCategory} sortBy={sortBy} />

      {/* Newsletter Section */}
      <section className='bg-background border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-6 max-w-2xl'>
            <div className='flex flex-col gap-3'>
              <h2 className='text-4xl lg:text-5xl font-light text-foreground'>Stay Informed</h2>
              <p className='text-muted-foreground font-light text-base'>
                Subscribe to get updates on new sellers, collections, and curated picks.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 pt-2'>
              <input
                type='email'
                placeholder='your@email.com'
                className='flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30'
              />
              <button className='px-6 py-3 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-light transition-colors whitespace-nowrap'>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingPage
