'use client'

import Image from 'next/image'
import styles from './styles.module.scss'
import { useActionState, useCallback, useEffect, useTransition } from 'react'
import { addToast, Button, Form, Input } from '@heroui/react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { FormState, LOGINFORM_STATE } from '@/constants/types'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/auth'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setLoginFormState } from '@/redux/slices/appSlice'
import { registerUser } from '@/utils/request'

const Login = () => {
  const loginFormState = useAppSelector(s => s.app.loginFormState)
  const [state, action, isPending] = useActionState<FormState, FormData>(login, {
    errors: {},
    values: { confirmPassword: '', email: '', password: '', firstName: '', lastName: '', username: '' }
  })
  const [_, startTransition] = useTransition()
  const dispatch = useAppDispatch()
  const { push } = useRouter()

  const handleRegister = async (formData: FormData) => {
    try {
      const object: Record<string, string> = {}
      formData.forEach((value, key) => {
        object[key] = value.toString()
      })

      const res = await registerUser(object)

      if (res?.error) {
        addToast({ title: 'Error', description: res.error, color: 'danger' })
        return
      }

      const { email, password } = object

      const callback = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (callback?.ok) {
        addToast({ title: 'Success', description: 'Registration successful', color: 'success' })
        push('/profile')
      } else {
        addToast({ title: 'Error', description: callback?.error || 'Login failed after registration', color: 'danger' })
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unexpected error',
        color: 'danger'
      })
    }
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)

      startTransition(() => {
        if (loginFormState === LOGINFORM_STATE.REGISTER) {
          handleRegister(formData)
        } else {
          action(formData)
        }
      })
    },
    [loginFormState, handleRegister, action]
  )

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
                {loginFormState === LOGINFORM_STATE.REGISTER && (
                  <div className="flex gap-4 w-full">
                    <Input
                      defaultValue={state?.values?.firstName || ''}
                      errorMessage={state?.errors?.firstName?.[0]}
                      label="First Name"
                      name="firstName"
                      type="text"
                      variant="bordered"
                      isRequired
                    />
                    <Input
                      defaultValue={state?.values?.lastName || ''}
                      errorMessage={state?.errors?.lastName?.[0]}
                      label="Last Name"
                      name="lastName"
                      type="text"
                      variant="bordered"
                      isRequired
                    />
                  </div>
                )}
                <div className="flex gap-4 w-full">
                  <Input
                    defaultValue={state?.values?.email || ''}
                    errorMessage={state?.errors?.email?.[0]}
                    label="Email"
                    name="email"
                    type="email"
                    variant="bordered"
                    isRequired
                  />
                  {loginFormState === LOGINFORM_STATE.REGISTER && (
                    <Input
                      defaultValue={state?.values?.username || ''}
                      errorMessage={state?.errors?.username?.[0]}
                      label="User Name"
                      name="username"
                      type="username"
                      variant="bordered"
                      isRequired
                    />
                  )}
                </div>

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
                : loginFormState === LOGINFORM_STATE.REGISTER
                ? isPending
                  ? 'Registering...'
                  : 'Sign up'
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
                {loginFormState === LOGINFORM_STATE.REGISTER ? 'Sign up with Google' : 'Sign in with Google'}
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
