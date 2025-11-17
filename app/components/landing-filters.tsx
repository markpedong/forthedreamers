'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  name: string
  count: number
}

interface LandingFiltersProps {
  categories: Category[]
  onCategoryChange?: (categoryId: string | null) => void
  onSortChange?: (sortBy: string) => void
}

export function LandingFilters({categories, onCategoryChange, onSortChange}: LandingFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    onCategoryChange?.(categoryId)
  }

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy)
    onSortChange?.(sortBy)
  }

  const sortOptions = [
    {value: 'newest', label: 'Newest'},
    {value: 'price-low', label: 'Price: Low to High'},
    {value: 'price-high', label: 'Price: High to Low'},
    {value: 'popular', label: 'Most Popular'},
    {value: 'rating', label: 'Highest Rated'}
  ]

  return (
    <div className='border-b border-border bg-muted/30'>
      <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4'>
          {/* Filter Header */}
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-foreground'>Filters & Sort</h3>
            <Button onClick={() => setShowFilters(!showFilters)} variant='outline' size='sm' className='lg:hidden'>
              <ChevronDown className='w-4 h-4' />
            </Button>
          </div>

          {/* Filters */}
          <div className={`flex flex-col lg:flex-row gap-6 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            {/* Categories */}
            <div className='flex flex-col gap-3'>
              <p className='text-xs uppercase tracking-widest text-muted-foreground font-medium'>Categories</p>
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === null
                      ? 'bg-foreground text-background'
                      : 'bg-card border border-border text-foreground hover:border-foreground'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-foreground text-background'
                        : 'bg-card border border-border text-foreground hover:border-foreground'
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className='flex flex-col gap-3'>
              <p className='text-xs uppercase tracking-widest text-muted-foreground font-medium'>Sort By</p>
              <div className='relative w-full sm:w-48'>
                <select
                  value={selectedSort}
                  onChange={e => handleSortChange(e.target.value)}
                  className='w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer'
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
