import { LOGINFORM_STATE } from '@/constants/types'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Button } from '@heroui/react'
import { signIn } from 'next-auth/react'
import { FC } from 'react'
import { Icon } from '@iconify/react'
import { Divider } from 'antd'
import { useRouter } from 'next/navigation'
import { setLoginFormState } from '@/redux/slices/appSlice'

interface AuthButtonsProps {
	isPending: boolean
}

const AuthButtons: FC<AuthButtonsProps> = ({ isPending }) => {
	const loginFormState = useAppSelector(state => state.app.loginFormState)
	const isSellerLogin = [LOGINFORM_STATE.SELLER_REGISTER, LOGINFORM_STATE.SELLER_LOGIN].includes(loginFormState)
	const dispatch = useAppDispatch()

	return (
		<>
			<Button type="submit" isLoading={isPending} fullWidth className="mt-5 customButton1" variant="shadow" radius="sm">
				{loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
					? isPending
						? 'Submitting...'
						: 'Submit'
					: loginFormState === LOGINFORM_STATE.USER_REGISTER
					? isPending
						? 'Registering...'
						: 'Sign up'
					: isPending
					? 'Signing in...'
					: 'Sign in'}
			</Button>
			{loginFormState !== LOGINFORM_STATE.FORGOT_PASSWORD && (
				<>
					<Divider>OR</Divider>
					<div className="flex justify-between gap-3  items-center w-full">
						{!isSellerLogin && (
							<Button
								color="default"
								startContent={<Icon icon="flat-color-icons:google" />}
								variant="bordered"
								fullWidth
								onPress={async () => await signIn('google', { callbackUrl: '/profile', redirect: true })}
							>
								{loginFormState === LOGINFORM_STATE.USER_REGISTER ? 'Sign up with Google' : 'Sign in with Google'}
							</Button>
						)}
						<Button
							className="customButton1"
							fullWidth
							startContent={<Icon icon="cryptocurrency-color:ncash" />}
							onPress={() =>
								dispatch(setLoginFormState(isSellerLogin ? LOGINFORM_STATE.USER_LOGIN : LOGINFORM_STATE.SELLER_LOGIN))
							}
						>
							{isSellerLogin ? 'Sign up as User' : 'Sign in as Seller'}
						</Button>
					</div>
				</>
			)}
		</>
	)
}

export default AuthButtons
