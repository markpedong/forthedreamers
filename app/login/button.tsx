import { Button } from '@heroui/react'
import { FcGoogle } from 'react-icons/fc'
import { LOGINFORM_STATE } from '@/constants/types'
import { getSession, signIn } from 'next-auth/react'
import { useAppSelector } from '@/redux/store'
import { FC } from 'react'
import { useTheme } from 'next-themes'
import classNames from 'classnames'

interface AuthButtonsProps {
  isPending: boolean
}

const AuthButtons: FC<AuthButtonsProps> = ({ isPending }) => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)
  const { theme } = useTheme()

  return (
    <>
      <Button
        type="submit"
        isLoading={isPending}
        fullWidth
        className={classNames('mt-5', {
          'bg-white text-black': theme === 'dark',
          'bg-black text-white': theme === 'light'
        })}
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
          onPress={async () => {
            const callback = await signIn('google', { callbackUrl: '/profile', redirect: false })
            if (callback?.ok) {
              const session = await getSession()
              localStorage.setItem('accessToken', session?.accessToken || '')
            }
          }}
        >
          {loginFormState === LOGINFORM_STATE.REGISTER ? 'Sign up with Google' : 'Sign in with Google'}
        </Button>
      )}
    </>
  )
}

export default AuthButtons
