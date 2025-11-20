'use client'

import { FC } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { TProduct } from '@/lib/types'

const lifestyle = {
  main: {
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop',
    alt: 'Lifestyle Main',
    title: 'Winter Solstice'
  },
  side: [
    {
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
      alt: 'Lifestyle Detail 1'
    },
    {
      src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop',
      alt: 'Lifestyle Detail 2'
    }
  ]
}

const ProductCard: FC<TProduct> = ({name, images, basePrice, variants}) => (
  <div className='group cursor-pointer space-y-3'>
    <AspectRatio ratio={3 / 4} className='overflow-hidden rounded-sm bg-neutral-100'>
      <Image src={images[0]} alt={name} fill className='object-cover transition-transform duration-700 group-hover:scale-105' />
    </AspectRatio>
    <div>
      <h3 className='font-medium'>{name}</h3>
      <p className='text-sm text-neutral-500'>{basePrice ?? variants?.[0].price}</p>
    </div>
  </div>
)

const LifestyleImg: FC<{src: string; alt: string; title?: string}> = ({src, alt, title}) => (
  <div className='relative overflow-hidden rounded-sm group h-full'>
    <Image src={src} alt={alt} fill className='object-cover transition-transform duration-700 group-hover:scale-105' />
    {title && (
      <div className='absolute bottom-0 left-0 p-8 text-white'>
        <p className='text-sm uppercase tracking-widest mb-2'>Editorial</p>
        <h3 className='text-3xl font-light'>{title}</h3>
      </div>
    )}
  </div>
)

const LandingPage: FC<{products: TProduct[]}> = ({products = []}) => (
  <main className='min-h-screen'>
    {/* HERO */}
    <section className='relative h-[85vh] flex items-center justify-center'>
      <Image
        src='https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop'
        alt='Hero'
        fill
        className='object-cover'
        priority
      />
      <div className='absolute inset-0 bg-black/10' />

      <div className='relative z-10 text-center text-white space-y-6 px-4'>
        <Badge className='bg-white/20 text-white border-none backdrop-blur-sm px-4 py-1 text-xs tracking-widest'>New Collection</Badge>

        <h1 className='text-5xl md:text-7xl font-light tracking-tight'>
          Quiet Luxury for <br />
          <span className='font-medium'>The Modern Soul</span>
        </h1>

        <p className='text-lg md:text-xl text-white/90 font-light max-w-lg mx-auto'>
          Curated essentials designed for comfort, style, and the moments in between.
        </p>

        <Button size='lg' className='bg-white text-black rounded-full px-8 hover:bg-neutral-200'>
          Explore Collection
        </Button>
      </div>
    </section>

    {/* PRODUCTS */}
    <section className='py-24 px-4 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-end mb-12'>
        <div>
          <h2 className='text-3xl font-light tracking-tight'>Curated Essentials</h2>
          <p className='text-neutral-500'>Timeless pieces for your everyday wardrobe.</p>
        </div>

        <Button variant='link' className='p-0 h-auto text-neutral-900 group'>
          View All Products
          <ArrowRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1' />
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {products.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </section>

    {/* LIFESTYLE GRID */}
    <section className='py-24 bg-neutral-50'>
      <div className='px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 h-auto md:h-[600px]'>
        <div className='md:col-span-8 h-[400px] md:h-full'>
          <LifestyleImg {...lifestyle.main} />
        </div>

        <div className='md:col-span-4 flex flex-col gap-4'>
          {lifestyle.side.map((img, i) => (
            <LifestyleImg key={i} {...img} />
          ))}
        </div>
      </div>
    </section>

    {/* NEWSLETTER */}
    <section className='py-32 px-4 text-center max-w-7xl mx-auto'>
      <div className='max-w-md mx-auto space-y-6'>
        <h2 className='text-3xl font-light tracking-tight'>Join the Community</h2>
        <p className='text-neutral-500'>Sign up for early access to new drops and exclusive editorial content.</p>

        <div className='flex gap-2'>
          <Input
            type='email'
            placeholder='Enter your email'
            className='rounded-full bg-neutral-50 border-neutral-200 focus-visible:ring-neutral-400'
          />
          <Button className='rounded-full px-6'>Subscribe</Button>
        </div>
      </div>
    </section>
  </main>
)

export default LandingPage
