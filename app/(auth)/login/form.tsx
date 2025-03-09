import { Input } from '@heroui/react'
import { useAppSelector } from '@/redux/store'
import { LOGINFORM_STATE } from '@/constants/types'

interface AuthFormProps {
	state: any
}

const AuthForm: React.FC<AuthFormProps> = ({ state }) => {
	const loginFormState = useAppSelector(state => state.app.loginFormState)
	const isRegister = [LOGINFORM_STATE.USER_REGISTER, LOGINFORM_STATE.SELLER_REGISTER].includes(loginFormState)
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
					{isRegister && (
						<div className="flex gap-4 w-full">
							<Input defaultValue={state?.values?.firstName || ''} label="First Name" name="firstName" isRequired />
							<Input defaultValue={state?.values?.lastName || ''} label="Last Name" name="lastName" isRequired />
						</div>
					)}
					<div className="flex gap-4 w-full">
						<Input
							defaultValue={state?.values?.email || ''}
							label={loginFormState ? 'Email' : 'Email/Username'}
							name="email"
							type={loginFormState ? 'email' : 'text'}
							isRequired
						/>
						{isRegister && (
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
