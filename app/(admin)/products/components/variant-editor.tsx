'use client'

import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Plus, X, Check, Edit } from 'lucide-react'
import { TVariant, VariantEditorProps, SchemaForm } from '@/lib/types'
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

  const [editingAttr, setEditingAttr] = useState<{key: string; value: string} | null>(null)
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({})

  const updateVariant = (id: string, field: keyof TVariant, value: any) => {
    return onVariantsChange(variants.map(v => (v.id === id ? {...v, [field]: value} : v)))
  }

  const addAttribute = ({label, value, variantId}: SchemaForm<typeof attributeSchema> & {variantId: string}) => {
    const variant = variants.find(v => v.id === variantId)
    if (!variant) return

    if (variant.attributes[label]) return alert(`Attribute key "${label}" already exists.`)

    updateVariant(variantId, 'attributes', {...variant.attributes, [label]: value})
    setDialogOpen(prev => ({...prev, [variantId]: false}))
    form.reset()
  }

  const deleteAttribute = (variantId: string, key: string) => {
    const variant = variants.find(v => v.id === variantId)
    if (!variant) return
    const attrs = {...variant.attributes}
    delete attrs[key]
    updateVariant(variantId, 'attributes', attrs)
  }

  const saveAttributeEdit = (variantId: string, key: string) => {
    if (!editingAttr?.value.trim()) return
    updateVariant(variantId, 'attributes', {
      ...variants.find(v => v.id === variantId)?.attributes,
      [key]: editingAttr.value.trim()
    })
    setEditingAttr(null)
  }

  const deleteVariant = (id: string) => onVariantsChange(variants.filter(v => v.id !== id))

  const textFields = ['name', 'image']
  const numberFields = ['price', 'discountedPrice', 'stock']
  const allFields = [...numberFields, 'coupon']

  return (
    <div className='space-y-3'>
      {variants.map(variant => (
        <Card key={variant.id} className='p-4 relative'>
          <Button
            variant='ghost'
            size='sm'
            className='absolute top-2 right-2 text-destructive p-1'
            onClick={() => deleteVariant(variant.id)}
          >
            <Trash2 className='w-4 h-4' />
          </Button>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {textFields.map(field => (
                <div key={field}>
                  <Label className='text-sm font-medium'>{field === 'name' ? 'Variant Name' : 'Image URL'}</Label>
                  <InputUI
                    value={String(variant[field as keyof TVariant]) ?? ''}
                    onChange={e => updateVariant(variant.id, field as keyof TVariant, e.target.value)}
                    placeholder={field === 'name' ? 'e.g., Red S Size' : 'https://...'}
                    className='mt-1'
                  />
                </div>
              ))}
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {allFields.map(field => {
                const value = variant[field as keyof TVariant] ?? ''
                const isNumber = numberFields.includes(field)
                const placeholderMap = {price: '0.00', discountedPrice: '0.00', stock: '0', coupon: 'PROMO_CODE'}
                return (
                  <div key={`${variant.id}-${field}`}>
                    <Label className='text-sm font-medium'>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <InputUI
                      type={isNumber ? 'number' : 'text'}
                      value={String(value)}
                      onChange={e => {
                        const val = e.target.value
                        updateVariant(variant.id, field as keyof TVariant, isNumber ? (val === '' ? undefined : Number(val)) : val)
                      }}
                      placeholder={placeholderMap[field as keyof typeof placeholderMap]}
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
                  const isEditing = editingAttr?.key === key
                  return (
                    <div key={key} className='flex items-center justify-between gap-4'>
                      <div className='grid grid-cols-[1fr_4fr] items-center gap-4 w-full'>
                        <Label htmlFor={key}>{key}:</Label>
                        <InputUI
                          id={key}
                          value={isEditing ? editingAttr.value : value}
                          readOnly={!isEditing}
                          onChange={e => setEditingAttr({key, value: e.target.value})}
                        />
                      </div>
                      <div className='flex gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={() => (isEditing ? saveAttributeEdit(variant.id, key) : setEditingAttr({key, value}))}
                        >
                          {isEditing ? <Check className='w-4 h-4 text-green-400' /> : <Edit className='w-4 h-4' />}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 text-destructive'
                          onClick={() => deleteAttribute(variant.id, key)}
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
                onConfirm={form.handleSubmit((data: SchemaForm<typeof attributeSchema>) => addAttribute({...data, variantId: variant.id}))}
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
        <Plus className='w-4 h-4 mr-2' /> Add Variant
      </Button>
    </div>
  )
}

export default VariantEditor
