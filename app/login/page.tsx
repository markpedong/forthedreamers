'use client'

import Image from 'next/image'
import styles from './styles.module.scss'
import { useActionState, useEffect, useTransition } from 'react'
import { addToast, Button, Form, Input } from '@heroui/react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { FormState } from '@/constants/types'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/auth'

const Login = () => {
  const [state, action, isPending] = useActionState<FormState, FormData>(login, {
    errors: {},
    values: { confirmPassword: '', email: '', password: '' }
  })
  const [_, startTransition] = useTransition()
  const { push } = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(() => {
      action(formData)
    })
  }

  useEffect(() => {
    if (state.success) {
      addToast({
        title: 'Success',
        description: 'Login successful',
        color: 'success'
      })

      push('/profile')
    }
  }, [state.success])

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.formWrapper}>
          <h1>Welcome 👋</h1>
          <span className={styles.subHeader}>
            Discover the latest trends. It's shopping time. You choose it. Sign in to start exploring our products.
          </span>
          <Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit}>
            <Input
              defaultValue={state?.values?.email || ''}
              errorMessage={state?.errors?.email?.[0]}
              label="Email"
              name="email"
              type="email"
              variant="bordered"
              isRequired
            />
            <Input
              defaultValue={state?.values?.password || ''}
              errorMessage={state?.errors?.password?.[0]}
              label="Password"
              name="password"
              type="password"
              variant="bordered"
              isRequired
            />
            <Input
              defaultValue={state?.values?.confirmPassword || ''}
              errorMessage={state?.errors?.confirmPassword?.[0]}
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="bordered"
              isRequired
            />
            <Button
              type="submit"
              isLoading={isPending}
              fullWidth
              className="mt-5 bg-black text-white"
              variant="shadow"
              radius="sm"
            >
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              color="default"
              startContent={<FcGoogle />}
              variant="bordered"
              fullWidth
              className='mt-2'
              onPress={async () => await signIn('google', { callbackUrl: '/profile', redirect: true })}
            >
              Sign in with Google
            </Button>
          </Form>
        </div>
        <div className={styles.imgWrapper}>
          <Image src={'/images/login_cover.webp'} alt="" fill sizes="60vw" className="rounded-md" priority />
        </div>
      </div>
    </div>
  )
}

export default Login
