'use client';

import { FC, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useFormSchema from '@/hooks/useFormSchema';
import { SchemaForm, SessionUser } from '@/lib/types';
import { sendVerificationEmailAction, updateUser } from '@/lib/server-actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';

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
      </CardHeader>

      <CardContent>
        <Form form={form} onSubmit={onSubmit} customSubmitButton>
          <div className='grid gap-4 items-start sm:grid-cols-2'>
            <Input
              control={form.control}
              name='name'
              type='text'
              label='Name'
              description='Your name as displayed on your profile page'
              disabled={!isEditing || isSubmitting}
            />
            <Input
              control={form.control}
              name='email'
              label='Email'
              disabled
              description='For security purposes, we disabled editing of email'
            />
          </div>

          {!user.emailVerified && (
            <div className='rounded-lg bg-muted p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-foreground'>Email Verification</p>
                  <p className='text-sm text-muted-foreground'>Your email is not verified</p>
                </div>

                <Button
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
                    form.reset({ name: user.name });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
