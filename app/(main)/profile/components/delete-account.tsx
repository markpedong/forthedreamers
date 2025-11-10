'use client';

import AlertDialog from '@/components/reusable/alert-dialog';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { Button } from '@/components/ui/button';
import useFormSchema from '@/hooks/useFormSchema';
import { authClient } from '@/lib/auth-client';
import { deleteAccount } from '@/lib/server-actions';
import { SchemaForm } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { tryWithToast } from '@/utils/helper';

type Props = {};

const DeleteAccount: FC = (props: Props) => {
  const router = useRouter();
  const [isSubmitting, startSubmitting] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { twoFactorSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async ({ otp }: SchemaForm<typeof twoFactorSchema>) => {
    if (!otp || otp.length < 6) {
      form.setError('otp', { message: 'OTP must be 6 digits' });
      form.setFocus('otp');
      return;
    }

    startSubmitting(async () => {
      const verifyResult = await tryWithToast(authClient.twoFactor.verifyTotp({ code: `${otp}` }));
      if (!verifyResult || !!verifyResult.error) return;

      const deleteResult = await tryWithToast(deleteAccount());
      if (!deleteResult) return;

      toast.success('Delete request sent successfully');
      setShowDeleteDialog(false);
      router.refresh();
    });
  };

  return (
    <>
      <section className='rounded-lg border border-destructive/30 bg-destructive/5 p-4'>
        <div className='flex items-start gap-4'>
          <div className='rounded-full bg-destructive/10 p-2'>
            <Trash2 className='h-5 w-5 text-destructive dark:text-destructive' />
          </div>

          <div className='flex-1 space-y-3'>
            <div>
              <p className='font-medium text-destructive'>Delete Account</p>
              <p className='text-sm text-muted-foreground'>
                Permanently delete your account and all associated data. This action cannot be
                undone.
              </p>
            </div>

            <div className='space-y-2'>
              <div className='rounded bg-destructive/5 px-3 py-2'>
                <p className='text-xs font-semibold text-destructive'>Warning:</p>
                <ul className='mt-1 space-y-1 text-xs text-destructive/80'>
                  <li>• All your data will be permanently deleted</li>
                  <li>• You will lose access to all linked accounts</li>
                  <li>• This action is irreversible</li>
                </ul>
              </div>
            </div>

            <Button
              variant='destructive'
              size='sm'
              onClick={() => setShowDeleteDialog(true)}
              disabled={isSubmitting}
              className='gap-2'
            >
              <Trash2 className='h-4 w-4' />
              Delete My Account
            </Button>
          </div>
        </div>
      </section>
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title='Delete Account'
        description='This action cannot be undone. Please enter your 6-digit confirmation code from your authenticator app.'
        confirmText='Delete'
        destructive
        loading={isSubmitting}
        onConfirm={form.handleSubmit(onSubmit)}
      >
        <Form form={form} customSubmitButton className='mt-6'>
          <Input id='otp' type='number' name='otp' placeholder='000000' autoFocus maxLength={6} />
        </Form>
      </AlertDialog>
    </>
  );
};

export default DeleteAccount;
