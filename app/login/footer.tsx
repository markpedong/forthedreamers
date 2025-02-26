import { LOGINFORM_STATE } from '@/constants/types'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setLoginFormState } from '@/redux/slices/appSlice'
import { FC } from 'react'

const AuthToggle: FC = () => {
  const dispatch = useAppDispatch()
  const loginFormState = useAppSelector(state => state.app.loginFormState)

  const getFormToggleText = () => {
    switch (loginFormState) {
      case LOGINFORM_STATE.LOGIN:
        return 'Forgot password'
      case LOGINFORM_STATE.FORGOT_PASSWORD:
        return 'Create an account'
      default:
        return 'Already have an account?'
    }
  }

  const handleToggle = () => {
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

  return (
    <div className="flex justify-end w-full text-sm">
      <span className="cursor-pointer" onClick={handleToggle}>
        {getFormToggleText()}
      </span>
    </div>
  )
}

export default AuthToggle
