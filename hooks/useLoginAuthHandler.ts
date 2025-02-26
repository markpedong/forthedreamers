import { useCallback, useTransition } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/utils/request'
import { LOGINFORM_STATE } from '@/constants/types'
import { useAppSelector } from '@/redux/store'

export const useAuthHandlers = (action: any) => {
  const { push } = useRouter()
  const loginFormState = useAppSelector(state => state.app.loginFormState)
  const [_, startTransition] = useTransition()

  const handleRegister = async (formData: FormData) => {
    const object: Record<string, string> = {}
    formData.forEach((value, key) => (object[key] = value.toString()))

    const res = await registerUser(object)
    if (res?.error) return

    await signIn('credentials', { email: object.email, password: object.password, redirect: false })
    push('/profile')
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
    [loginFormState, action]
  )

  return { handleSubmit }
}
