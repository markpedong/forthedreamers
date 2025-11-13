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
import { Input as InputUI } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    form.reset()
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
              {['name', 'image'].map(field => {
                const fieldValue = variant[field as keyof typeof variant] as string
                return (
                  <div key={field}>
                    <Label className='text-sm font-medium'>{field === 'name' ? 'Variant Name' : 'Image URL'}</Label>
                    <InputUI
                      key={`${variant.id}-${field}`}
                      name={field}
                      value={fieldValue ?? ''}
                      onChange={e => handleUpdateVariant(variant.id, field as keyof typeof variant, e.target.value)}
                      placeholder={field === 'name' ? 'e.g., Red S Size' : 'https://...'}
                      className='mt-1'
                    />
                  </div>
                )
              })}
            </div>

            <div className='grid grid-cols-4 gap-4'>
              {['price', 'discountedPrice', 'stock', 'coupon'].map(field => {
                const fieldValue = variant[field as keyof typeof variant] as number
                const hasLabel = field === 'discountedPrice' || field === 'coupon'
                const placeholder = field === 'discountedPrice' || field === 'coupon' ? 'Optional' : '0'

                return hasLabel ? (
                  <Input
                    key={`${variant.id}-${field}`}
                    label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    name={field}
                    type='number'
                    value={fieldValue ?? ''}
                    onChange={e =>
                      handleUpdateVariant(variant.id, field as keyof typeof variant, e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder={placeholder}
                    className='mt-1'
                  />
                ) : (
                  <div key={`${variant.id}-${field}`}>
                    <Label className='text-sm font-medium'>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <InputUI
                      value={fieldValue ?? 0}
                      type='number'
                      onChange={e => handleUpdateVariant(variant.id, field as keyof typeof variant, Number(e.target.value))}
                      className='mt-1'
                    />
                  </div>
                )
              })}
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
                      <div className='grid grid-cols-[1fr_4fr] justify-items-end items-center gap-4 w-full'>
                        <Label htmlFor={key}>{key}:</Label>
                        <InputUI
                          id={key}
                          value={isEditing ? editingAttrValue : value}
                          readOnly={!isEditing}
                          onChange={e => setEditingAttrValue(e.target.value)}
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
                          {isEditing ? <Check className='w-4 h-4 text-green-400' /> : <Edit className='w-4 h-4' />}
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
                  <Input label='Label' name='label' placeholder='Attribute key' isHorizontal preventSpaces />
                  <Input label='Value' name='value' placeholder='Attribute value' isHorizontal preventSpaces />
                </Form>
              </Dialog>
            </div>
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
