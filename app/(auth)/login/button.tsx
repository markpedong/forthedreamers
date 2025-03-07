import { LOGINFORM_STATE } from '@/constants/types'
import { useAppSelector } from '@/redux/store'
import { Button } from '@heroui/react'
import { signIn } from 'next-auth/react'
import { FC } from 'react'
import { Icon } from '@iconify/react'
import { Divider } from 'antd'
import { useRouter } from 'next/navigation'

interface AuthButtonsProps {
  isPending: boolean
}

const AuthButtons: FC<AuthButtonsProps> = ({ isPending }) => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)
  const { push } = useRouter()

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
      <Divider>OR</Divider>
      {loginFormState !== LOGINFORM_STATE.FORGOT_PASSWORD && (
        <div className="grid grid-cols-2 gap-3  items-center w-full">
          <Button
            color="default"
            startContent={<Icon icon="flat-color-icons:google" />}
            variant="bordered"
            fullWidth
            onPress={async () => await signIn('google', { callbackUrl: '/profile', redirect: true })}
          >
            {loginFormState === LOGINFORM_STATE.REGISTER ? 'Sign up with Google' : 'Sign in with Google'}
          </Button>
          <Button
            className="customButton1"
            fullWidth
            startContent={<Icon icon="cryptocurrency-color:ncash" />}
            onPress={() => push('/seller')}
          >
            Sign in as Seller
          </Button>
        </div>
      )}
    </>
  )
}

export default AuthButtons
