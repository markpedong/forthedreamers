import { LOGINFORM_STATE } from '@/constants/types'
import { useAppSelector } from '@/redux/store'
import { Button } from '@heroui/react'
import { signIn } from 'next-auth/react'
import { FC } from 'react'
import { FcGoogle } from 'react-icons/fc'

interface AuthButtonsProps {
  isPending: boolean
}

const AuthButtons: FC<AuthButtonsProps> = ({ isPending }) => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)

  return (
    <>
      <Button type="submit" isLoading={isPending} fullWidth className="mt-5 customButton1" variant="shadow" radius="sm">
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
    </>
  )
}

export default AuthButtons
