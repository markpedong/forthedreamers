'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import formSchemas from '@/hooks/form-schemas'
import { SchemaForm } from '@/lib/types'
import {resendVerification, updateProfile} from '@/lib/http'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { setUserData } from '@/redux/reducers/userData'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import {useMutation} from '@tanstack/react-query'

const ProfileDetails = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.userData.data)
  const [isEditing, setIsEditing] = useState(false)
  const verificationMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => toast.success('Success', {description: 'Verification email sent'}),
    onError: error => toast.error(error.message)
  })
  const profileMutation = useMutation({
    mutationFn: (name: string) => updateProfile({name}),
    onSuccess: result => {
      if (result.data?.user) dispatch(setUserData(result.data.user))
      toast.success('Success', {description: 'Profile updated'})
      setIsEditing(false)
    },
    onError: error => toast.error(error.message)
  })
  const isPending = verificationMutation.isPending
  const isSubmitting = profileMutation.isPending
  const { nameEmailSchema } = formSchemas

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchemaForm<typeof nameEmailSchema>>({
    resolver: zodResolver(nameEmailSchema),
    values: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const handleResendVerification = () => verificationMutation.mutate()

  const onSubmit = ({name}: SchemaForm<typeof nameEmailSchema>) => profileMutation.mutate(name)

  return (
    <Card id='personal-information' className='scroll-mt-24 shadow-none'>
      <CardHeader className='border-b'>
        <CardTitle className='text-lg'>Personal information</CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-foreground'>Full name</label>
            <p className='text-sm text-muted-foreground'>Shown on your account and reviews.</p>
            {isEditing ? (
              <div className='mt-2 flex gap-2'>
                <input
                  {...register('name')}
                  className='flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                  disabled={isSubmitting}
                />
                <Button type='submit' disabled={isSubmitting} size='sm'>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setIsEditing(false)
                    reset({ name: user?.name ?? '', email: user?.email ?? '' })
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className='mt-2 flex items-center gap-2'>
                <span className='text-sm text-foreground'>{user?.name}</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsEditing(true)}
                  disabled={isSubmitting}
                  className='h-6 px-2'
                >
                  Edit
                </Button>
              </div>
            )}
            {errors.name && <p className='mt-1 text-xs text-destructive'>{errors.name.message}</p>}
          </div>

          <div>
            <label className='text-sm font-medium text-foreground'>Email</label>
            <p className='text-sm text-muted-foreground'>Email changes are not currently supported.</p>
            <p className='mt-2 text-sm text-foreground'>{user?.email}</p>
          </div>

          <div className='rounded-lg border border-border bg-muted/30 p-4'>
            <div className='flex items-start gap-3'>
              <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                user?.emailVerified
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                {user?.emailVerified ? (
                  <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400' />
                ) : (
                  <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                )}
              </div>
              <div className='flex-1'>
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
                className='mt-3'
              >
                Resend Email
              </Button>
            )}
          </div>

          <dl className='grid grid-cols-2 gap-x-4 gap-y-3 text-sm'>
            <dt className='text-muted-foreground'>Account role</dt>
            <dd className='text-right font-medium capitalize text-foreground'>
              {user?.role?.toLowerCase() || 'User'}
            </dd>
            {user?.createdAt && (
              <>
                <dt className='flex items-center gap-2 text-muted-foreground'>Member since</dt>
                <dd className='text-right font-medium text-foreground'>
                  {formatDate(new Date(user.createdAt), 'MM/DD/YYYY')}
                </dd>
              </>
            )}
            {user?.updatedAt && (
              <>
                <dt className='text-muted-foreground'>Last updated</dt>
                <dd className='text-right font-medium text-foreground'>
                  {formatDate(new Date(user.updatedAt))}
                </dd>
              </>
            )}
          </dl>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProfileDetails
