'use client';

import { FC, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/reusable/input';
import Dialog from '@/components/reusable/dialog';
import { SpecsEditorProps } from '@/lib/types';

const SpecsEditor: FC<SpecsEditorProps> = ({ specs, onSpecsChange }) => {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // const { specsEditorSchema } = useFormSchema();
  // const form = useForm<SchemaForm<typeof specsEditorSchema>>({
  //   resolver: zodResolver(specsEditorSchema),
  //   defaultValues: {
  //     label: '',
  //     value: '',
  //   },
  // });

  const resetForm = () => {
    setEditingIndex(null);
  };

  // const onSubmit = ({ label, value }: SchemaForm<typeof specsEditorSchema>) => {
  //   if (!label.trim() || !value.trim()) return;

  //   const updated = [...specs];
  //   if (editingIndex !== null) {
  //     updated[editingIndex] = { ...updated[editingIndex], label, value };
  //   } else {
  //     updated.push({ label, value });
  //   }

  //   onSpecsChange(updated);
  //   resetForm();
  //   setOpen(false);
  // };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setOpen(true);
  };

  const handleDelete = (index: number) => onSpecsChange(specs.filter((_, i) => i !== index));

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Specifications</h3>
        <Button size='sm' onClick={() => setOpen(true)} className='gap-1'>
          <Plus size={16} /> Add Spec
        </Button>
      </div>

      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {specs.map((spec, i) => (
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
        ))}
      </div>
      <Dialog
        title={editingIndex !== null ? 'Edit Specification' : 'Add Specification'}
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetForm();
        }}
        triggerText={false}
        onCancel={() => setOpen(false)}
        // onConfirm={form.handleSubmit(onSubmit)}
      >
        <Input label='Label' name='label' placeholder='e.g., Driver Size' />
        <Input label='Value' name='value' placeholder='e.g., 40mm' />
      </Dialog>
    </div>
  );
};

export default SpecsEditor;
