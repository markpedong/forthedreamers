'use client'

import Image from 'next/image'
import styles from './styles.module.scss'
import { useActionState, useTransition } from 'react'
import { FormState, register } from '@/actions/auth'
import { addToast, Button, Form, Input } from '@heroui/react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [state, action, isPending] = useActionState<FormState, FormData>(register, {
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

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.formWrapper}>
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
            <Button type="submit" isLoading={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              color="default"
              startContent={<FcGoogle />}
              variant="bordered"
              onPress={async () => {
                const callback = await signIn('google', { callbackUrl: '/profile' })

                if (callback?.ok) {
                  addToast({ title: 'Login successful', description: 'You have successfully logged in' })
                  push('/profile')
                }
              }}
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
