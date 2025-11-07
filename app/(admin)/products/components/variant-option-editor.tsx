'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { TVariantOption } from '@/lib/types';
import Input from '@/components/reusable/input';

interface VariantOptionEditorProps {
  variantName: string;
  options: TVariantOption[];
  onOptionsChange: (options: TVariantOption[]) => void;
}

const VariantOptionEditor = ({
  variantName,
  options,
  onOptionsChange,
}: VariantOptionEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [form, setForm] = useState({
    variantOptionName: '',
    price: '',
    discountedPrice: '',
    stock: '',
    coupon: '',
  });

  const updateForm = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm({
      variantOptionName: '',
      price: '',
      discountedPrice: '',
      stock: '',
      coupon: '',
    });
    setEditingIndex(null);
  };

  const openForAdd = () => {
    resetForm();
    setIsOpen(true);
  };

  const openForEdit = (index: number) => {
    const option = options[index];
    setEditingIndex(index);
    setForm({
      variantOptionName: option.variantOptionName,
      price: option.price.toString(),
      discountedPrice: option.discountedPrice?.toString() || '',
      stock: option.stock.toString(),
      coupon: option.coupon || '',
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.variantOptionName.trim() || !form.price || !form.stock) return;

    //@ts-ignore
    const newOption: TVariantOption = {
      variantOptionName: form.variantOptionName.trim(),
      price: parseFloat(form.price),
      discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : null,
      stock: parseInt(form.stock),
      coupon: `${form.coupon}`,
    };

    const updated = [...options];
    if (editingIndex !== null) updated[editingIndex] = { ...updated[editingIndex], ...newOption };
    else updated.push(newOption);

    onOptionsChange(updated);
    resetForm();
    setIsOpen(false);
  };

  const handleDelete = (index: number) => onOptionsChange(options.filter((_, i) => i !== index));

  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium'>{variantName} Options</label>
        <Button size='sm' onClick={openForAdd} className='gap-1'>
          <Plus size={16} /> Add Option
        </Button>
      </div>

      {/* Options List */}
      <div className='space-y-2 bg-muted/30 rounded-lg p-3 min-h-16'>
        {options.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No options added yet</p>
        ) : (
          options.map((option, index) => (
            <div
              key={index}
              className='flex items-center justify-between gap-2 p-2 bg-background rounded border border-border'
            >
              <div className='flex-1 text-sm'>
                <p className='font-medium'>{option.variantOptionName}</p>
                <p className='text-xs text-muted-foreground'>
                  ${option.price.toFixed(2)}{' '}
                  {option.discountedPrice && `→ $${option.discountedPrice.toFixed(2)}`} • Stock:{' '}
                  {option.stock}
                </p>
              </div>
              <div className='flex gap-1'>
                <Button variant='outline' size='sm' onClick={() => openForEdit(index)}>
                  Edit
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDelete(index)}
                  className='text-destructive hover:text-destructive'
                >
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
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsOpen(open);
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
            <Input label='Option Name' placeholder={`e.g., ${variantName}`} name='name' />

            {/* Prices */}
            <div className='grid grid-cols-2 gap-3'>
              <Input label='Price' name='price' type='number' step='0.01' placeholder='0.00' />
              <Input
                label='Discounted Price'
                name='discountedPrice'
                type='number'
                step='0.01'
                placeholder='Optional'
              />
            </div>
            <Input label='Stock' name='stock' type='number' placeholder='0' />

            <Input label='Coupon Code (Optional)' name='coupon' placeholder='e.g., SAVE10' />
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
  );
};

export default VariantOptionEditor;
