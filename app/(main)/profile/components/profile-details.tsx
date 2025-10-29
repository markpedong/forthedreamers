'use client';

import { FC, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useFormSchema from '@/hooks/useFormSchema';
import useValidate from '@/hooks/useFormValidate';
import { SessionUser } from '@/lib/types';
import Input from '@/components/reusable/input';
import { sendVerificationEmailAction, updateUser } from '@/lib/server-actions';

const ProfileDetails: FC<{ user: SessionUser }> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const { profileSchema } = useFormSchema();
  const { handleSubmit, register, values, errors, reset, handleErrors } = useValidate({
    schema: profileSchema,
    defaultValues: {
      name: user.name ?? '',
    },
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

  const onSubmit = () => {
    startSubmitting(async () => {
      try {
        const { name } = values();
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
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, handleErrors)} className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Input
              id='name'
              label='Name'
              type='text'
              disabled={!isEditing || isSubmitting}
              formState={errors('name')}
              {...register('name')}
            />
            <Input id='email' label='Email' type='email' disabled defaultValue={user.email} />
          </div>

          {!user.emailVerified && (
            <div className='rounded-lg bg-muted p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-foreground'>Email Verification</p>
                  <p className='text-sm text-muted-foreground'>Your email is not verified</p>
                </div>

                <Button
                  className='cursor-pointer'
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleResendVerification}
                  disabled={isPending}
                >
                  {isPending ? 'Sending...' : 'Resend'}
                </Button>
              </div>
            </div>
          )}

          <div className='flex gap-2 justify-end'>
            {!isEditing ? (
              <Button
                type='reset'
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false);
                    reset({ name: user.name });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
