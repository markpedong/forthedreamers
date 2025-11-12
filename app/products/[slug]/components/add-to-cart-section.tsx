"use client"

import { useState } from "react"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface AddToCartSectionProps {
  product: {
    id: string
    name: string
    price: number
  }
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    })
  }

  const handleBuyNow = () => {
    toast({
      title: "Proceeding to checkout",
      description: `${quantity} × ${product.name}`,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Quantity</label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 w-fit">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-10 w-10 p-0"
          >
            −
          </Button>
          <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>
          <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 p-0">
            +
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
          <ShoppingCart size={20} />
          Add to Cart
        </Button>
        <Button size="lg" variant="outline" className="flex-1 bg-transparent" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>

      {/* Wishlist Button */}
      <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => setIsWishlisted(!isWishlisted)}>
        <Heart size={20} className={isWishlisted ? "fill-destructive text-destructive" : ""} />
        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </Button>

      {/* Trust Badges */}
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>✓ Free shipping on orders over $50</p>
        <p>✓ 30-day money-back guarantee</p>
        <p>✓ 2-year warranty included</p>
      </div>
    </div>
  )
}
