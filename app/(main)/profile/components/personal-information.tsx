import { personalInformation } from '@/actions/auth'
import { DatePicker, Form, Input } from '@heroui/react'
import { Typography } from 'antd'
import { useSession } from 'next-auth/react'
import { useActionState, useTransition } from 'react'

type Props = {}

const PersonalInformation = (props: Props) => {
	const { data: session } = useSession()
	const [state, action, isPending] = useActionState(personalInformation, {
		errors: {},
		values: session?.user
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
					<Input name="firstName" label="First Name" size="sm" />
					<Input name="lastName" label="Last Name" size="sm" />
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
