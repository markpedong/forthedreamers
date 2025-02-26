'use client'

import Image from 'next/image'
import styles from './styles.module.scss'
import { useActionState, useEffect, useTransition } from 'react'
import { addToast, Button, Form, Input } from '@heroui/react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { FormState, LOGINFORM_STATE } from '@/constants/types'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/auth'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setLoginFormState } from '@/redux/slices/appSlice'

const Login = () => {
  const loginFormState = useAppSelector(s => s.app.loginFormState)
  const [state, action, isPending] = useActionState<FormState, FormData>(login, {
    errors: {},
    values: { confirmPassword: '', email: '', password: '' }
  })
  const [_, startTransition] = useTransition()
  const dispatch = useAppDispatch()
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
            {loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD ? (
              <Input
                defaultValue={state?.values?.email || ''}
                errorMessage={state?.errors?.email?.[0]}
                label="Email"
                name="email"
                type="email"
                variant="bordered"
                isRequired
              />
            ) : (
              <>
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
              </>
            )}
            <div className="flex justify-end w-full text-sm">
              <span
                className="cursor-pointer "
                onClick={() =>
                  dispatch(
                    setLoginFormState(
                      loginFormState === LOGINFORM_STATE.LOGIN
                        ? LOGINFORM_STATE.FORGOT_PASSWORD
                        : loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
                        ? LOGINFORM_STATE.REGISTER
                        : LOGINFORM_STATE.LOGIN
                    )
                  )
                }
              >
                {loginFormState === LOGINFORM_STATE.LOGIN
                  ? 'Forgot password'
                  : loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
                  ? 'Create an account'
                  : 'Already have an account?'}
              </span>
            </div>
            <Button
              type="submit"
              isLoading={isPending}
              fullWidth
              className="mt-5 bg-black text-white"
              variant="shadow"
              radius="sm"
            >
              {loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
                ? isPending
                  ? 'Submitting...'
                  : 'Submit'
                : isPending
                ? 'Signing in...'
                : 'Sign in'}
            </Button>
            {loginFormState !== LOGINFORM_STATE.FORGOT_PASSWORD && (
              <Button
                color="default"
                startContent={<FcGoogle />}
                variant="bordered"
                fullWidth
                className="mt-2"
                onPress={async () => await signIn('google', { callbackUrl: '/profile', redirect: true })}
              >
                Sign in with Google
              </Button>
            )}
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
