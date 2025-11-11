'use client';

import { useState } from 'react';
import { Trash2, Plus, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import Dialog from '@/components/reusable/dialog';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import VariantOptionEditor from './variant-option-editor';
import useFormSchema from '@/hooks/useFormSchema';
import { FormVariant, SchemaForm, TVariantOption } from '@/lib/types';
import Checkbox from '@/components/reusable/checkbox';
import classNames from 'classnames';

interface VariantEditorProps {
  variants: FormVariant[];
  onVariantsChange: (variants: FormVariant[]) => void;
}

const VariantEditor = ({ variants, onVariantsChange }: VariantEditorProps) => {
  const { variantSchema } = useFormSchema();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<SchemaForm<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: { name: '', isRequired: true }
  });

  const openForAdd = () => {
    form.reset({ name: '', isRequired: true });
    setEditingIndex(null);
    setIsOpen(true);
  };

  const openForEdit = (index: number) => {
    const v = variants[index];
    form.reset({
      id: v.id,
      name: v.name,
      isRequired: v.isRequired
    });
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleSave = (data: SchemaForm<typeof variantSchema>) => {
    const updated = [...variants];

    if (editingIndex !== null) {
      updated[editingIndex] = { ...updated[editingIndex], ...data };
    } else {
      updated.push({ ...data, options: [] });
    }

    onVariantsChange(updated);
    form.reset({ name: '', isRequired: true });
    setIsOpen(false);
  };

  const handleDelete = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index));
  };

  const handleOptionsChange = (index: number, options: TVariantOption[]) => {
    const updated = [...variants];
    updated[index].options = options;
    onVariantsChange(updated);
  };

  return (
    <div className='space-y-4'>
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
            <div key={variant.id || index} className='border border-border rounded-lg overflow-hidden'>
              <div
                onClick={() => setExpandedIndex(expanded ? null : index)}
                className='w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors'
              >
                <div className='flex items-center gap-3 flex-1 text-left'>
                  <ChevronDown
                    size={18}
                    className={classNames('text-muted-foreground transition-transform', {
                      'rotate-180': expanded
                    })}
                  />
                  <div>
                    <p className='font-medium'>{variant.name}</p>
                    <p className='text-xs text-muted-foreground'>{variant.isRequired ? 'Required' : 'Optional'}</p>
                  </div>
                </div>
                <div className='flex gap-1' onClick={e => e.stopPropagation()}>
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
                <VariantOptionEditor
                  variantName={variant.name}
                  options={variant.options as TVariantOption[]}
                  onOptionsChange={opt => handleOptionsChange(index, opt)}
                />
              )}
            </div>
          );
        })}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) form.reset({ name: '', isRequired: true });
          setIsOpen(open);
        }}
        title={`${editingIndex !== null ? 'Edit' : 'Add'} Variant`}
        triggerText={false}
        onConfirm={form.handleSubmit(handleSave)}
      >
        <Form form={form} customSubmitButton>
          <Input label='Variant Name *' name='name' placeholder='e.g., Color, Size' preventSpaces />
          <Checkbox name='isRequired' label='Is this variation is required?' />
        </Form>
      </Dialog>
    </div>
  );
};

export default VariantEditor;
