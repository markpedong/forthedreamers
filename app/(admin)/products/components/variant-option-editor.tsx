'use client'

import { FC, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { SchemaForm, TVariantOption, VariantOptionEditorProps } from '@/lib/types'
import useFormSchema from '@/hooks/useFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { VARIANT_OPTION_DEFAULT } from '@/constants'
import Form from '@/components/reusable/form'
import Dialog from '@/components/reusable/dialog'
import Input from '@/components/reusable/input'

const VariantOptionEditor: FC<VariantOptionEditorProps> = ({variantName, options, onOptionsChange}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const {variantOptionFormSchema} = useFormSchema()
  const form = useForm<SchemaForm<typeof variantOptionFormSchema>>({
    resolver: zodResolver(variantOptionFormSchema),
    defaultValues: VARIANT_OPTION_DEFAULT
  })

  const openForAdd = () => {
    form.reset()
    setEditingIndex(null)
    setIsOpen(true)
  }

  const openForEdit = (index: number) => {
    const option = options[index]
    form.reset({
      variantOptionName: option.variantOptionName,
      coupon: option.coupon,
      discountedPrice: option.discountedPrice,
      price: option.price,
      stock: option.stock
    })
    setEditingIndex(index)
    setIsOpen(true)
  }

  const handleSave = (values: SchemaForm<typeof variantOptionFormSchema>) => {
    const newOption: TVariantOption = {
      id: editingIndex !== null ? options[editingIndex].id : '',
      variantOptionName: values.variantOptionName,
      price: values.price ?? 0,
      discountedPrice: values.discountedPrice || null,
      stock: values.stock ?? 0,
      coupon: values.coupon || null
    }

    const updated = [...options]
    if (editingIndex !== null) {
      updated[editingIndex] = newOption
    } else {
      updated.push(newOption)
    }

    onOptionsChange(updated)
    form.reset(VARIANT_OPTION_DEFAULT)
    setEditingIndex(null)
    setIsOpen(false)
  }

  const handleDelete = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index))
  }

  return (
    <div className='space-y-3 p-4 border-t'>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium'>Options</label>
        <Button size='sm' onClick={openForAdd} className='gap-1'>
          <Plus size={16} /> Add Option
        </Button>
      </div>

      <div className='space-y-2 rounded-lg min-h-16'>
        {options.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No options added yet</p>
        ) : (
          options.map((option, index) => (
            <div key={index} className='flex items-center justify-between gap-2 p-2 bg-background rounded border border-border'>
              <div className='flex-1 text-sm'>
                <p className='font-medium'>{option.variantOptionName}</p>
                <p className='text-xs text-muted-foreground'>
                  ${option.price.toFixed(2)} {option.discountedPrice && `→ $${option.discountedPrice.toFixed(2)}`} • Stock: {option.stock}
                </p>
              </div>
              <div className='flex gap-1'>
                <Button variant='outline' size='sm' onClick={() => openForEdit(index)}>
                  Edit
                </Button>
                <Button variant='outline' size='sm' onClick={() => handleDelete(index)} className='text-destructive hover:text-destructive'>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog
        title={`${editingIndex !== null ? 'Edit' : 'Add'} ${variantName} Option`}
        open={isOpen}
        onOpenChange={open => {
          if (!open) form.reset()
          setIsOpen(open)
        }}
        onConfirm={form.handleSubmit(handleSave)}
        confirmText='Save Option'
        triggerText={false}
      >
        <Form form={form} customSubmitButton>
          <Input name='variantOptionName' label='Option Name *' placeholder='e.g., Red, Small' preventSpaces />
          <div className='grid grid-cols-2 gap-3'>
            <Input name='price' label='Price *' type='number' step='0.01' placeholder='0.00' />
            <Input name='discountedPrice' label='Discounted Price (Optional)' type='number' step='0.01' placeholder='Optional' />
          </div>
          <Input name='stock' label='Stock *' type='number' placeholder='0' />
          <Input name='coupon' label='Coupon Code (Optional)' placeholder='e.g., SAVE10' />
        </Form>
      </Dialog>
    </div>
  )
}

export default VariantOptionEditor
