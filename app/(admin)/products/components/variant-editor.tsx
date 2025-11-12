//@ts-nocheck
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Plus, X, Edit } from 'lucide-react'
import type { VariantEditorProps } from '@/lib/types'
import type { Variant } from '@/generated/prisma'

const DEFAULT_VARIANT: Omit<Partial<Variant>, 'id' | 'productId' | 'createdAt' | 'updatedAt'> = {
  name: '',
  price: 0,
  discountedPrice: null,
  coupon: null,
  stock: 0,
  image: null,
  attributes: {}
}

// Helper to safely get attributes as object
const getAttributes = (attrs: Variant['attributes']): Record<string, string> => {
  if (!attrs || typeof attrs !== 'object') return {}
  return attrs as Record<string, string>
}

export default function VariantEditor({variants, onVariantsChange}: VariantEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({})
  const [editDialogOpen, setEditDialogOpen] = useState<Record<string, boolean>>({})
  const [editingAttribute, setEditingAttribute] = useState<{variantId: string; key: string} | null>(null)
  const [editLabel, setEditLabel] = useState<string>('')
  const [editValue, setEditValue] = useState<string>('')
  const [attributeLabel, setAttributeLabel] = useState<Record<string, string>>({})
  const [attributeValue, setAttributeValue] = useState<Record<string, string>>({})

  const handleAddVariant = () => {
    const newVariant: Partial<Variant> = {
      id: `temp-${Date.now()}`,
      productId: variants[0]?.productId || '',
      ...DEFAULT_VARIANT
    }
    onVariantsChange([...variants, newVariant])
  }

  const handleUpdateVariant = (
    id: string,
    field: keyof Omit<Partial<Variant>, 'id' | 'productId' | 'createdAt' | 'updatedAt'>,
    value: any
  ) => {
    onVariantsChange(variants.map(v => (v.id === id ? {...v, [field]: value} : v)))
  }

  const handleUpdateAttributes = (variantId: string, key: string, value: string) => {
    onVariantsChange(variants.map(v => (v.id === variantId ? {...v, attributes: {...getAttributes(v.attributes), [key]: value}} : v)))
  }

  const handleRemoveAttribute = (variantId: string, key: string) => {
    onVariantsChange(
      variants.map(v => {
        if (v.id === variantId) {
          const attrs = {...getAttributes(v.attributes)}
          delete attrs[key]
          return {...v, attributes: attrs}
        }
        return v
      })
    )
  }

  const handleDeleteVariant = (id: string) => {
    onVariantsChange(variants.filter(v => v.id !== id))
  }

  const handleSaveEditAttribute = (variantId: string, oldKey: string) => {
    if (!editLabel.trim() || !editValue.trim()) return

    const currentAttributes = getAttributes(variants.find(v => v.id === variantId)?.attributes)

    if (editLabel.trim() !== oldKey && currentAttributes[editLabel.trim()]) {
      alert(`Attribute key "${editLabel.trim()}" already exists.`)
      return
    }

    onVariantsChange(
      variants.map(v => {
        if (v.id === variantId) {
          const updatedAttributes = {...currentAttributes}
          delete updatedAttributes[oldKey]
          updatedAttributes[editLabel.trim()] = editValue.trim()
          return {...v, attributes: updatedAttributes}
        }
        return v
      })
    )

    setEditingAttribute(null)
    setEditLabel('')
    setEditValue('')
    setEditDialogOpen(prev => ({...prev, [`${variantId}-${oldKey}`]: false}))
  }

  const handleAddAttributeFromDialog = (variantId: string) => {
    const labelKey = `${variantId}-label`
    const valueKey = `${variantId}-value`
    const label = attributeLabel[labelKey]?.trim()
    const value = attributeValue[valueKey]?.trim()
    if (!label || !value) return

    const currentAttributes = getAttributes(variants.find(v => v.id === variantId)?.attributes)

    if (currentAttributes[label]) {
      alert(`Attribute key "${label}" already exists.`)
      return
    }

    onVariantsChange(variants.map(v => (v.id === variantId ? {...v, attributes: {...currentAttributes, [label]: value}} : v)))

    setAttributeLabel(prev => {
      const updated = {...prev}
      delete updated[labelKey]
      return updated
    })
    setAttributeValue(prev => {
      const updated = {...prev}
      delete updated[valueKey]
      return updated
    })
    setDialogOpen(prev => ({...prev, [variantId]: false}))
  }

  return (
    <div className='space-y-3'>
      {variants.map(variant => (
        <Card key={variant.id} className='p-4 relative'>
          {/* Delete Variant Button Top Right */}
          <div className='absolute top-2 right-2'>
            <Button variant='ghost' size='sm' onClick={() => handleDeleteVariant(variant.id)} className='text-destructive p-1'>
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>

          <div className='space-y-4'>
            {/* Name & Image */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Variant Name</label>
                <Input
                  value={variant.name ?? ''}
                  onChange={e => handleUpdateVariant(variant.id, 'name', e.target.value)}
                  placeholder='e.g., Red S Size'
                  className='mt-1'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Image URL</label>
                <Input
                  value={variant.image ?? ''}
                  onChange={e => handleUpdateVariant(variant.id, 'image', e.target.value)}
                  placeholder='https://...'
                  className='mt-1'
                />
              </div>
            </div>

            {/* Price, Discount, Stock, Coupon */}
            <div className='grid grid-cols-4 gap-4'>
              <div>
                <label className='text-sm font-medium'>Price</label>
                <Input
                  type='number'
                  value={variant.price ?? 0}
                  onChange={e => handleUpdateVariant(variant.id, 'price', Number(e.target.value))}
                  placeholder='0'
                  className='mt-1'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Discounted Price</label>
                <Input
                  type='number'
                  value={variant.discountedPrice ?? ''}
                  onChange={e => handleUpdateVariant(variant.id, 'discountedPrice', e.target.value ? Number(e.target.value) : null)}
                  placeholder='Optional'
                  className='mt-1'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Stock</label>
                <Input
                  type='number'
                  value={variant.stock ?? 0}
                  onChange={e => handleUpdateVariant(variant.id, 'stock', Number(e.target.value))}
                  placeholder='0'
                  className='mt-1'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Coupon</label>
                <Input
                  value={variant.coupon ?? ''}
                  onChange={e => handleUpdateVariant(variant.id, 'coupon', e.target.value || null)}
                  placeholder='Optional'
                  className='mt-1'
                />
              </div>
            </div>

            {/* Attributes */}
            <div className='border-t pt-2 relative'>
              {/* Section header with Add Attribute button */}
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-foreground'>
                  Attributes ({Object.keys(getAttributes(variant.attributes)).length})
                </span>

                <Dialog
                  open={dialogOpen[variant.id] || false}
                  onOpenChange={open => setDialogOpen(prev => ({...prev, [variant.id]: open}))}
                >
                  <DialogTrigger asChild>
                    <Button variant='outline' size='sm' className='h-8 px-2'>
                      <Plus className='w-4 h-4 mr-1' /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-sm'>
                    <DialogHeader>
                      <DialogTitle>Add Attribute</DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-col gap-2'>
                      <label className='text-xs font-medium'>Label</label>
                      <Input
                        placeholder='Label'
                        value={attributeLabel[`${variant.id}-label`] || ''}
                        onChange={e => setAttributeLabel(prev => ({...prev, [`${variant.id}-label`]: e.target.value}))}
                      />
                      <label className='text-xs font-medium'>Value</label>
                      <Input
                        placeholder='Value'
                        value={attributeValue[`${variant.id}-value`] || ''}
                        onChange={e => setAttributeValue(prev => ({...prev, [`${variant.id}-value`]: e.target.value}))}
                      />
                      <Button onClick={() => handleAddAttributeFromDialog(variant.id)}>Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className='space-y-2'>
                {Object.entries(getAttributes(variant.attributes)).map(([key, value]) => (
                  <div key={key} className='flex items-center justify-between gap-2'>
                    <div className='flex-1 flex items-center gap-2'>
                      <span className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>{key}:</span>
                      <Input value={value} readOnly className='h-8 text-sm flex-1' />
                    </div>
                    <div className='flex gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setEditingAttribute({variantId: variant.id, key})
                          setEditLabel(key)
                          setEditValue(value)
                          setEditDialogOpen(prev => ({...prev, [`${variant.id}-${key}`]: true}))
                        }}
                        className='h-8 w-8 p-0'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveAttribute(variant.id, key)}
                        className='h-8 w-8 p-0 text-destructive'
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    </div>

                    {/* Edit Dialog */}
                    {editingAttribute?.variantId === variant.id && editingAttribute.key === key && (
                      <Dialog
                        open={editDialogOpen[`${variant.id}-${key}`] || false}
                        onOpenChange={open => setEditDialogOpen(prev => ({...prev, [`${variant.id}-${key}`]: open}))}
                      >
                        <DialogContent className='sm:max-w-sm'>
                          <DialogHeader>
                            <DialogTitle>Edit Attribute</DialogTitle>
                          </DialogHeader>
                          <div className='flex flex-col gap-2'>
                            <label className='text-xs font-medium'>Label</label>
                            <Input placeholder='Label' value={editLabel} onChange={e => setEditLabel(e.target.value)} />
                            <label className='text-xs font-medium'>Value</label>
                            <Input placeholder='Value' value={editValue} onChange={e => setEditValue(e.target.value)} />
                            <Button onClick={() => handleSaveEditAttribute(variant.id, key)}>Save</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={handleAddVariant} variant='outline' className='w-full mt-2'>
        <Plus className='w-4 h-4 mr-2' /> Add Partial Variant
      </Button>
    </div>
  )
}
