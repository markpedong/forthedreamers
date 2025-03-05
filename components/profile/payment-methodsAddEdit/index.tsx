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
	SelectItem
} from '@heroui/react'
import React, { FC, useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { Icon } from '@iconify/react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { PAYMENT_TYPE, PaymentMethods } from '@prisma/client'
import { submitPM } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { setPaymentMethod } from '@/redux/slices/userSlice'
import { createPaymentMethod, updatePaymentMethod } from '@/utils/request'
import { useSession } from 'next-auth/react'

type Props = {
	isOpen: boolean
	onOpenChange: () => void
}

const AddEditPaymentMethods: FC<Props> = ({ isOpen, onOpenChange }) => {
	const paymentMethod = useAppSelector(s => s.user.paymentMethod)
	const [pmValues, setPmValues] = useState<PaymentMethods | null>(null)
	const [isPending, submit] = useTransition()
	const [_, startTransition] = useTransition()
	const [state, action] = useActionState(submitPM, {
		errors: {},
		values: {}
	})
	const { refresh } = useRouter()
	const dispatch = useAppDispatch()
	const { data: session } = useSession()
	const formRef = useRef(null)

	useEffect(() => {
		state.success && handleSuccess()
	}, [state])

	useEffect(() => {
		if (!pmValues?.id) {
			setPmValues(null)
		} else {
			setPmValues(pmValues)
		}
	}, [paymentMethod])

	const handleSuccess = () => {
		let res

		submit(async () => {
			if (!paymentMethod?.id) {
				res = await createPaymentMethod({ ...pmValues, userId: session?.user.id })
			} else {
				res = await updatePaymentMethod({ ...pmValues, id: paymentMethod?.id })
			}

			if (res?.success) {
				addToast({ title: 'Success', description: 'Address saved successfully', color: 'success' })
				onOpenChange()
				refresh()
				setPmValues(null)
				dispatch(setPaymentMethod(null))
			}
		})
	}

	const handleChange =
		(key: keyof PaymentMethods) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			//@ts-expect-error type error
			setPmValues(prev => ({
				...(prev ?? {}),
				[key]: e.target.value
			}))
		}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader>{paymentMethod?.id ? 'Edit Payment Method' : 'Add Payment Method'}</ModalHeader>
						<ModalBody>
							<Form className="space-y-4" ref={formRef}>
								<Select
									label="Payment Type"
									selectedKeys={[pmValues?.type || PAYMENT_TYPE.VISA]}
									// @ts-expect-error type error
									onChange={handleChange('type')}
								>
									<SelectItem key={PAYMENT_TYPE.VISA} startContent={<Icon icon="logos:visa" />}>
										Visa
									</SelectItem>
									<SelectItem key={PAYMENT_TYPE.MASTERCARD} startContent={<Icon icon="logos:mastercard" />}>
										Mastercard
									</SelectItem>
									<SelectItem key={PAYMENT_TYPE.PAYPAL} startContent={<Icon icon="logos:paypal" />}>
										PayPal
									</SelectItem>
									<SelectItem key={PAYMENT_TYPE.APPLEPAY} startContent={<Icon icon="logos:apple-pay" />}>
										Apple Pay
									</SelectItem>
								</Select>

								<Input
									label="Name on Card"
									placeholder="John Doe"
									value={pmValues?.name || ''}
									onChange={handleChange('name')}
								/>

								{['VISA', 'MASTERCARD'].includes(`${pmValues?.type}`) && (
									<>
										<Input
											label="Card Number"
											placeholder="•••• •••• •••• ••••"
											// value={pmValues?.number || ''}
											// onChange={handleChange('')}
										/>

										<Input
											label="Expiry Date"
											placeholder="MM/YY"
											value={pmValues?.expiryDate || ''}
											onChange={handleChange('expiryDate')}
										/>
									</>
								)}

								{pmValues?.type === PAYMENT_TYPE.PAYPAL && (
									<Input
										label="PayPal Email"
										placeholder="email@example.com"
										value={pmValues?.name || ''}
										onChange={handleChange('name')}
									/>
								)}

								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id="isDefault"
										checked={pmValues?.isDefault || false}
										onChange={handleChange('isDefault')}
										className="rounded text-primary focus:ring-primary"
									/>
									<label htmlFor="isDefault" className="text-sm">
										Set as default payment method
									</label>
								</div>
							</Form>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Cancel
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
								{paymentMethod?.id ? (isPending ? 'Updating...' : 'Update') : isPending ? 'Adding...' : 'Add'}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default AddEditPaymentMethods
