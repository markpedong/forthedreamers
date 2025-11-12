//@ts-nocheck
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2, Plus, X, Check, Edit } from 'lucide-react'
import type { VariantEditorProps } from '@/lib/types'
import type { Variant } from '@/generated/prisma'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

const DEFAULT_VARIANT: Omit<Partial<Variant>, 'id' | 'productId' | 'createdAt' | 'updatedAt'> = {
  name: '',
  price: 0,
  discountedPrice: null,
  coupon: null,
  stock: 0,
  image: null,
  attributes: {}
}

const getAttributes = (attrs: Variant['attributes']): Record<string, string> => {
  if (!attrs || typeof attrs !== 'object') return {}
  return attrs as Record<string, string>
}

export default function VariantEditor({variants, onVariantsChange}: VariantEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({})
  const [editingAttrKey, setEditingAttrKey] = useState<string | null>(null)
  const [editingAttrValue, setEditingAttrValue] = useState<string>('')

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

  const handleDeleteAttribute = (variantId: string, key: string) => {
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

  const handleSaveAttributeEdit = (variantId: string, key: string) => {
    if (!editingAttrValue.trim()) return
    onVariantsChange(
      variants.map(v =>
        v.id === variantId
          ? {
              ...v,
              attributes: {...getAttributes(v.attributes), [key]: editingAttrValue.trim()}
            }
          : v
      )
    )
    setEditingAttrKey(null)
    setEditingAttrValue('')
  }

  const handleDeleteVariant = (id: string) => {
    onVariantsChange(variants.filter(v => v.id !== id))
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
                    <div className='flex flex-col gap-2'>
                      <Label htmlFor={`label-${variant.id}`}>Label</Label>
                      <Input
                        id={`label-${variant.id}`}
                        placeholder='Label'
                        value={attributeLabel[`${variant.id}-label`] || ''}
                        onChange={e => setAttributeLabel(prev => ({...prev, [`${variant.id}-label`]: e.target.value}))}
                      />
                      <Label htmlFor={`value-${variant.id}`}>Value</Label>
                      <Input
                        id={`value-${variant.id}`}
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
                {Object.entries(getAttributes(variant.attributes)).map(([key, value]) => {
                  const isEditing = editingAttrKey === key
                  return (
                    <div key={key} className='flex items-center justify-between gap-4'>
                      <div className='flex items-center gap-4 mb-2 w-full'>
                        <Label htmlFor={key} className='text-xs font-medium text-muted-foreground uppercase tracking-wide w-12'>
                          {key}
                        </Label>
                        <Input
                          id={key}
                          value={isEditing ? editingAttrValue : value}
                          readOnly={!isEditing}
                          onChange={e => setEditingAttrValue(e.target.value)}
                          className='h-8 text-sm flex-1'
                        />
                      </div>
                      <div className='flex gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            if (isEditing) {
                              handleSaveAttributeEdit(variant.id, key)
                            } else {
                              setEditingAttrKey(key)
                              setEditingAttrValue(value)
                            }
                          }}
                          className='h-8 w-8 p-0'
                        >
                          {isEditing ? <Check className='w-4 h-4' /> : <Edit className='w-4 h-4' />}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteAttribute(variant.id, key)}
                          className='h-8 w-8 p-0 text-destructive'
                        >
                          <X className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  )
                })}
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
