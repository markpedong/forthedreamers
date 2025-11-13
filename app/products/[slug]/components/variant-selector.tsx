'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TVariant } from '@/lib/types'
import { useAppDispatch } from '@/redux/store'
import { setSelectedVariant } from '@/redux/features/appSlice'

interface VariantSelectorProps {
  variants: TVariant[]
}

const VariantSelector = ({variants}: VariantSelectorProps) => {
  const dispatch = useAppDispatch()
  const attributeTypes = useMemo(() => Array.from(new Set(variants.flatMap(v => Object.keys(v.attributes)))), [variants])

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() =>
    Object.fromEntries(attributeTypes.map(type => [type, variants[0]?.attributes[type] || '']))
  )

  const selectedVariant = useMemo(
    () => variants.find(v => attributeTypes.every(type => v.attributes[type] === selectedAttributes[type])),
    [variants, selectedAttributes, attributeTypes]
  )

  const allOptions = useMemo(
    () => Object.fromEntries(attributeTypes.map(type => [type, Array.from(new Set(variants.map(v => v.attributes[type]))).sort()])),
    [variants, attributeTypes]
  )

  const availableOptions = useMemo(
    () =>
      Object.fromEntries(
        attributeTypes.map(type => [
          type,
          allOptions[type].map(value => ({
            value,
            available: variants.some(v =>
              Object.entries({...selectedAttributes, [type]: value}).every(([k, val]) => v.attributes[k] === val)
            )
          }))
        ])
      ),
    [allOptions, selectedAttributes, variants, attributeTypes]
  )

  const handleSelect = (type: string, value: string) => setSelectedAttributes(prev => ({...prev, [type]: value}))

  useEffect(() => {
    if (selectedVariant) {
      dispatch(setSelectedVariant(selectedVariant))
    }

    return () => {
      dispatch(setSelectedVariant(null))
    }
  }, [selectedVariant])

  return (
    <div className='flex flex-col gap-6'>
      {attributeTypes.map(type => (
        <div key={type} className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <label className='text-xs uppercase tracking-widest text-muted-foreground'>{type}</label>
            {selectedAttributes[type] && (
              <Badge variant='secondary' className='text-xs'>
                {selectedAttributes[type]}
              </Badge>
            )}
          </div>
          <div className='flex flex-wrap gap-3'>
            {availableOptions[type]?.map(option => (
              <Button
                key={`${type}-${option.value}`}
                variant={selectedAttributes[type] === option.value ? 'default' : 'outline'}
                onClick={() => handleSelect(type, option.value)}
                className='capitalize text-sm font-normal'
                disabled={!option.available}
              >
                {option.value}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <div className='border-t border-border pt-6 mt-2 flex justify-between gap-4'>
        <div>
          <p className='text-xs uppercase tracking-widest text-muted-foreground mb-1'>Stock Status</p>
          <p
            className={`text-sm font-medium ${selectedVariant?.stock && selectedVariant.stock > 0 ? 'text-foreground' : 'text-destructive'}`}
          >
            {selectedVariant ? (selectedVariant.stock > 0 ? `${selectedVariant.stock} Available` : 'Out of Stock') : 'Unavailable'}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-xs uppercase tracking-widest text-muted-foreground mb-1'>Price</p>
          <p className='text-lg font-light text-foreground'>{selectedVariant ? `$${selectedVariant.price.toFixed(2)}` : '—'}</p>
        </div>
      </div>
    </div>
  )
}

export default VariantSelector
