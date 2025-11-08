'use client';

import { useState } from 'react';
import { Trash2, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import VariantOptionEditor from './variant-option-editor';
import { FormVariant, FormVariantOption, TVariantOption } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Helper to generate temporary ID for new items
const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface VariantEditorProps {
  variants: FormVariant[];
  onVariantsChange: (variants: FormVariant[]) => void;
}

const VariantEditor = ({ variants, onVariantsChange }: VariantEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [form, setForm] = useState({
    id: undefined as string | undefined,
    name: '',
    isRequired: true,
  });

  const updateForm = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm({ id: undefined, name: '', isRequired: true });
    setEditingIndex(null);
  };

  const openForAdd = () => {
    resetForm();
    setIsOpen(true);
  };

  const openForEdit = (index: number) => {
    const v = variants[index];
    setForm({ 
      id: v.id,
      name: v.name, 
      isRequired: v.isRequired 
    });
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const updated = [...variants];

    if (editingIndex !== null) {
      // Update existing variant - preserve ID and options
      updated[editingIndex] = {
        ...updated[editingIndex],
        id: form.id || updated[editingIndex].id,
        name: form.name.trim(),
        isRequired: form.isRequired,
      };
    } else {
      // Add new variant
      updated.push({
        id: form.id || generateTempId(),
        name: form.name.trim(),
        isRequired: form.isRequired,
        options: [] as FormVariantOption[],
      });
    }

    onVariantsChange(updated);
    resetForm();
    setIsOpen(false);
  };

  const handleDelete = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index));
  };

  const handleOptionsChange = (index: number, options: FormVariantOption[]) => {
    const updated = [...variants];
    updated[index].options = options;
    onVariantsChange(updated);
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Variants</h3>
        <Button size='sm' className='gap-1' onClick={openForAdd}>
          <Plus size={16} /> Add Variant
        </Button>
      </div>

      <div className='space-y-2'>
        {variants.map((variant, index) => {
          const expanded = expandedIndex === index;
          return (
            <div key={index} className='border border-border rounded-lg overflow-hidden'>
              <div
                onClick={() => setExpandedIndex(expanded ? null : index)}
                className='w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors'
              >
                <div className='flex items-center gap-3 flex-1 text-left'>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                  <div>
                    <p className='font-medium'>{variant.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {variant.isRequired ? 'Required' : 'Optional'}
                    </p>
                  </div>
                </div>

                <div className='flex gap-1' onClick={(e) => e.stopPropagation()}>
                  <Button variant='outline' size='sm' onClick={() => openForEdit(index)}>
                    Edit
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-destructive hover:text-destructive'
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {expanded && (
                <div className='border-t border-border p-4 bg-muted/20'>
                  <VariantOptionEditor
                    variantName={variant.name}
                    options={variant.options as TVariantOption[]}
                    onOptionsChange={(opt) => handleOptionsChange(index, opt)}
                  />
                </div>
              )}
            </div>
          );
        })}
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
              <Label htmlFor='variantName'>Variant Name *</Label>
              <Input
                id='variantName'
                name='name'
                placeholder='e.g., Color, Size'
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
              />
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='required'
                checked={form.isRequired}
                onCheckedChange={(c) => updateForm('isRequired', !!c)}
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
