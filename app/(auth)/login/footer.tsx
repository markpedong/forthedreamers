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
        return 'Back to login'
      default:
        return 'Already have an account?'
    }
  }

  const handleToggle = () => {
    dispatch(
      setLoginFormState(
        loginFormState === LOGINFORM_STATE.LOGIN ? LOGINFORM_STATE.FORGOT_PASSWORD : LOGINFORM_STATE.LOGIN
      )
    )
  }

  return (
    <div className="flex justify-between w-full text-sm select-none">
      <span
        className="cursor-pointer"
        onClick={() => {
          if (loginFormState === LOGINFORM_STATE.LOGIN) {
            dispatch(setLoginFormState(LOGINFORM_STATE.REGISTER))
          }
        }}
      >
        {loginFormState === LOGINFORM_STATE.LOGIN ? "Don't have an account?" : ''}
      </span>
      <span className="cursor-pointer " onClick={handleToggle}>
        {getFormToggleText()}
      </span>
    </div>
  )
}

export default AuthToggle
