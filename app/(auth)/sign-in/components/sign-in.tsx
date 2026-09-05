'use client'

import { SchemaForm, TOnNavigate } from '@/lib/types'
import PageWrapper from './page-wrapper'
import OauthButtons from './oauth-buttons'
import Form from '@/components/reusable/form'
import Input from '@/components/reusable/input'
import { useForm } from 'react-hook-form'
import useFormSchema from '@/hooks/useFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import Divider from '@/components/reusable/divider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { getUserDB } from '@/lib/server-actions'
import { USER_ROLE } from '@/generated/prisma'
import { useAppDispatch } from '@/redux/store'
import { setSessionData } from '@/redux/features/appSlice'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const supabase = createSupabaseBrowserClient()

const SignIn = ({onNavigate}: {onNavigate: TOnNavigate}) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isSubmit, startSubmitting] = useTransition()
  const {loginSchema} = useFormSchema()

  const form = useForm<SchemaForm<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: SchemaForm<typeof loginSchema>) => {
    startSubmitting(async () => {
      const {data, error} = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      })

      if (error) {
        toast.error(error.message, {
          duration: 5000
        })
        return
      }

      if (!data.user) {
        toast.error('Unable to sign in. Please try again.', {
          duration: 5000
        })
        return
      }

      const user = await getUserDB(data.user.id)

      if (user?.role !== USER_ROLE.USER) {
        await supabase.auth.signOut()

        toast.error('You are not authorized to access this page, please use the seller panel.', {
          duration: 5000
        })

        router.refresh()
        return
      }

      if (data.session) {
        dispatch(setSessionData(data.session))
      }

      toast.success('Sign in successfully!', {
        duration: 2000
      })

      router.refresh()
    })
  }

  return (
    <PageWrapper>
      <div>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Welcome back</h1>

          <p className='text-muted-foreground'>Sign in to your account to continue</p>
        </div>

        <div className='space-y-5'>
          <Form form={form} onSubmit={onSubmit} submitLabel={isSubmit ? 'Signing in...' : 'Sign in'}>
            <Input name='email' label='Email' placeholder='you@example.com' preventSpaces disabled={isSubmit} />

            <Input name='password' label='Password' type='password' placeholder='••••••••' preventSpaces disabled={isSubmit} />

            <div className='flex items-center justify-end'>
              <span
                onClick={e => {
                  e.preventDefault()

                  if (!isSubmit) {
                    onNavigate('forgot')
                  }
                }}
                className='text-sm text-primary hover:underline cursor-pointer'
              >
                Forgot password?
              </span>
            </div>
          </Form>
        </div>

        <Divider title='or continue with' />

        <div>
          <OauthButtons />
        </div>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Don't have an account?{' '}
          <button onClick={() => onNavigate('register')} className='text-primary hover:underline' type='button'>
            Create account
          </button>
        </p>

        <Divider title='Or sign in as a seller' />

        <p className='text-center text-sm text-muted-foreground mt-4'>
          Want to sell?{' '}
          <Link href='/seller' className='text-primary hover:underline font-medium'>
            Click here
          </Link>
        </p>
      </div>
    </PageWrapper>
  )
}

export default SignIn
