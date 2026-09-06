'use client'
import { FC, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ImagePlaceholder from '@/components/reusable/image-placeholder'
import type { LandingProduct } from './index'
const ProductCard: FC<LandingProduct> = ({name, images, basePrice, variants, slug}) => {
  const [isImageInvalid, setIsImageInvalid] = useState(false)
  const imageSrc = images && images.length > 0 ? images[0] : null
  const showImage = imageSrc && !isImageInvalid
  return (
    <Link href={`/products/${slug}`} className='group cursor-pointer space-y-3'>
      <AspectRatio ratio={3 / 4} className='overflow-hidden rounded-sm '>
        {showImage ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes='(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
            className='object-cover transition-transform duration-700 group-hover:scale-105'
            onError={() => setIsImageInvalid(true)}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </AspectRatio>
      <div>
        <h3 className='font-medium'>{name}</h3>
        <p className='text-sm text-neutral-500'>$ {basePrice ?? variants?.[0].price}</p>
      </div>
    </Link>
  )
}
export default ProductCard
