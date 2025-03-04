import { addressInformation } from '@/actions/auth'
import { createNewAddress } from '@/utils/request'
import {
	addToast,
	Button,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea
} from '@heroui/react'
import { useSession } from 'next-auth/react'
import React, { Dispatch, FC, useActionState, useEffect, useRef, useTransition } from 'react'

type Props = {
	isNew?: boolean
	setIsNew: Dispatch<React.SetStateAction<boolean>>
	isOpen?: boolean
	onOpenChange: () => void
}

const AddressAddEdit: FC<Props> = ({ isNew, setIsNew, isOpen, onOpenChange }) => {
	const [_, startTransition] = useTransition()
	const [state, action, isPending] = useActionState(addressInformation, {
		errors: {},
		values: {}
	})
	const { data: session } = useSession()
	const formRef = useRef(null)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		startTransition(() => {
			action(formData)
		})
	}

	useEffect(() => {
		state.success && handleSuccess()
	}, [state])

	const handleSuccess = async () => {
		let res

		if (isNew) {
			res = await createNewAddress({ ...state.values, userId: session?.user.id })
			setIsNew(false)
		} else {
		}

		if (res?.success) {
			addToast({ title: 'Success', description: 'Address saved successfully', color: 'success' })
			onOpenChange()
		}
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="2xl"
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1">Add New Address</ModalHeader>
						<ModalBody>
							<Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit} ref={formRef}>
								<div className="flexAllCenter w-full gap-3">
									<Input label="First Name" name="firstName" isRequired errorMessage={state?.errors?.firstName?.[0]} />
									<Input label="Last Name" name="lastName" isRequired errorMessage={state?.errors?.lastName?.[0]} />
									<Input label="Number" name="number" isRequired errorMessage={state?.errors?.number?.[0]} />
								</div>
								<div className="flexAllCenter w-full gap-3">
									<Input label="Street" name="street" isRequired errorMessage={state?.errors?.street?.[0]} />
									<Input label="City" name="city" isRequired errorMessage={state?.errors?.city?.[0]} />
								</div>
								<div className="flexAllCenter w-full gap-3">
									<Input label="State" name="state" isRequired errorMessage={state?.errors?.state?.[0]} />
									<Input label="Zip Code" name="zipCode" isRequired errorMessage={state?.errors?.zipCode?.[0]} />
								</div>
								<Input label="Country" name="country" isRequired errorMessage={state?.errors?.country?.[0]} />
								<Textarea label="Landmark" name="landmark" errorMessage={state?.errors?.landmark?.[0]} />
							</Form>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="solid" onPress={onClose}>
								Close
							</Button>
							<Button
								className="customButton1"
								isLoading={isPending}
								onPress={() => {
									if (formRef.current) {
										const formData = new FormData(formRef.current)

										startTransition(() => {
											action(formData)
										})
									}
								}}
							>
								{isPending ? 'Adding...' : 'Add'}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default AddressAddEdit
