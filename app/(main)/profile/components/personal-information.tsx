import { personalInformation } from '@/actions/auth'
import { DatePicker, Form, Input } from '@heroui/react'
import { Users } from '@prisma/client'
import { Typography } from 'antd'
import { FC, useActionState, useTransition } from 'react'

const PersonalInformation: FC<{ user: Users }> = ({ user }) => {
	const [state, action, isPending] = useActionState(personalInformation, {
		errors: {},
		values: {}
	})
	const [_, startTransition] = useTransition()

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		startTransition(() => {
			action(formData)
		})
	}

	return (
		<div>
			<Typography.Title level={4}>Personal Information</Typography.Title>
			<Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-3 w-full">
					<Input name="firstName" label="First Name" size="sm" defaultValue={`${user?.firstName}`} />
					<Input name="lastName" label="Last Name" size="sm" defaultValue={`${user?.lastName}`} />
				</div>
				<div className="grid grid-cols-2 gap-3 w-full">
					<DatePicker label="Birth date" size="sm" />
					<div />
				</div>
			</Form>
		</div>
	)
}

export default PersonalInformation
