import { Button } from '@heroui/react'
import { FcGoogle } from 'react-icons/fc'
import { LOGINFORM_STATE } from '@/constants/types'
import { signIn } from 'next-auth/react'
import { useAppSelector } from '@/redux/store'
import { FC } from 'react'

interface AuthButtonsProps {
  isPending: boolean
}

const AuthButtons: FC<AuthButtonsProps> = ({ isPending }) => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)

  return (
    <>
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
    </>
  )
}

export default AuthButtons
