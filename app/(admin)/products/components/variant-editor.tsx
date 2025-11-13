'use client'

import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Plus, X, Check, Edit } from 'lucide-react'
import { SchemaForm, type TVariant, type VariantEditorProps } from '@/lib/types'
import Dialog from '@/components/reusable/dialog'
import Input from '@/components/reusable/input'
import Form from '@/components/reusable/form'
import { useForm } from 'react-hook-form'
import useFormSchema from '@/hooks/useFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const VariantEditor: FC<VariantEditorProps> = ({variants, onVariantsChange}) => {
  const {attributeSchema} = useFormSchema()
  const form = useForm<SchemaForm<typeof attributeSchema>>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {label: '', value: ''}
  })
  const [editingAttrKey, setEditingAttrKey] = useState<string | null>(null)
  const [editingAttrValue, setEditingAttrValue] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({})

  const handleUpdateVariant = (id: string, field: keyof Partial<TVariant>, value: any) => {
    onVariantsChange(variants.map(v => (v.id === id ? {...v, [field]: value} : v)))
  }

  const handleAddAttributeFromDialog = ({label, value, variantId}: SchemaForm<typeof attributeSchema> & {variantId: string}) => {
    const variant = variants.find(v => v.id === variantId)
    if (!variant) return

    const currentAttrs = {...variant.attributes}

    if (currentAttrs[label]) {
      alert(`Attribute key "${label}" already exists.`)
      return
    }

    currentAttrs[label] = value
    onVariantsChange(variants.map(v => (v.id === variantId ? {...v, attributes: currentAttrs} : v)))
    setDialogOpen(prev => ({...prev, [variantId]: false}))
  }

  const handleDeleteAttribute = (variantId: string, key: string) => {
    onVariantsChange(
      variants.map(v => {
        if (v.id === variantId) {
          const attrs = {...v.attributes}
          delete attrs[key]
          return {...v, attributes: attrs}
        }
        return v
      })
    )
  }

  const handleSaveAttributeEdit = (variantId: string, key: string) => {
    if (!editingAttrValue.trim()) return
    onVariantsChange(variants.map(v => (v.id === variantId ? {...v, attributes: {...v.attributes, [key]: editingAttrValue.trim()}} : v)))
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
          <div className='absolute top-2 right-2'>
            <Button variant='ghost' size='sm' onClick={() => handleDeleteVariant(variant.id)} className='text-destructive p-1'>
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>

          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Variant Name'
                name='variantName'
                value={variant.name ?? ''}
                onChange={e => handleUpdateVariant(variant.id, 'name', e.target.value)}
                placeholder='e.g., Red S Size'
                className='mt-1'
              />
              <Input
                name='image'
                label='Image URL'
                value={variant.image ?? ''}
                onChange={e => handleUpdateVariant(variant.id, 'image', e.target.value)}
                placeholder='https://...'
                className='mt-1'
              />
            </div>

            <div className='grid grid-cols-4 gap-4'>
              <Input
                name='Price'
                label='Price'
                type='number'
                value={variant.price ?? 0}
                onChange={e => handleUpdateVariant(variant.id, 'price', Number(e.target.value))}
                placeholder='0'
                className='mt-1'
              />
              <Input
                label='Discounted Price'
                name='discountedPrice'
                type='number'
                value={variant.discountedPrice ?? ''}
                onChange={e => handleUpdateVariant(variant.id, 'discountedPrice', e.target.value ? Number(e.target.value) : null)}
                placeholder='Optional'
                className='mt-1'
              />
              <Input
                type='number'
                label='Stock'
                name='stock'
                value={variant.stock ?? 0}
                onChange={e => handleUpdateVariant(variant.id, 'stock', Number(e.target.value))}
                placeholder='0'
                className='mt-1'
              />
              <Input
                label='Coupon'
                name='coupon'
                value={variant.coupon ?? ''}
                onChange={e => handleUpdateVariant(variant.id, 'coupon', e.target.value || null)}
                placeholder='Optional'
                className='mt-1'
              />
            </div>
            <div className='border-t pt-3 relative'>
              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm font-medium text-foreground'>Attributes ({Object.keys(variant.attributes).length})</span>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 px-2'
                  onClick={() => setDialogOpen(prev => ({...prev, [variant.id]: true}))}
                >
                  <Plus className='w-4 h-4 mr-1' /> Add
                </Button>
              </div>

              <div className='space-y-2'>
                {Object.entries(variant.attributes).map(([key, value]) => {
                  const isEditing = editingAttrKey === key
                  return (
                    <div key={key} className='flex items-center justify-between gap-4'>
                      <div className='flex items-center gap-4 w-full'>
                        <Input
                          name='key'
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

            <Dialog
              title='Add Attribute'
              open={dialogOpen[variant.id] || false}
              onOpenChange={open => setDialogOpen(prev => ({...prev, [variant.id]: open}))}
              triggerText={false}
              onConfirm={form.handleSubmit((data: SchemaForm<typeof attributeSchema>) =>
                handleAddAttributeFromDialog({...data, variantId: variant.id})
              )}
            >
              <Form form={form} customSubmitButton>
                <Input label='Label: ' name='label' placeholder='Attribute key' />
                <Input label='Value: ' name='value' placeholder='Attribute value' />
              </Form>
            </Dialog>
          </div>
        </Card>
      ))}

      <Button
        onClick={() =>
          onVariantsChange([
            ...variants,
            {
              id: `temp-${Date.now()}`,
              name: '',
              image: '',
              price: 0,
              discountedPrice: null,
              stock: 0,
              coupon: null,
              attributes: {}
            }
          ])
        }
        variant='outline'
        className='w-full mt-2'
      >
        <Plus className='w-4 h-4 mr-2' /> Add Partial Variant
      </Button>
    </div>
  )
}

export default VariantEditor
