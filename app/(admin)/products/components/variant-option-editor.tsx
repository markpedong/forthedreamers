'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface VariantOption {
  id?: string;
  variantOptionName: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  coupon?: string;
}

interface VariantOptionEditorProps {
  variantName: string;
  options: VariantOption[];
  onOptionsChange: (options: VariantOption[]) => void;
}

const VariantOptionEditor = ({
  variantName,
  options,
  onOptionsChange,
}: VariantOptionEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState('');
  const [coupon, setCoupon] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const resetForm = () => {
    setName('');
    setPrice('');
    setDiscountedPrice('');
    setStock('');
    setCoupon('');
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!name.trim() || !price || !stock) return;

    const newOption: VariantOption = {
      variantOptionName: name,
      price: parseFloat(price),
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
      stock: parseInt(stock),
      coupon: coupon || undefined,
    };

    const updated = [...options];
    if (editingIndex !== null) {
      updated[editingIndex] = { ...updated[editingIndex], ...newOption };
    } else {
      updated.push(newOption);
    }

    onOptionsChange(updated);
    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (index: number) => {
    const option = options[index];
    setName(option.variantOptionName);
    setPrice(option.price.toString());
    setDiscountedPrice(option.discountedPrice?.toString() || '');
    setStock(option.stock.toString());
    setCoupon(option.coupon || '');
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleDelete = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium'>{variantName} Options</label>
        <Button size='sm' onClick={() => setIsOpen(true)} className='gap-1'>
          <Plus size={16} /> Add Option
        </Button>
      </div>

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
                <p className='font-medium text-foreground'>{option.variantOptionName}</p>
                <p className='text-xs text-muted-foreground'>
                  ${option.price.toFixed(2)}{' '}
                  {option.discountedPrice && `→ $${option.discountedPrice.toFixed(2)}`} • Stock:{' '}
                  {option.stock}
                </p>
              </div>
              <div className='flex gap-1'>
                <Button variant='outline' size='sm' onClick={() => handleEdit(index)}>
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
            <div>
              <label className='text-sm font-medium'>Option Name</label>
              <Input
                placeholder={`e.g., ${variantName}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mt-1'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='text-sm font-medium'>Price</label>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='0.00'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Discounted Price</label>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='Optional'
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className='mt-1'
                />
              </div>
            </div>

            <div>
              <label className='text-sm font-medium'>Stock</label>
              <Input
                type='number'
                placeholder='0'
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className='mt-1'
              />
            </div>

            <div>
              <label className='text-sm font-medium'>Coupon Code (Optional)</label>
              <Input
                placeholder='e.g., SAVE10'
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className='mt-1'
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
  );
};

export default VariantOptionEditor;
