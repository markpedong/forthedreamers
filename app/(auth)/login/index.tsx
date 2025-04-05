'use client'
import { login } from '@/actions/auth'
import { LOGINFORM_STATE } from '@/constants/types'
import { useAppSelector } from '@/redux/store'
import { setLocalStorage } from '@/utils/xLocalStorage'
import { addToast, Form } from '@heroui/react'
import { getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useTransition } from 'react'
import AuthButtons from './button'
import AuthToggle from './footer'
import AuthForm from './form'
import styles from './styles.module.scss'
import Title from './title'
import { registerUser } from '@/utils/request'
import classNames from 'classnames'
import { USER_ROLE } from '@prisma/client'

const Login = () => {
	const loginFormState = useAppSelector(state => state.app.loginFormState)
	const isSellerLogin = [LOGINFORM_STATE.SELLER_REGISTER, LOGINFORM_STATE.SELLER_LOGIN].includes(loginFormState)
	const [state, action] = useActionState(login, {
		errors: {},
		values: {}
	})
	const [isPending, startTransition] = useTransition()
	const { push } = useRouter()

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		startTransition(() => {
			action(formData)
		})
	}

	const handleSuccess = () => {
		startTransition(async () => {
			if ([LOGINFORM_STATE.SELLER_REGISTER, LOGINFORM_STATE.USER_REGISTER].includes(loginFormState)) {
				const res = await registerUser({
					...state.values,
					role: loginFormState === LOGINFORM_STATE.SELLER_REGISTER ? USER_ROLE.SELLER : USER_ROLE.USER
				})
				if (!res.success) {
					addToast({ title: 'Error', description: 'Registration failed', color: 'danger' })
					return
				}
				await new Promise(resolve => setTimeout(resolve, 300))
			}

			const callback = await signIn('credentials', {
				email: state.values?.email,
				password: state.values?.password,
				type: isSellerLogin ? 'seller' : 'user',
				redirect: false
			})

			if (!callback?.ok) {
				addToast({ title: 'Error', description: 'Login failed', color: 'danger' })
				return
			}

			const userinfo = await getSession()
			addToast({ title: 'Success', description: 'Login successful', color: 'success' })
			setLocalStorage('accessToken', userinfo?.accessToken)
			push(userinfo?.user.role === USER_ROLE.SELLER ? '/seller-dashboard' : '/profile')
		})
	}

	useEffect(() => {
		state.success && handleSuccess()
	}, [state])

	return (
		<div className={styles.loginWrapper}>
			<div className={styles.loginContainer}>
				<div
					className={classNames(styles.formWrapper, {
						'order-2': [LOGINFORM_STATE.SELLER_LOGIN, LOGINFORM_STATE.SELLER_REGISTER].includes(loginFormState)
					})}
				>
					<Title />
					<Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit}>
						<AuthForm state={state} />
						<AuthToggle />
						<AuthButtons isPending={isPending} />
					</Form>
				</div>
				<div className={styles.imgWrapper}>
					<Image
						src={`/images/${
							loginFormState === LOGINFORM_STATE.FORGOT_PASSWORD
								? 'login_cover-2'
								: isSellerLogin
								? 'login_cover-2'
								: 'login_cover'
						}.webp`}
						alt=""
						fill
						sizes="60vw"
						className="rounded-md"
						priority
					/>
				</div>
			</div>
		</div>
	)
}

export default Login
