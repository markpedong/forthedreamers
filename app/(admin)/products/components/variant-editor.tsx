'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Plus, X } from 'lucide-react'
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

const getAttributes = (attrs: Variant['attributes']): Record<string, string> => {
  if (!attrs || typeof attrs !== 'object') return {}
  return attrs as Record<string, string>
}

export default function VariantEditor({variants, onVariantsChange}: VariantEditorProps) {
  const [editingAttribute, setEditingAttribute] = useState<{variantId: string; key: string} | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editValue, setEditValue] = useState('')
  const [addingAttributeVariant, setAddingAttributeVariant] = useState<string | null>(null)
  const [newAttrLabel, setNewAttrLabel] = useState('')
  const [newAttrValue, setNewAttrValue] = useState('')

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

  const handleUpdateAttributes = (id: string, key: string, value: string) => {
    onVariantsChange(variants.map(v => (v.id === id ? {...v, attributes: {...getAttributes(v.attributes), [key]: value}} : v)))
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

  const handleSaveEditAttribute = (variantId: string, oldKey: string) => {
    if (!editLabel.trim() || !editValue.trim()) return

    onVariantsChange(
      variants.map(v => {
        if (v.id === variantId) {
          const attrs = {...getAttributes(v.attributes)}
          delete attrs[oldKey]
          attrs[editLabel.trim()] = editValue.trim()
          return {...v, attributes: attrs}
        }
        return v
      })
    )

    setEditingAttribute(null)
    setEditLabel('')
    setEditValue('')
  }

  const handleAddAttribute = (variantId: string) => {
    if (!newAttrLabel.trim() || !newAttrValue.trim()) return
    handleUpdateAttributes(variantId, newAttrLabel.trim(), newAttrValue.trim())

    setAddingAttributeVariant(null)
    setNewAttrLabel('')
    setNewAttrValue('')
  }

  const handleDeleteVariant = (id: string) => {
    onVariantsChange(variants.filter(v => v.id !== id))
  }

  return (
    <div className='space-y-3'>
      {variants.map(variant => {
        const attrs = getAttributes(variant.attributes)
        return (
          <Card key={variant.id} className='p-4'>
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
              <div className='border-t pt-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-medium'>Attributes ({Object.keys(attrs).length})</span>
                  <Dialog open={addingAttributeVariant === variant.id} onOpenChange={open => !open && setAddingAttributeVariant(null)}>
                    <DialogTrigger asChild>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setAddingAttributeVariant(variant.id)}
                        className='h-8 px-2 flex items-center gap-1'
                      >
                        <Plus className='w-3 h-3' /> Add Attribute
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-md'>
                      <DialogHeader>
                        <DialogTitle>Add Attribute</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <Input placeholder='Key' value={newAttrLabel} onChange={e => setNewAttrLabel(e.target.value)} />
                        <Input placeholder='Value' value={newAttrValue} onChange={e => setNewAttrValue(e.target.value)} />
                        <div className='flex justify-end gap-2 pt-2'>
                          <Button variant='outline' onClick={() => setAddingAttributeVariant(null)}>
                            Cancel
                          </Button>
                          <Button onClick={() => handleAddAttribute(variant.id)}>Save</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className='space-y-2'>
                  {Object.entries(attrs).map(([key, value]) => (
                    <div key={key} className='flex items-center gap-2'>
                      <Input value={key} readOnly className='h-8 text-sm flex-1 bg-transparent' />
                      <Input value={value} readOnly className='h-8 text-sm flex-1 bg-transparent' />

                      <Dialog
                        open={editingAttribute?.variantId === variant.id && editingAttribute.key === key}
                        onOpenChange={open => !open && setEditingAttribute(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='p-0'
                            onClick={() => {
                              setEditingAttribute({variantId: variant.id, key})
                              setEditLabel(key)
                              setEditValue(value)
                            }}
                          >
                            ✎
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-md'>
                          <DialogHeader>
                            <DialogTitle>Edit Attribute</DialogTitle>
                          </DialogHeader>
                          <div className='space-y-4'>
                            <Input placeholder='Key' value={editLabel} onChange={e => setEditLabel(e.target.value)} />
                            <Input placeholder='Value' value={editValue} onChange={e => setEditValue(e.target.value)} />
                            <div className='flex justify-end gap-2 pt-2'>
                              <Button variant='outline' onClick={() => setEditingAttribute(null)}>
                                Cancel
                              </Button>
                              <Button onClick={() => handleSaveEditAttribute(variant.id, key)}>Save</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant='ghost'
                        size='sm'
                        className='p-0 text-destructive hover:text-destructive hover:bg-transparent'
                        onClick={() => handleRemoveAttribute(variant.id, key)}
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex justify-end pt-2 border-t'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleDeleteVariant(variant.id)}
                  className='text-destructive hover:text-destructive'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}

      <Button onClick={handleAddVariant} variant='outline' className='w-full rounded-sm bg-transparent'>
        <Plus className='w-4 h-4 mr-2' /> Add Partial Variant
      </Button>
    </div>
  )
}
