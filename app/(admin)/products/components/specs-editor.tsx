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

interface Spec {
  id?: string;
  label: string;
  value: string;
}

interface SpecsEditorProps {
  specs: Spec[];
  onSpecsChange: (specs: Spec[]) => void;
}

const SpecsEditor = ({ specs, onSpecsChange }: SpecsEditorProps) => {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ label: '', value: '' });

  const resetForm = () => {
    setForm({ label: '', value: '' });
    setEditingIndex(null);
  };

  const handleSave = () => {
    const { label, value } = form;
    if (!label.trim() || !value.trim()) return;

    const updated = [...specs];
    if (editingIndex !== null) {
      updated[editingIndex] = { ...updated[editingIndex], label, value };
    } else {
      updated.push({ label, value });
    }

    onSpecsChange(updated);
    resetForm();
    setOpen(false);
  };

  const handleEdit = (index: number) => {
    const { label, value } = specs[index];
    setForm({ label, value });
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
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Edit Specification' : 'Add Specification'}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Label</label>
              <Input
                placeholder='e.g., Driver Size'
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className='mt-1'
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Value</label>
              <Input
                placeholder='e.g., 40mm'
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className='mt-1'
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecsEditor;
