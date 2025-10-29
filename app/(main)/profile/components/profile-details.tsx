'use client';

import { FC, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useFormSchema from '@/hooks/useFormSchema';
import useValidate from '@/hooks/useFormValidate';
import { SessionUser } from '@/lib/types';
import Input from '@/components/reusable/input';

interface ProfileDetailsProps {
  user: SessionUser;
}

const ProfileDetails: FC<ProfileDetailsProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { profileSchema, profileDefaultValues } = useFormSchema();
  const { handleSubmit, register, values, errors, reset, setValue, handleErrors } = useValidate({
    schema: profileSchema,
    defaultValues: profileDefaultValues,
  });

  const handleResendVerification = () => {
    startTransition(async () => {
      try {
        // await resendVerificationEmail(user.email);
        toast.success('Success', { description: 'Verification email sent' });
      } catch {
        toast.error('Error', { description: 'Failed to send verification email' });
      }
    });
  };

  const onSubmit = () => {};

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
              disabled={!isEditing || isPending}
              formState={errors('name')}
              {...register('name')}
            />
            <Input
              id='email'
              label='Email'
              type='email'
              disabled={!isEditing || isPending}
              formState={errors('email')}
              {...register('email')}
            />
          </div>

          <div className='rounded-lg bg-muted p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-foreground'>Email Verification</p>
                <p className='text-sm text-muted-foreground'>
                  {user.emailVerified ? 'Your email is verified' : 'Your email is not verified'}
                </p>
              </div>

              {!user.emailVerified && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleResendVerification}
                  disabled={isPending}
                >
                  {isPending ? 'Sending...' : 'Resend'}
                </Button>
              )}
            </div>
          </div>

          <div className='flex gap-2'>
            {!isEditing ? (
              <Button type='button' onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type='submit' disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false);
                    reset({ name: user.name, email: user.email });
                  }}
                  disabled={isPending}
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
