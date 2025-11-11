'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import Dialog from '@/components/reusable/dialog'
import Form from '@/components/reusable/form'
import Input from '@/components/reusable/input'
import Checkbox from '@/components/reusable/checkbox'
import useFormSchema from '@/hooks/useFormSchema'
import { SchemaForm, TVariantOption, VariantEditorProps } from '@/lib/types'
import VariantItem from '@/components/reusable/variant-item'
import { VARIANT_ITEM_DEFAULT } from '@/constants'

const VariantEditor = ({variants, onVariantsChange}: VariantEditorProps) => {
  const {variantSchema} = useFormSchema()

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<SchemaForm<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: VARIANT_ITEM_DEFAULT
  })

  const openForAdd = () => {
    form.reset(VARIANT_ITEM_DEFAULT)
    setEditingIndex(null)
    setIsOpen(true)
  }

  const openForEdit = (index: number) => {
    const variant = variants[index]
    form.reset({id: variant.id, name: variant.name, isRequired: variant.isRequired})
    setEditingIndex(index)
    setIsOpen(true)
  }

  const handleSave = (data: SchemaForm<typeof variantSchema>) => {
    const updated = [...variants]

    if (editingIndex !== null) {
      updated[editingIndex] = {...updated[editingIndex], ...data}
    } else {
      updated.push({...data, options: []})
    }

    onVariantsChange(updated)
    form.reset(VARIANT_ITEM_DEFAULT)
    setEditingIndex(null)
    setExpandedIndex(null)
    setIsOpen(false)
  }

  const handleDelete = (index: number) => {
    const updated = [...variants]
    updated.splice(index, 1)
    onVariantsChange(updated)
  }

  const handleOptionsChange = (index: number, options: TVariantOption[]) => {
    const updated = [...variants]
    updated[index].options = options
    onVariantsChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Variants</h3>
        <Button size='sm' className='gap-1' onClick={openForAdd} disabled={isOpen}>
          <Plus size={16} /> Add Variant
        </Button>
      </div>

      <div className='space-y-2'>
        {variants.map((variant, index) => (
          <VariantItem
            key={variant.id || index}
            variant={variant}
            index={index}
            expanded={expandedIndex === index}
            onExpand={() => setExpandedIndex(prev => (prev === index ? null : index))}
            onEdit={() => openForEdit(index)}
            onDelete={() => handleDelete(index)}
            onOptionsChange={(index, opts) => handleOptionsChange(index, opts)}
          />
        ))}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) form.reset(VARIANT_ITEM_DEFAULT)
          setIsOpen(open)
        }}
        title={`${editingIndex !== null ? 'Edit' : 'Add'} Variant`}
        triggerText={false}
        onConfirm={form.handleSubmit(handleSave)}
      >
        <Form form={form} customSubmitButton>
          <Input label='Variant Name *' name='name' placeholder='e.g., Color, Size' preventSpaces />
          <Checkbox name='isRequired' label='Is this variation required?' />
        </Form>
      </Dialog>
    </div>
  )
}

export default VariantEditor
