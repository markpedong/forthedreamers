'use client'

import { type FC, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { IMG_FALLBACK } from '@/constants'
import ImagePlaceholder from '@/components/reusable/image-placeholder'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
}

const ProductGallery: FC<ProductGalleryProps> = ({images}) => {
  const validImages = images.length ? images : [IMG_FALLBACK]
  const hasMultiple = validImages.length > 1
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const currentImage = validImages[selectedIndex]
  const hasError = imageErrors.has(selectedIndex)

  const handlePrev = () => setSelectedIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1))
  const handleNext = () => setSelectedIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1))

  const handleImageLoad = () => setLoading(false)
  const handleImageError = () => {
    setLoading(false)
    setImageErrors(prev => new Set(prev).add(selectedIndex))
  }

  const renderMainImage = () =>
    hasError ? (
      <ImagePlaceholder hasError />
    ) : (
      <Image
        src={currentImage || '/placeholder.svg'}
        alt='Product image'
        fill
        className='object-cover transition-transform duration-300 group-hover:scale-105'
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority
      />
    )

  const renderThumbnails = () =>
    validImages.map((img, idx) => {
      const thumbError = imageErrors.has(idx)
      return (
        <button
          key={idx}
          onClick={() => {
            setSelectedIndex(idx)
            setLoading(true)
          }}
          className={cn(
            'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
            selectedIndex === idx
              ? 'border-primary ring-2 ring-primary/50 scale-105'
              : 'border-border hover:border-muted-foreground hover:scale-102'
          )}
          aria-label={`View image ${idx + 1}`}
          aria-pressed={selectedIndex === idx}
        >
          {thumbError ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={img || '/placeholder.svg'}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className='object-cover'
              onError={() => setImageErrors(prev => new Set(prev).add(idx))}
            />
          )}
        </button>
      )
    })

  return (
    <div className='flex flex-col gap-6' role='region' aria-label='Product image gallery'>
      <div className='group relative overflow-hidden rounded-xl border border-border bg-background aspect-square shadow-sm hover:shadow-md transition-shadow duration-300'>
        {loading && <Skeleton className='absolute inset-0' />}
        {renderMainImage()}

        {hasMultiple && (
          <>
            <Button
              variant='outline'
              size='icon'
              className='absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-background/90 backdrop-blur-sm hover:bg-background transition-all duration-200'
              onClick={handlePrev}
              aria-label='Previous image'
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-background/90 backdrop-blur-sm hover:bg-background transition-all duration-200'
              onClick={handleNext}
              aria-label='Next image'
            >
              <ChevronRight size={20} />
            </Button>

            <div className='absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-foreground'>
              {selectedIndex + 1} / {validImages.length}
            </div>
          </>
        )}
      </div>

      {hasMultiple && <div className='flex gap-2 overflow-x-auto py-2 px-1'>{renderThumbnails()}</div>}
    </div>
  )
}

export default ProductGallery
