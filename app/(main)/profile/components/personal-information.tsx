import { personalInformation } from '@/actions/auth'
import { Button, DatePicker, Form, Input } from '@heroui/react'
import { Users } from '@prisma/client'
import { Typography } from 'antd'
import classNames from 'classnames'
import { useTheme } from 'next-themes'
import { FC, useActionState, useEffect, useTransition } from 'react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'

const PersonalInformation: FC<{ user: Users | undefined }> = ({ user }) => {
	const [state, action, isPending] = useActionState(personalInformation, {
		errors: {},
		values: {}
	})
	const [_, startTransition] = useTransition()
	const { theme } = useTheme()

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		startTransition(() => {
			action(formData)
		})
	}

	useEffect(() => {
		console.log('state', state)
		if (state.success) {
			console.log('success')
		}
	}, [state])

	return (
		<div>
			<Typography.Title level={4}>Personal Information</Typography.Title>
			<Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-3 w-full">
					<Input
						name="firstName"
						label="First Name"
						size="sm"
						defaultValue={`${user?.firstName}`}
						errorMessage={state?.errors?.firstName?.[0]}
					/>
					<Input
						name="lastName"
						label="Last Name"
						size="sm"
						defaultValue={`${user?.lastName}`}
						errorMessage={state?.errors?.lastName?.[0]}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3 w-full">
					<DatePicker
						name="birthday"
						label="Birthday"
						showMonthAndYearPickers
						size="sm"
						defaultValue={!!user?.birthday ? parseDate(user?.birthday) : undefined}
						maxValue={today(getLocalTimeZone())}
						errorMessage={state?.errors?.birthday?.[0]}
					/>
					<Input name="email" label="Email" size="sm" defaultValue={`${user?.email}`} readOnly />
				</div>
				<Button
					type="submit"
					isLoading={isPending}
					fullWidth
					className={classNames('mt-7', {
						'bg-white text-black': theme === 'dark',
						'bg-black text-white': theme === 'light'
					})}
					variant="shadow"
					radius="sm"
				>
					{isPending ? 'Updating...' : 'Update Information'}
				</Button>
			</Form>
		</div>
	)
}

export default PersonalInformation
