import React, { Dispatch, FC, SetStateAction } from 'react'
import { Button, Chip } from '@heroui/react'
import { Variations } from '@prisma/client'

interface Props {
  variations: Variations[]
  selectedVariation: Variations | null
  onVariationChange: Dispatch<SetStateAction<any>>
}

const VariationSelector: FC<Props> = ({ variations, selectedVariation, onVariationChange }) => {
  if (!variations.length) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Variations</span>
        {selectedVariation && (
          <span className="text-sm text-default-500">
            {selectedVariation.stock > 10
              ? 'In Stock'
              : selectedVariation.stock > 0
              ? `Only ${selectedVariation.stock} left`
              : 'Out of Stock'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {variations.map(variation => (
          <Chip
            key={variation.id}
            variant={selectedVariation?.id === variation.id ? 'solid' : 'bordered'}
            color={selectedVariation?.id === variation.id ? 'primary' : 'default'}
            onClick={() => onVariationChange(variation)}
            isDisabled={variation.stock <= 0}
            className="cursor-pointer"
          >
            {variation.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}

export default VariationSelector
