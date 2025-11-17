'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { IMG_FALLBACK } from '@/constants'

interface LandingProductCardProps {
  id: string
  name: string
  sellerName: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isSale?: boolean
  onWishlist?: () => void
}

export function LandingProductCard({
  id,
  name,
  sellerName,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  isNew,
  isSale,
  onWishlist
}: LandingProductCardProps) {
  const [wishlist, setWishlist] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleWishlist = () => {
    setWishlist(!wishlist)
    onWishlist?.()
  }

  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className='flex flex-col gap-3 h-full'>
      <div className='relative w-full bg-card border border-border rounded-lg overflow-hidden aspect-square flex items-center justify-center group'>
        {imageError ? (
          <div className='w-full h-full flex items-center justify-center bg-muted'>
            <div className='text-center'>
              <p className='text-sm text-muted-foreground'>Image unavailable</p>
            </div>
          </div>
        ) : (
          <Image
            src={image || IMG_FALLBACK}
            alt={name}
            fill
            className='object-cover transition-opacity duration-500 group-hover:opacity-80'
            onError={() => setImageError(true)}
          />
        )}

        {(isNew || isSale) && (
          <div className='absolute top-3 left-3 flex gap-2'>
            {isNew && <span className='px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full'>New</span>}
            {isSale && discountPercent > 0 && (
              <span className='px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full'>-{discountPercent}%</span>
            )}
          </div>
        )}

        <button
          onClick={e => {
            e.preventDefault()
            handleWishlist()
          }}
          className='absolute top-3 right-3 p-2 bg-card/90 hover:bg-card rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100'
        >
          <Heart className={`w-5 h-5 ${wishlist ? 'fill-current text-accent' : 'text-foreground'}`} />
        </button>
      </div>

      <div className='flex flex-col gap-2 flex-1'>
        {/* Seller Name */}
        <p className='text-xs uppercase tracking-widest text-muted-foreground font-medium'>{sellerName}</p>

        {/* Product Name */}
        <h3 className='text-sm font-medium text-foreground line-clamp-2'>{name}</h3>

        {/* Rating */}
        {rating && (
          <div className='flex items-center gap-2'>
            <div className='flex gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <span key={i} className='text-xs'>
                  {i < Math.floor(rating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className='text-xs text-muted-foreground'>({reviewCount || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className='flex items-baseline gap-2 mt-auto pt-2'>
          <span className='text-base font-semibold text-foreground'>${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className='text-xs text-muted-foreground line-through'>${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
