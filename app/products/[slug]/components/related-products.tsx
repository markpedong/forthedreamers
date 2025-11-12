"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RelatedProduct {
  id: string
  name: string
  price: number
  image: string
  rating: number
}

interface RelatedProductsProps {
  products: RelatedProduct[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("related-products-scroll")
    if (container) {
      const scrollAmount = 300
      const newPosition =
        direction === "left" ? Math.max(0, scrollPosition - scrollAmount) : scrollPosition + scrollAmount
      container.scrollLeft = newPosition
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
        <p className="text-muted-foreground">You might also like these items</p>
      </div>

      <div className="relative">
        {/* Scroll Container */}
        <div id="related-products-scroll" className="flex gap-4 overflow-x-auto scroll-smooth pb-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3">
                <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                  <span className="font-bold text-foreground">${product.price.toFixed(2)}</span>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 bg-background border-border hover:bg-muted z-10"
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 bg-background border-border hover:bg-muted z-10"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  )
}
