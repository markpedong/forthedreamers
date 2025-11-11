'use client'

import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { TVariantOption } from '@/lib/types'

// Helper to generate temporary ID for new items
const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

interface VariantOptionEditorProps {
  variantName: string
  options: TVariantOption[]
  onOptionsChange: (options: TVariantOption[]) => void
}

const VariantOptionEditor = ({variantName, options, onOptionsChange}: VariantOptionEditorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [form, setForm] = useState({
    id: undefined as string | undefined,
    variantOptionName: '',
    price: '',
    discountedPrice: '',
    stock: '',
    coupon: ''
  })

  const updateForm = (key: keyof typeof form, value: string | undefined) => setForm(prev => ({...prev, [key]: value}))

  const resetForm = () => {
    setForm({
      id: undefined,
      variantOptionName: '',
      price: '',
      discountedPrice: '',
      stock: '',
      coupon: ''
    })
    setEditingIndex(null)
  }

  const openForAdd = () => {
    resetForm()
    setIsOpen(true)
  }

  const openForEdit = (index: number) => {
    const option = options[index]
    setEditingIndex(index)
    setForm({
      id: option.id,
      variantOptionName: option.variantOptionName,
      price: option.price.toString(),
      discountedPrice: option.discountedPrice?.toString() || '',
      stock: option.stock.toString(),
      coupon: option.coupon || ''
    })
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!form.variantOptionName.trim() || !form.price || !form.stock) return

    const priceNum = parseFloat(form.price)
    const stockNum = parseInt(form.stock)

    if (isNaN(priceNum) || isNaN(stockNum) || priceNum < 0 || stockNum < 0) {
      return
    }

    const newOption: TVariantOption = {
      id: form.id || generateTempId(),
      variantOptionName: form.variantOptionName.trim(),
      price: priceNum,
      discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : null,
      stock: stockNum,
      coupon: form.coupon?.trim() || null
    }

    const updated = [...options]
    if (editingIndex !== null) {
      updated[editingIndex] = {...updated[editingIndex], ...newOption}
    } else {
      updated.push(newOption as TVariantOption)
    }

    onOptionsChange(updated)
    resetForm()
    setIsOpen(false)
  }

  const handleDelete = (index: number) => onOptionsChange(options.filter((_, i) => i !== index))

  return (
    <div className='space-y-3 p-4 border-t'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium'>Options</label>
        <Button size='sm' onClick={openForAdd} className='gap-1'>
          <Plus size={16} /> Add Option
        </Button>
      </div>

      {/* Options List */}
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
        open={isOpen}
        onOpenChange={open => {
          if (!open) resetForm()
          setIsOpen(open)
        }}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Edit' : 'Add'} {variantName} Option
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-3'>
            {/* Name */}
            <div>
              <label htmlFor='variantOptionName' className='text-sm font-medium mb-1.5 block'>
                Option Name *
              </label>
              <input
                id='variantOptionName'
                type='text'
                placeholder={`e.g., Red, Small`}
                value={form.variantOptionName}
                onChange={e => updateForm('variantOptionName', e.target.value)}
                className='w-full px-3 py-2 border border-border rounded-md'
              />
            </div>

            {/* Prices */}
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label htmlFor='price' className='text-sm font-medium mb-1.5 block'>
                  Price *
                </label>
                <input
                  id='price'
                  type='number'
                  step='0.01'
                  placeholder='0.00'
                  value={form.price}
                  onChange={e => updateForm('price', e.target.value)}
                  className='w-full px-3 py-2 border border-border rounded-md'
                />
              </div>
              <div>
                <label htmlFor='discountedPrice' className='text-sm font-medium mb-1.5 block'>
                  Discounted Price
                </label>
                <input
                  id='discountedPrice'
                  type='number'
                  step='0.01'
                  placeholder='Optional'
                  value={form.discountedPrice}
                  onChange={e => updateForm('discountedPrice', e.target.value)}
                  className='w-full px-3 py-2 border border-border rounded-md'
                />
              </div>
            </div>
            <div>
              <label htmlFor='stock' className='text-sm font-medium mb-1.5 block'>
                Stock *
              </label>
              <input
                id='stock'
                type='number'
                placeholder='0'
                value={form.stock}
                onChange={e => updateForm('stock', e.target.value)}
                className='w-full px-3 py-2 border border-border rounded-md'
              />
            </div>

            <div>
              <label htmlFor='coupon' className='text-sm font-medium mb-1.5 block'>
                Coupon Code (Optional)
              </label>
              <input
                id='coupon'
                type='text'
                placeholder='e.g., SAVE10'
                value={form.coupon}
                onChange={e => updateForm('coupon', e.target.value)}
                className='w-full px-3 py-2 border border-border rounded-md'
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Option</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VariantOptionEditor
