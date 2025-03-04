import { addressInformation } from '@/actions/auth'
import { OPTIONS_ADDRESS } from '@/constants'
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
	Select,
	SelectItem,
	Textarea
} from '@heroui/react'
import { Addresses } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, {
	Dispatch,
	FC,
	memo,
	SetStateAction,
	useActionState,
	useEffect,
	useRef,
	useState,
	useTransition
} from 'react'

type Props = {
	isNew?: boolean
	setIsNew: Dispatch<React.SetStateAction<boolean>>
	isOpen?: boolean
	onOpenChange: () => void
	record: Addresses | null
	setRecord: Dispatch<SetStateAction<Addresses | null>>
}

const AddressAddEdit: FC<Props> = ({ isNew, setIsNew, isOpen, onOpenChange, record, setRecord }) => {
	const [_, startTransition] = useTransition()
	const [state, action, isPending] = useActionState(addressInformation, {
		errors: {},
		values: {}
	})
	const { data: session } = useSession()
	const formRef = useRef(null)
	const { refresh } = useRouter()
	const [defaultValue, setDefaultValue] = useState<Addresses | null>(null)

	useEffect(() => {
		state.success && handleSuccess()
	}, [state])

	useEffect(() => {
		record && setDefaultValue(record)
	}, [record])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		startTransition(() => {
			action(formData)
		})
	}

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
			refresh()
		}
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="2xl"
			onClose={() => {
				setRecord(null)
				onOpenChange()
				state.values = {}
			}}
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1">{isNew ? 'New' : 'Edit'} Address</ModalHeader>
						<ModalBody>
							<Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit} ref={formRef}>
								<div className="flexAllCenter w-full gap-3">
									<Input
										label="First Name"
										name="firstName"
										isRequired
										errorMessage={state?.errors?.firstName?.[0]}
										value={defaultValue?.firstName || ''}
										onChange={e => setDefaultValue(prev => ({ ...prev, firstName: e?.target?.value }))}
									/>
									<Input
										label="Last Name"
										name="lastName"
										isRequired
										errorMessage={state?.errors?.lastName?.[0]}
										value={defaultValue?.lastName}
									/>
									<Input
										label="Number"
										name="number"
										isRequired
										errorMessage={state?.errors?.number?.[0]}
										value={defaultValue?.number}
									/>
								</div>
								<div className="flexAllCenter w-full gap-3">
									<Input
										label="Street"
										name="street"
										isRequired
										errorMessage={state?.errors?.street?.[0]}
										value={defaultValue?.street}
									/>
									<Input
										label="City"
										name="city"
										isRequired
										errorMessage={state?.errors?.city?.[0]}
										value={defaultValue?.city}
									/>
								</div>
								<div className="flexAllCenter w-full gap-3">
									<Input
										label="State"
										name="state"
										isRequired
										errorMessage={state?.errors?.state?.[0]}
										value={defaultValue?.state!}
									/>
									<Input
										label="Zip Code"
										name="zipCode"
										isRequired
										errorMessage={state?.errors?.zipCode?.[0]}
										value={defaultValue?.zipCode!}
									/>
								</div>
								<div className="flexAllCenter w-full gap-3">
									<Input
										label="Country"
										name="country"
										isRequired
										errorMessage={state?.errors?.country?.[0]}
										value={defaultValue?.country}
									/>
									<Select
										items={OPTIONS_ADDRESS}
										label="Address Type:"
										placeholder="Select an address type:"
										name="addressType"
										defaultSelectedKeys={defaultValue?.type}
									>
										{animal => <SelectItem>{animal.label}</SelectItem>}
									</Select>
								</div>
								<Textarea
									label="Landmark"
									name="landmark"
									errorMessage={state?.errors?.landmark?.[0]}
									value={defaultValue?.landmark!}
								/>
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

export default memo(AddressAddEdit)
