'use client';

import { FC, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { deletePasskey } from '@/lib/server-actions';
import AlertDialog from '@/components/reusable/alert-dialog';
import useFormSchema from '@/hooks/useFormSchema';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { passkey } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { tryWithToast } from '@/utils/helper';

type Passkey = {
  id: string;
  name?: string | null;
  createdAt: Date;
};

const PasskeysSection: FC<{ passkeys: Passkey[] }> = ({ passkeys }) => {
  const router = useRouter();
  const { passkeySchema } = useFormSchema();

  const form = useForm<z.infer<typeof passkeySchema>>({
    resolver: zodResolver(passkeySchema),
    defaultValues: { name: '' },
  });

  const [isSubmitting, startSubmitting] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const [isAddModal, setIsAddModal] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<Passkey | null>(null);

  const onSubmit = async ({ name }: z.infer<typeof passkeySchema>) => {
    startSubmitting(async () => {
      if (isAddModal) {
        const res = await tryWithToast(passkey.addPasskey({ name }));
        if (!res || res?.error) return;

        toast.success('Passkey added successfully');
      } else if (selectedPasskey) {
        const result = await tryWithToast(deletePasskey(selectedPasskey.id));
        if (!result) return;

        toast.success('Passkey deleted successfully');
      }

      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <Card>
        <CardHeader className='flex items-center justify-between'>
          <div>
            <CardTitle>Passkeys</CardTitle>
            <CardDescription>Manage your passkeys for secure authentication</CardDescription>
          </div>
          <Button
            onClick={() => {
              setIsAddModal(true);
              setSelectedPasskey(null);
              form.reset(); // ✅ clear old errors/values
              setIsOpen(true);
            }}
          >
            Add Passkey
          </Button>
        </CardHeader>

        <CardContent>
          {passkeys.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-sm text-muted-foreground'>No passkeys yet</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Add your first passkey to get started with passwordless authentication
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {passkeys.map((passkey) => (
                <div
                  key={passkey.id}
                  className='flex items-center justify-between p-3 border rounded-lg bg-muted/30'
                >
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{passkey.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      Created {passkey.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-destructive hover:text-destructive'
                    onClick={() => {
                      setIsAddModal(false);
                      setSelectedPasskey(passkey);
                      form.reset();
                      setIsOpen(true);
                    }}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        title={isAddModal ? 'Add New Passkey' : 'Delete Passkey?'}
        description={
          isAddModal
            ? 'Enter a name for your new passkey'
            : `Are you sure you want to delete "${selectedPasskey?.name}"?`
        }
        confirmText={isAddModal ? 'Add Passkey' : 'Delete'}
        loading={isSubmitting}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={isAddModal ? form.handleSubmit(onSubmit) : () => onSubmit({ name: '' })}
      >
        {isAddModal && (
          <Form form={form} customSubmitButton className='mt-4'>
            <Input
              name='name'
              type='text'
              placeholder='Passkey name (e.g., My Phone, Work Computer)'
              preventSpaces
            />
          </Form>
        )}
      </AlertDialog>
    </>
  );
};

export default PasskeysSection;
