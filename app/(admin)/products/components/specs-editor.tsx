'use client';

import { FC, useState, useTransition } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/reusable/input';
import Dialog from '@/components/reusable/dialog';
import Form from '@/components/reusable/form';
import useFormSchema from '@/hooks/useFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LABEL_VALUE_DEFAULT } from '@/constants';
import { SchemaForm, SpecsEditorProps } from '@/lib/types';

const SpecsEditor: FC<SpecsEditorProps> = ({ specs, onSpecsChange }) => {
  const [isPending, startTransition] = useTransition();
  const { specFormSchema } = useFormSchema();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<SchemaForm<typeof specFormSchema>>({
    resolver: zodResolver(specFormSchema),
    defaultValues: LABEL_VALUE_DEFAULT,
  });

  const openDialog = (index?: number) => {
    form.reset(index != null ? specs[index] : LABEL_VALUE_DEFAULT);
    setEditingIndex(index ?? null);
    setDialogOpen(true);
  };

  const handleDelete = (index: number) => onSpecsChange(specs.filter((_, i) => i !== index));

  const handleSubmit = (data: SchemaForm<typeof specFormSchema>) => {
    if (!data.label?.trim() || !data.value?.trim()) return;

    startTransition(() => {
      const specData = { label: data.label.trim(), value: data.value.trim() };
      const updated =
        editingIndex != null
          ? specs.map((s, i) => (i === editingIndex ? specData : s))
          : [...specs, specData];

      onSpecsChange(updated);
      setDialogOpen(false);
      form.reset(LABEL_VALUE_DEFAULT);
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Specifications</h3>
        <Button size='sm' onClick={() => openDialog()} className='gap-1'>
          <Plus size={16} /> Add Spec
        </Button>
      </div>

      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {specs.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No specifications added yet.</p>
        ) : (
          specs.map((spec, i) => (
            <div
              key={i}
              className='flex items-center justify-between gap-2 p-3 border rounded-lg border-border'
            >
              <div className='flex-1 min-w-0'>
                <p className='text-sm text-muted-foreground'>{spec.label}</p>
                <p className='text-sm text-foreground'>{spec.value}</p>
              </div>
              <div className='flex gap-1'>
                <Button variant='outline' size='sm' onClick={() => openDialog(i)}>
                  Edit
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDelete(i)}
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
        title={editingIndex != null ? 'Edit Specification' : 'Add Specification'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        triggerText={false}
        onCancel={() => setDialogOpen(false)}
        onConfirm={form.handleSubmit(handleSubmit)}
        confirmText={editingIndex != null ? 'Save' : 'Add'}
        loading={isPending}
      >
        <Form form={form} customSubmitButton>
          <Input label='Label *' name='label' placeholder='e.g., Driver Size' preventSpaces />
          <Input label='Value *' name='value' placeholder='e.g., 40mm' preventSpaces />
        </Form>
      </Dialog>
    </div>
  );
};

export default SpecsEditor;
