'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TVariant } from '@/lib/types'
import { useAppDispatch } from '@/redux/store'
import { setSelectedVariant } from '@/redux/features/appSlice'
import classNames from 'classnames'
import styles from './styles.module.scss'

interface VariantSelectorProps {
  variants?: TVariant[]
}

const VariantSelector = ({variants = []}: VariantSelectorProps) => {
  const dispatch = useAppDispatch()
  const attributeTypes = useMemo(() => Array.from(new Set(variants.flatMap(v => Object.keys(v.attributes)))), [variants])
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

  useEffect(() => {
    const defaultAttrs = Object.fromEntries(attributeTypes.map(type => [type, variants[0]?.attributes[type] || '']))
    setSelectedAttributes(defaultAttrs)
  }, [variants, attributeTypes])

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
    dispatch(setSelectedVariant(selectedVariant || null))
  }, [dispatch, selectedVariant])

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
      {attributeTypes.map(type => (
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
