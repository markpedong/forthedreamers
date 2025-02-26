'use client'

import Image from 'next/image'
import styles from './styles.module.scss'
import { FormEvent, useState } from 'react'
import { addToast, Button, Form, Input } from '@heroui/react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Login = () => {
  // const [state, action, isPending] = useActionState<FormState, FormData>(login, {
  //   errors: {},
  //   values: { confirmPassword: '', email: '', password: '' }
  // })
  // const [_, startTransition] = useTransition()

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const formData = new FormData(e.currentTarget)

  //   startTransition(() => {
  //     action(formData)
  //   })
  // }
  const [isLoading, setIsLoading] = useState(false)
  const { push } = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const callback = await signIn('credentials', {
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
        redirect: false
      })

      if (callback?.ok) {
        addToast({
          title: 'Success',
          description: 'Login successful',
          color: 'success'
        })
        push('/profile')
      } else {
        addToast({ title: 'Error', description: callback?.error!, color: 'danger' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.formWrapper}>
          <Form onSubmit={handleSubmit}>
            <Input
              // defaultValue={state?.values?.email || ''}
              // errorMessage={state?.errors?.email?.[0]}
              label="Email"
              name="email"
              type="email"
              variant="bordered"
              isRequired
            />
            <Input
              // defaultValue={state?.values?.password || ''}
              // errorMessage={state?.errors?.password?.[0]}
              label="Password"
              name="password"
              type="password"
              variant="bordered"
              isRequired
            />
            <Input
              // defaultValue={state?.values?.confirmPassword || ''}
              // errorMessage={state?.errors?.confirmPassword?.[0]}
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="bordered"
              isRequired
            />
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              color="default"
              startContent={<FcGoogle />}
              variant="bordered"
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
