'use client';

import { FC, useState, useTransition } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import formSchemas from '@/hooks/form-schemas';
import { SchemaForm } from '@/lib/types';
import { sendVerificationEmailAction, updateUser } from '@/lib/server-actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { AlertCircle, CalendarDays, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { tryWithToast } from '@/utils/helper';
import { useAuthSession } from '@/lib/supabase/auth-context';

const ProfileDetails: FC = () => {
  const { session } = useAuthSession();
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const { nameEmailSchema } = formSchemas;

  const form = useForm<SchemaForm<typeof nameEmailSchema>>({
    resolver: zodResolver(nameEmailSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const handleResendVerification = () => {
    startTransition(async () => {
      const result = await tryWithToast(sendVerificationEmailAction(`${user?.email}`));
      if (!result?.status) return;

      toast.success('Success', { description: 'Verification email sent' });
    });
  };

  const onSubmit = async ({ name }: SchemaForm<typeof nameEmailSchema>) => {
    startSubmitting(async () => {
      const result = await tryWithToast(updateUser({ name }));
      if (!result) return;

      toast.success('Success', { description: 'Profile updated' });
      setIsEditing(false);
    });
  };

  return (
    <Card id='personal-information' className='scroll-mt-24 shadow-none'>
      <CardHeader className='border-b'>
        <CardTitle className='text-xl'>Personal information</CardTitle>
        <CardDescription>Your name and primary account email.</CardDescription>
        <CardAction className='max-sm:relative max-sm:col-span-2 max-sm:col-start-1 max-sm:row-start-3 max-sm:w-full'>
          <div className='flex flex-wrap items-center gap-2 max-sm:mt-2'>
            {!isEditing ? (
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditing(true)}
                disabled={isSubmitting}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type='button' disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false);
                    form.reset({ name: user?.name ?? '', email: user?.email ?? '' });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-6'>
        <Form form={form} customSubmitButton>
          <div className='grid gap-5 sm:grid-cols-2'>
            <Input
              name='name'
              label='Full name'
              description='Shown on your account and reviews.'
              disabled={!isEditing || isSubmitting}
            />
            <Input
              name='email'
              label='Email'
              disabled
              description='Email changes are not currently supported.'
            />
          </div>

          <div className='mt-6 flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-start gap-3'>
              <div
                className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                  user?.emailVerified
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}
              >
                {user?.emailVerified ? (
                  <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400' />
                ) : (
                  <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                )}
              </div>
              <div>
                <p className='font-medium text-foreground'>Email verification</p>
                <p className='text-sm text-muted-foreground'>
                  {user?.emailVerified
                    ? 'Your email address has been verified.'
                    : 'Your email address is not verified yet.'}
                </p>
              </div>
            </div>

            {!user?.emailVerified && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleResendVerification}
                disabled={isPending}
                className='self-start whitespace-nowrap sm:self-center'
              >
                Resend Email
              </Button>
            )}
          </div>

          <dl className='divide-y divide-border rounded-lg border border-border'>
            <div className='grid grid-cols-2 gap-4 p-3 text-sm'>
              <dt className='text-muted-foreground'>Account role</dt>
              <dd className='text-right font-medium capitalize text-foreground'>
                {user?.role?.toLowerCase() || 'User'}
              </dd>
            </div>
            {user?.createdAt && (
              <div className='grid grid-cols-2 gap-4 p-3 text-sm'>
                <dt className='flex items-center gap-2 text-muted-foreground'>
                  <CalendarDays className='h-4 w-4' /> Member since
                </dt>
                <dd className='text-right font-medium text-foreground'>
                  {formatDate(new Date(user.createdAt), 'MM/DD/YYYY')}
                </dd>
              </div>
            )}
            {user?.updatedAt && (
              <div className='grid grid-cols-2 gap-4 p-3 text-sm'>
                <dt className='text-muted-foreground'>Last updated</dt>
                <dd className='text-right font-medium text-foreground'>
                  {formatDate(new Date(user.updatedAt))}
                </dd>
              </div>
            )}
          </dl>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
