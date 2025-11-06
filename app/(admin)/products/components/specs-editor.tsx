'use client';

import { FC, useState, useTransition } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/reusable/input';
import Dialog from '@/components/reusable/dialog';
import Form from '@/components/reusable/form';
import { z } from 'zod';
import useFormSchema from '@/hooks/useFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LABEL_VALUE_DEFAULT } from '@/constants';
import { SpecsEditorProps } from '@/lib/types';

const SpecsEditor: FC<SpecsEditorProps> = ({ specs, onSpecsChange }) => {
  const [isPending, startTransition] = useTransition();
  const { specsEditorSchema } = useFormSchema();
  type SpecsFormData = z.infer<typeof specsEditorSchema>;

  const form = useForm<SpecsFormData>({
    resolver: zodResolver(specsEditorSchema),
    defaultValues: LABEL_VALUE_DEFAULT,
  });

  const [open, setOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<{
    index: number;
    label: string;
    value: string;
  } | null>(null);

  const handleSubmit = ({ label, value }: SpecsFormData) => {
    if (!label.trim() || !value.trim()) return;

    startTransition(async () => {
      const updated =
        editingSpec !== null
          ? specs.map((s, i) => (i === editingSpec.index ? { label, value } : s))
          : [...specs, { label, value }];

      onSpecsChange(updated);
      setOpen(false);
      setEditingSpec(null);
      form.reset(LABEL_VALUE_DEFAULT);
    });
  };

  const handleEdit = (index: number) => {
    const { label, value } = specs[index];
    setEditingSpec({ index, label, value });
    form.reset({ label, value });
    setOpen(true);
  };

  const handleDelete = (index: number) => {
    onSpecsChange(specs.filter((_, i) => i !== index));
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Specifications</h3>
        <Button
          size='sm'
          onClick={() => {
            setEditingSpec(null);
            form.reset(LABEL_VALUE_DEFAULT);
            setOpen(true);
          }}
          className='gap-1'
        >
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
                <p className='text-sm font-medium text-muted-foreground'>{spec.label}</p>
                <p className='text-sm font-medium text-foreground'>{spec.value}</p>
              </div>
              <div className='flex gap-1'>
                <Button variant='outline' size='sm' onClick={() => handleEdit(i)}>
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
        title={editingSpec ? 'Edit Specification' : 'Add Specification'}
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (!state) {
            setEditingSpec(null);
            form.reset(LABEL_VALUE_DEFAULT);
          }
        }}
        triggerText={false}
        onCancel={() => setOpen(false)}
        onConfirm={form.handleSubmit(handleSubmit)}
        confirmText={editingSpec ? 'Save' : 'Add'}
        loading={isPending}
      >
        <Form form={form} customSubmitButton>
          <Input label='Label' name='label' placeholder='e.g., Driver Size' preventSpaces />
          <Input label='Value' name='value' placeholder='e.g., 40mm' preventSpaces />
        </Form>
      </Dialog>
    </div>
  );
};

export default SpecsEditor;
