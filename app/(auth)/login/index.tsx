'use client'
import { login } from '@/actions/auth'
import { LOGINFORM_STATE } from '@/constants/types'
import { useAppSelector } from '@/redux/store'
import { setLocalStorage } from '@/utils/xLocalStorage'
import { addToast, Form } from '@heroui/react'
import { getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useTransition } from 'react'
import AuthButtons from './button'
import AuthToggle from './footer'
import AuthForm from './form'
import styles from './styles.module.scss'
import Title from './title'

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

  const handleSuccess = async () => {
    try {
      const callback = await signIn('credentials', {
        email: state.values?.email,
        password: state.values?.password,
        redirect: false
      })

      if (!callback?.ok) {
        addToast({ title: 'Error', description: 'Login failed', color: 'danger' })
        return
      }

      const token = `${(await getSession())?.accessToken}`

      addToast({ title: 'Success', description: 'Login successful', color: 'success' })
      setLocalStorage('accessToken', token?.replaceAll('"', ''))
      push('/profile')
    } catch (error) {
      addToast({ title: 'Error', description: `${error}`, color: 'danger' })
    }
  }

  useEffect(() => {
    state.success && handleSuccess()
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
