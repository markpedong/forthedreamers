import { Input } from '@heroui/react'
import { useAppSelector } from '@/redux/store'
import { LOGINFORM_STATE } from '@/constants/types'

interface AuthFormProps {
  state: any
}

const AuthForm: React.FC<AuthFormProps> = ({ state }) => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)

  return (
    <>
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
              <Input defaultValue={state?.values?.firstName || ''} label="First Name" name="firstName" isRequired />
              <Input defaultValue={state?.values?.lastName || ''} label="Last Name" name="lastName" isRequired />
            </div>
          )}
          <div className="flex gap-4 w-full">
            <Input defaultValue={state?.values?.email || ''} label="Email" name="email" type="email" isRequired />
            {loginFormState === LOGINFORM_STATE.REGISTER && (
              <Input defaultValue={state?.values?.username || ''} label="User Name" name="username" isRequired />
            )}
          </div>
          <Input
            defaultValue={state?.values?.password || ''}
            label="Password"
            name="password"
            type="password"
            isRequired
          />
          <Input
            defaultValue={state?.values?.confirmPassword || ''}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            isRequired
          />
        </>
      )}
    </>
  )
}

export default AuthForm
