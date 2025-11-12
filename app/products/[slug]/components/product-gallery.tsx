'use client'

import { FC, useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { IMG_FALLBACK } from '@/constants'

interface ProductGalleryProps {
  images: string[]
}

const ProductGallery: FC<ProductGalleryProps> = ({images}) => {
  const validImages = images.length ? images : [IMG_FALLBACK]
  const hasMultiple = validImages.length > 1
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentImage = validImages[selectedIndex]

  const handlePrev = () => setSelectedIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1))
  const handleNext = () => setSelectedIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1))

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative overflow-hidden rounded-lg border border-border bg-muted aspect-square'>
        {!loaded && <Skeleton className='absolute inset-0' />}
        <Image
          src={currentImage}
          alt='Product image'
          fill
          className='object-cover'
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          priority
        />

        {hasMultiple && (
          <>
            <Button
              variant='outline'
              size='icon'
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background'
              onClick={handlePrev}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background'
              onClick={handleNext}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                selectedIndex === idx ? 'border-primary' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className='object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery
