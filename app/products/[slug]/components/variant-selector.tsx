"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Variant {
  id: string
  name: string
  price: number
  stock: number
  image?: string
  attributes: Record<string, string>
}

interface VariantSelectorProps {
  variants: Variant[]
}

export function VariantSelector({ variants }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0])

  // Group variants by attribute type
  const attributeTypes = Object.keys(variants[0]?.attributes || {})

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Options</h2>
      </div>

      {attributeTypes.map((attrType) => (
        <div key={attrType} className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground capitalize">{attrType}</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant.id === variant.id ? "default" : "outline"}
                onClick={() => setSelectedVariant(variant)}
                className="capitalize"
                disabled={variant.stock === 0}
              >
                {variant.attributes[attrType]}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Stock Status */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Stock:</span>{" "}
          <span className={selectedVariant.stock > 0 ? "text-green-600" : "text-destructive"}>
            {selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : "Out of stock"}
          </span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Price: <span className="font-semibold text-foreground">${selectedVariant.price.toFixed(2)}</span>
        </p>
      </div>
    </div>
  )
}
