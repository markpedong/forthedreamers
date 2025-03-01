'use client'

import { login } from '@/actions/auth'
import { useActionState, useEffect, useTransition } from 'react'
import styles from './styles.module.scss'
import AuthForm from './form'
import AuthToggle from './footer'
import AuthButtons from './button'
import { addToast, Form } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/store'
import { LOGINFORM_STATE } from '@/constants/types'
import Image from 'next/image'
import Title from './title'
import { getSession } from 'next-auth/react'

const Login = () => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)
  const [state, action, isPending] = useActionState(login, {
    errors: {},
    values: { confirmPassword: '', email: '', password: '' }
  })
  const [_, startTransition] = useTransition()
  const { push } = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (loginFormState === LOGINFORM_STATE.REGISTER) {
      formData.append('register', 'true')
    }

    startTransition(() => {
      action(formData)
    })
  }

  useEffect(() => {
    if (state.success) {
      addToast({ title: 'Success', description: 'Login successful', color: 'success' })
      getSession().then(res => localStorage.setItem('accessToken', res?.accessToken || ''))
      push('/profile')
    }
  }, [state.success, push])

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.formWrapper}>
          <Title />
          <Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit}>
            <AuthForm state={state} />
            <AuthToggle />
            <AuthButtons isPending={isPending} />
          </Form>
        </div>
        <div className={styles.imgWrapper}>
          <Image
            src={`/images/${loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD ? 'login_cover-2' : 'login_cover'}.webp`}
            alt=""
            fill
            sizes="60vw"
            className="rounded-md"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default Login
