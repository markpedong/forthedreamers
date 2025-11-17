'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingHeroProps {
  onSearch?: (query: string) => void
}

export function LandingHero({onSearch}: LandingHeroProps) {
  return (
    <section className='relative w-full overflow-hidden bg-background border-b border-border'>
      <div className='max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-16'>
          {/* Left: Text & CTA */}
          <div className='flex flex-col gap-6 max-w-2xl animate-fadeInUp'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-6xl lg:text-7xl font-light text-balance leading-tight text-foreground'>Curated Collections</h1>
              <p className='text-base text-muted-foreground font-light max-w-lg leading-relaxed'>
                Discover premium products from independent sellers. Shop handpicked items from artisans and creators worldwide.
              </p>
            </div>

            {/* CTAs */}
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-4'>
              <Button
                size='lg'
                className='bg-foreground hover:bg-foreground/90 text-background rounded-lg px-8 transition-all duration-200 hover:shadow-lg'
              >
                Browse
              </Button>
              <button className='text-foreground hover:text-primary transition-colors font-light underline underline-offset-4'>
                Become a Seller
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-4 max-w-2xl animate-fadeInUp' style={{animationDelay: '0.1s'}}>
            <div className='relative w-full'>
              <div className='relative flex items-center'>
                <Search className='absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none' />
                <input
                  type='text'
                  placeholder='Search products...'
                  onChange={e => onSearch?.(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 focus:border-foreground transition-all duration-200'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
