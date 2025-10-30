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
import useFormSchema from '@/hooks/useFormSchema';
import { SchemaForm, SessionUser } from '@/lib/types';
import { sendVerificationEmailAction, updateUser } from '@/lib/server-actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { AlertCircle, Badge, CheckCircle2, Clock, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ProfileDetails: FC<{ user: SessionUser }> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const { nameEmailSchema } = useFormSchema();

  const form = useForm<SchemaForm<typeof nameEmailSchema>>({
    resolver: zodResolver(nameEmailSchema),
    defaultValues: { name: user.name ?? '', email: user.email ?? '' },
  });

  const handleResendVerification = () => {
    startTransition(async () => {
      try {
        await sendVerificationEmailAction(user.email);
        toast.success('Success', { description: 'Verification email sent' });
      } catch {
        toast.error('Error', { description: 'Failed to send verification email' });
      }
    });
  };

  const onSubmit = async ({ name }: SchemaForm<typeof nameEmailSchema>) => {
    startSubmitting(async () => {
      try {
        await updateUser({ name });
        toast.success('Success', { description: 'Profile updated' });
      } catch {
        toast.error('Error', { description: 'Failed to update profile' });
      } finally {
        setIsEditing(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
        <CardAction>
          <div className='flex items-center gap-2'>
            {!isEditing ? (
              <Button type='button' onClick={() => setIsEditing(true)} disabled={isSubmitting}>
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
                    form.reset({ name: user.name });
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

      <CardContent>
        <Form form={form} customSubmitButton>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Input
              control={form.control}
              name='name'
              label='Name'
              description='Your name as displayed on your profile page'
              disabled={!isEditing || isSubmitting}
            />
            <Input
              control={form.control}
              name='email'
              label='Email'
              disabled
              description='For security purposes, email editing is disabled'
            />
            <Input name='phone' type='tel' label='Phone' placeholder='+1 (555) 000-0000' />
            <Input name='dateOfBirth' type='date' label='Date of Birth' />
            <Input name='gender' label='Gender' placeholder='Male / Female / Other' />
          </div>

          <div className='flex items-start justify-between rounded-lg border border-border bg-card p-4 mt-6'>
            <div className='flex items-start gap-3'>
              <div
                className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                  user.emailVerified
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}
              >
                {user.emailVerified ? (
                  <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400' />
                ) : (
                  <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                )}
              </div>
              <div>
                <p className='font-semibold text-foreground'>Email Verification</p>
                <p className='text-sm text-muted-foreground'>
                  {user.emailVerified
                    ? 'Your email address has been verified.'
                    : 'Your email address is not verified yet.'}
                </p>
              </div>
            </div>

            {!user.emailVerified && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleResendVerification}
                disabled={isPending}
                className='bg-transparent whitespace-nowrap self-center'
              >
                Resend Email
              </Button>
            )}
          </div>

          <div className='mt-6 space-y-3 rounded-lg border border-border bg-muted/50 p-4'>
            <p className='font-semibold text-foreground'>Account Information</p>
            <div className='grid gap-3 sm:grid-cols-2'>
              {[
                { label: 'Role', value: 'User', icon: Badge },
                { label: 'Status', value: 'Active', icon: Users },
                { label: 'Member Since', value: formatDate(user.createdAt), icon: Clock },
                { label: 'Last Updated', value: formatDate(user.updatedAt), icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className='flex items-center justify-between'>
                  <span className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Icon className='h-4 w-4' /> {label}
                  </span>
                  <span className='font-medium text-foreground capitalize'>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
