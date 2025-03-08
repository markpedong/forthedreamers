import { LOGINFORM_STATE } from '@/constants/types'
import { useAppSelector } from '@/redux/store'
import styles from './styles.module.scss'

const Title = () => {
  const loginFormState = useAppSelector(state => state.app.loginFormState)

  return (
    <>
      <h1>
        {loginFormState === LOGINFORM_STATE.USER_LOGIN
          ? 'Welcome to For the Dreamers!👋'
          : loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
          ? 'Forgot Password'
          : 'Sign up'}
      </h1>
      <div className={styles.subHeader}>
        {loginFormState === LOGINFORM_STATE.USER_LOGIN
          ? "Discover the latest trends. It's shopping time. You choose it. Sign in to start exploring our products."
          : loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
          ? "Did you forgot your password? We're here to help you retrieve your account!"
          : 'Fill all the details below to get started, and let the shopping begin!'}
      </div>
    </>
  )
}

export default Title
