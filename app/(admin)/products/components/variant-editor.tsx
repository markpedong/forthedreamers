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

  const [state, setState] = useState({
    expanded: null as number | null,
    editing: null as number | null,
    dialogOpen: false
  });

  const form = useForm<SchemaForm<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: VARIANT_ITEM_DEFAULT
  });

  const openForAdd = () => {
    form.reset(VARIANT_ITEM_DEFAULT);
    setState({ expanded: null, editing: null, dialogOpen: true });
  };

  const openForEdit = (index: number) => {
    const v = variants[index];
    form.reset({
      id: v.id,
      name: v.name,
      isRequired: v.isRequired
    });
    setState({ ...state, editing: index, dialogOpen: true });
  };

  const handleSave = (data: SchemaForm<typeof variantSchema>) => {
    const updated = [...variants];

    if (state.editing !== null) {
      updated[state.editing] = { ...updated[state.editing], ...data };
    } else {
      updated.push({ ...data, options: [] });
    }

    onVariantsChange(updated);
    form.reset(VARIANT_ITEM_DEFAULT);
    setState({ expanded: null, editing: null, dialogOpen: false });
  };

  const handleDelete = (index: number) => {
    onVariantsChange(variants.toSpliced(index, 1));
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
        <Button size='sm' className='gap-1' onClick={openForAdd} disabled={state.dialogOpen}>
          <Plus size={16} /> Add Variant
        </Button>
      </div>

      <div className='space-y-2'>
        {variants.map((variant, index) => (
          <VariantItem
            key={variant.id || index}
            variant={variant}
            index={index}
            expanded={state.expanded === index}
            onExpand={i =>
              setState(prev => ({
                ...prev,
                expanded: prev.expanded === i ? null : i
              }))
            }
            onEdit={openForEdit}
            onDelete={handleDelete}
            onOptionsChange={handleOptionsChange}
          />
        ))}
      </div>

      <Dialog
        open={state.dialogOpen}
        onOpenChange={open => {
          if (!open) form.reset(VARIANT_ITEM_DEFAULT);
          setState(prev => ({ ...prev, dialogOpen: open }));
        }}
        title={`${state.editing !== null ? 'Edit' : 'Add'} Variant`}
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
