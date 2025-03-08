import { LOGINFORM_STATE } from '@/constants/types'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setLoginFormState } from '@/redux/slices/appSlice'
import { FC } from 'react'

const AuthToggle: FC = () => {
	const dispatch = useAppDispatch()
	const loginFormState = useAppSelector(state => state.app.loginFormState)
	const isSellerLogin = [LOGINFORM_STATE.SELLER_REGISTER, LOGINFORM_STATE.SELLER_LOGIN].includes(loginFormState)
	const isLogin = [LOGINFORM_STATE.USER_LOGIN, LOGINFORM_STATE.SELLER_LOGIN].includes(loginFormState)

	const getFormToggleText = () => {
		switch (loginFormState) {
			case LOGINFORM_STATE.USER_LOGIN || LOGINFORM_STATE.SELLER_LOGIN:
				return 'Forgot password'
			case LOGINFORM_STATE.FORGOT_PASSWORD:
				return 'Back to login'
			default:
				return 'Already have an account?'
		}
	}

	console.log('loginFormState', loginFormState)
	const handleToggle = () => {
		dispatch(
			setLoginFormState(
				isLogin
					? LOGINFORM_STATE.FORGOT_PASSWORD
					: isSellerLogin
					? LOGINFORM_STATE.SELLER_LOGIN
					: LOGINFORM_STATE.USER_LOGIN
			)
		)
	}

	return (
		<div className="flex justify-between w-full text-sm select-none">
			<span
				className="cursor-pointer"
				onClick={() => {
					if (isLogin) {
						dispatch(
							setLoginFormState(
								loginFormState === LOGINFORM_STATE.SELLER_LOGIN
									? LOGINFORM_STATE.SELLER_REGISTER
									: LOGINFORM_STATE.USER_REGISTER
							)
						)
					}
				}}
			>
				{isLogin ? "Don't have an account?" : ''}
			</span>
			<span className="cursor-pointer " onClick={handleToggle}>
				{getFormToggleText()}
			</span>
		</div>
	)
}

export default AuthToggle
