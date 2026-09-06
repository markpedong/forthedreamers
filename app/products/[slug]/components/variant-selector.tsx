'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TVariant } from '@/lib/types'
import classNames from 'classnames'
import styles from './styles.module.scss'

interface VariantSelectorProps {
  variants?: TVariant[]
  attributeTypes?: string[]
  selectedAttributes: Record<string, string>
  setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

const VariantSelector = ({
  variants = [],
  attributeTypes,
  selectedAttributes,
  setSelectedAttributes
}: VariantSelectorProps) => {
  const computedAttributeTypes = useMemo(() => {
    if (!attributeTypes && variants.length > 0) {
      return Array.from(new Set(variants.flatMap(v => Object.keys(v.attributes))))
    }
    return attributeTypes || []
  }, [variants, attributeTypes])

  const allOptions = useMemo(
    () => Object.fromEntries(computedAttributeTypes.map(type => [type, Array.from(new Set(variants.map(v => v.attributes[type]))).sort()])),
    [variants, computedAttributeTypes]
  )

  const availableOptions = useMemo(
    () =>
      Object.fromEntries(
        computedAttributeTypes.map(type => [
          type,
          allOptions[type].map(value => ({
            value,
            available: variants.some(v =>
              Object.entries({...selectedAttributes, [type]: value}).every(([k, val]) => v.attributes[k] === val)
            )
          }))
        ])
      ),
    [allOptions, selectedAttributes, variants, computedAttributeTypes]
  )

  const handleSelect = (type: string, value: string) => setSelectedAttributes(prev => ({...prev, [type]: value}))

  const selectedVariant = useMemo(
    () => variants.find(v => computedAttributeTypes.every(type => v.attributes[type] === selectedAttributes[type])),
    [variants, selectedAttributes, computedAttributeTypes]
  )

  return (
    <div className='flex flex-col gap-6 mt-8'>
      <div className='border-t border-border pt-6 my-2 flex justify-between gap-4'>
        <p className='text-xs uppercase tracking-widest font-bold text-primary mb-1'>Stock Status</p>
        <p
          className={`text-sm font-light  ${selectedVariant?.stock && selectedVariant.stock > 0 ? 'text-accent-foreground' : 'text-destructive'}`}
        >
          {selectedVariant ? (selectedVariant.stock > 0 ? `${selectedVariant.stock} Available` : 'Out of Stock') : 'Unavailable'}
        </p>
      </div>
      {computedAttributeTypes.map(type => (
        <div key={type} className='flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <label className='text-xs uppercase tracking-widest text-primary font-bold'>{type}: </label>
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
                className={classNames('capitalize text-sm font-normal', {
                  [styles.isDisabled]: !option.available
                })}
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
