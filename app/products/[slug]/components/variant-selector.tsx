'use client'

import {useMemo} from 'react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import type {ProductPageVariant} from './product-types'
import styles from './styles.module.scss'

interface VariantSelectorProps {
  variants: ProductPageVariant[]
  attributeTypes: string[]
  selectedAttributes: Record<string, string>
  setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

const VariantSelector = ({
  variants,
  attributeTypes,
  selectedAttributes,
  setSelectedAttributes
}: VariantSelectorProps) => {
  const allOptions = useMemo(
    () => Object.fromEntries(attributeTypes.map(type => [type, Array.from(new Set(variants.map(variant => variant.attributes[type]))).sort()])),
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

  const selectedVariant = useMemo(
    () => variants.find(variant => attributeTypes.every(type => variant.attributes[type] === selectedAttributes[type])),
    [variants, selectedAttributes, attributeTypes]
  )

  if (!variants.length) return null

  return (
    <div className='mt-8 flex flex-col gap-6'>
      <div className='flex justify-between gap-4 border-t border-border pt-6'>
        <p className='mb-1 text-xs font-bold uppercase tracking-widest text-primary'>Stock</p>
        <p className={selectedVariant?.stock ? 'text-sm text-foreground' : 'text-sm text-destructive'}>
          {selectedVariant ? (selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : 'Out of stock') : 'Select a variant'}
        </p>
      </div>
      {attributeTypes.map(type => (
        <div key={type} className='flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-bold uppercase tracking-widest text-primary'>{type}</label>
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
                className={`text-sm font-normal capitalize ${!option.available ? styles.isDisabled : ''}`}
                disabled={!option.available}
              >
                {option.value}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default VariantSelector
