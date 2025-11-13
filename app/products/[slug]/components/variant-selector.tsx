'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

function VariantSelector({variants}: VariantSelectorProps) {
  // Get all unique attribute types
  const attributeTypes = useMemo(() => {
    const types = new Set<string>()
    variants.forEach(v => {
      Object.keys(v.attributes).forEach(key => types.add(key))
    })
    return Array.from(types)
  }, [variants])

  // Initialize selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    attributeTypes.forEach(type => {
      initial[type] = variants[0]?.attributes[type] || ''
    })
    return initial
  })

  // Find matching variant based on current selections
  const selectedVariant = useMemo(() => {
    return variants.find(v => Object.entries(selectedAttributes).every(([key, value]) => v.attributes[key] === value))
  }, [variants, selectedAttributes])

  // Get all unique option values per attribute
  const allOptions = useMemo(() => {
    const options: Record<string, string[]> = {}

    attributeTypes.forEach(attrType => {
      const uniqueValues = new Set<string>()
      variants.forEach(variant => {
        uniqueValues.add(variant.attributes[attrType])
      })
      options[attrType] = Array.from(uniqueValues).sort()
    })

    return options
  }, [variants, attributeTypes])

  const availableOptions = useMemo(() => {
    const options: Record<string, {value: string; available: boolean}[]> = {}

    attributeTypes.forEach(attrType => {
      options[attrType] = allOptions[attrType].map(value => {
        // and checking if any variant matches ALL other already-selected attributes
        const testSelection = {
          ...selectedAttributes,
          [attrType]: value
        }

        const isCompatible = variants.some(variant => {
          return Object.entries(testSelection).every(([key, selectedValue]) => variant.attributes[key] === selectedValue)
        })

        return {
          value,
          available: isCompatible
        }
      })
    })

    return options
  }, [variants, selectedAttributes, attributeTypes, allOptions])

  const handleAttributeSelect = (attrType: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrType]: value
    }))

    console.log(variants.find(v => Object.entries(selectedAttributes).every(([key, value]) => v.attributes[key] === value)))
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-sm uppercase tracking-widest text-muted-foreground'>Options</h2>
      </div>

      {attributeTypes.map(attrType => (
        <div key={attrType} className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <label className='text-xs uppercase tracking-widest text-muted-foreground'>{attrType}</label>
            {selectedAttributes[attrType] && (
              <Badge variant='secondary' className='text-xs'>
                {selectedAttributes[attrType]}
              </Badge>
            )}
          </div>

          <div className='flex flex-wrap gap-3'>
            {availableOptions[attrType]?.map(option => (
              <Button
                key={`${attrType}-${option.value}`}
                variant={selectedAttributes[attrType] === option.value ? 'default' : 'outline'}
                onClick={() => handleAttributeSelect(attrType, option.value)}
                className='capitalize text-sm font-normal'
                disabled={!option.available}
              >
                {option.value}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Stock Status and Price */}
      <div className='border-t border-border pt-6 mt-2'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-xs uppercase tracking-widest text-muted-foreground mb-1'>Stock Status</p>
            <p className={`text-sm font-medium ${selectedVariant && selectedVariant.stock > 0 ? 'text-foreground' : 'text-destructive'}`}>
              {selectedVariant ? (selectedVariant.stock > 0 ? `${selectedVariant.stock} Available` : 'Out of Stock') : 'Unavailable'}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-xs uppercase tracking-widest text-muted-foreground mb-1'>Price</p>
            <p className='text-lg font-light text-foreground'>{selectedVariant ? `$${selectedVariant.price.toFixed(2)}` : '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariantSelector
