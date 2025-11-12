"use client"

import { Star } from "lucide-react"

interface ProductOverviewProps {
  product: {
    name: string
    brand: string
    price: number
    originalPrice: number
    rating: number
    reviewCount: number
  }
}

export function ProductOverview({ product }: ProductOverviewProps) {
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
        <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
        {discountPercentage > 0 && (
          <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
            Save {discountPercentage}%
          </span>
        )}
      </div>
    </div>
  )
}
