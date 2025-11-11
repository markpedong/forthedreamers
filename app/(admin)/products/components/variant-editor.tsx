'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import Dialog from '@/components/reusable/dialog';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import Checkbox from '@/components/reusable/checkbox';
import useFormSchema from '@/hooks/useFormSchema';
import { SchemaForm, TVariantOption, VariantEditorProps } from '@/lib/types';
import VariantItem from '@/components/reusable/variant-item';
import { VARIANT_ITEM_DEFAULT } from '@/constants';

const VariantEditor = ({ variants, onVariantsChange }: VariantEditorProps) => {
  const { variantSchema } = useFormSchema();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SchemaForm<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: VARIANT_ITEM_DEFAULT
  });

  const openForAdd = () => {
    form.reset(VARIANT_ITEM_DEFAULT);
    setEditingId(null);
    setIsOpen(true);
  };

  const openForEdit = (id: string) => {
    const variant = variants.find(v => v.id === id);
    if (!variant) return;
    form.reset({ id: variant.id, name: variant.name, isRequired: variant.isRequired });
    setEditingId(id);
    setIsOpen(true);
  };

  const handleSave = (data: SchemaForm<typeof variantSchema>) => {
    const updated = [...variants];

    if (editingId) {
      const index = updated.findIndex(v => v.id === editingId);
      if (index !== -1) updated[index] = { ...updated[index], ...data };
    } else {
      updated.push({ ...data, options: [] }); // no uuid needed, backend assigns id
    }

    onVariantsChange(updated);
    form.reset(VARIANT_ITEM_DEFAULT);
    setEditingId(null);
    setExpandedId(null);
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    onVariantsChange(variants.filter(v => v.id !== id));
  };

  const handleOptionsChange = (id: string, options: TVariantOption[]) => {
    const updated = [...variants];
    const index = updated.findIndex(v => v.id === id);
    if (index !== -1) updated[index].options = options;
    onVariantsChange(updated);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Variants</h3>
        <Button size='sm' className='gap-1' onClick={openForAdd} disabled={isOpen}>
          <Plus size={16} /> Add Variant
        </Button>
      </div>

      <div className='space-y-2'>
        {variants.map(variant => (
          <VariantItem
            key={variant.id}
            variant={variant}
            expanded={expandedId === variant.id}
            onExpand={setExpandedId}
            onEdit={openForEdit}
            onDelete={handleDelete}
            onOptionsChange={handleOptionsChange}
          />
        ))}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) form.reset(VARIANT_ITEM_DEFAULT);
          setIsOpen(open);
        }}
        title={`${editingId ? 'Edit' : 'Add'} Variant`}
        triggerText={false}
        onConfirm={form.handleSubmit(handleSave)}
      >
        <Form form={form} customSubmitButton>
          <Input label='Variant Name *' name='name' placeholder='e.g., Color, Size' preventSpaces />
          <Checkbox name='isRequired' label='Is this variation required?' />
        </Form>
      </Dialog>
    </div>
  );
};

export default VariantEditor;
