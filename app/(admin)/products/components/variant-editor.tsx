'use client';

import { useState } from 'react';
import { Trash2, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import VariantOptionEditor from './variant-option-editor';
import { Variant } from '@/generated/prisma';
import { TVariant, TVariantOption } from '@/lib/types';

interface VariantEditorProps {
  variants: TVariant[];
  onVariantsChange: (variants: Variant[]) => void;
}

const VariantEditor = ({ variants, onVariantsChange }: VariantEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const resetForm = () => {
    setName('');
    setIsRequired(true);
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const updated = [...variants];
    if (editingIndex !== null) {
      updated[editingIndex] = { ...updated[editingIndex], name, isRequired };
    } else {
      // updated.push({ name, isRequired, options: [] });
    }

    onVariantsChange(updated);
    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (index: number) => {
    const variant = variants[index];
    setName(variant.name);
    setIsRequired(variant.isRequired);
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleDelete = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index));
  };

  const handleOptionsChange = (index: number, options: TVariantOption[]) => {
    const updated = [...variants];
    // updated[index].options = options;
    onVariantsChange(updated);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Variants</h3>
        <Button size='sm' onClick={() => setIsOpen(true)} className='gap-1'>
          <Plus size={16} /> Add Variant
        </Button>
      </div>

      <div className='space-y-2'>
        {variants.map((variant, index) => (
          <div key={index} className='border border-border rounded-lg overflow-hidden'>
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className='w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors'
            >
              <div className='flex items-center gap-3 flex-1 text-left'>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                />
                <div>
                  <p className='font-medium text-foreground'>{variant.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {/* {variant.options.length} option
                    {variant.options.length !== 1 ? 's' : ''} •{' '} */}
                    {variant.isRequired ? 'Required' : 'Optional'}
                  </p>
                </div>
              </div>
              <div className='flex gap-1' onClick={(e) => e.stopPropagation()}>
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
            </button>

            {expandedIndex === index && (
              <div className='border-t border-border p-4 bg-muted/20'>
                <VariantOptionEditor
                  variantName={variant.name}
                  options={variant.options}
                  onOptionsChange={(options) => handleOptionsChange(index, options)}
                />
              </div>
            )}
          </div>
        ))}
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
            <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Variant</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Variant Type</label>
              <Input
                placeholder='e.g., Color, Size'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mt-1'
              />
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='required'
                checked={isRequired}
                onCheckedChange={(checked) => setIsRequired(!!checked)}
              />
              <label htmlFor='required' className='text-sm font-medium cursor-pointer'>
                This variant is required
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VariantEditor;
