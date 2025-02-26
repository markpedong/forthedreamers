'use client'

import { login } from '@/actions/auth'
import { useActionState, useEffect } from 'react'
import styles from './styles.module.scss'
import AuthForm from './form'
import AuthToggle from './footer'
import AuthButtons from './button'
import { useAuthHandlers } from '@/hooks/useLoginAuthHandler'
import { addToast, Form } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/store'
import { LOGINFORM_STATE } from '@/constants/types'
import Image from 'next/image'

const Login = () => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)
  const [state, action, isPending] = useActionState(login, {
    errors: {},
    values: { confirmPassword: '', email: '', password: '' }
  })
  const { handleSubmit } = useAuthHandlers(action)
  const { push } = useRouter()

  useEffect(() => {
    if (state.success) {
      addToast({ title: 'Success', description: 'Login successful', color: 'success' })
      push('/profile')
    }
  }, [state.success, push])

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.formWrapper}>
          <h1>
            {loginFormState === LOGINFORM_STATE.LOGIN
              ? 'Welcome to For the Dreamers!👋'
              : loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
              ? 'Forgot Password'
              : 'Sign up'}
          </h1>
          <div className={styles.subHeader}>
            {loginFormState === LOGINFORM_STATE.LOGIN
              ? "Discover the latest trends. It's shopping time. You choose it. Sign in to start exploring our products."
              : loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
              ? "Did you forgot your password? We're here to help you retrieve your account!"
              : 'Fill all the details below to get started, and let the shopping begin!'}
          </div>
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
