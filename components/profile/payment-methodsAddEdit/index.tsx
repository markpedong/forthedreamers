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
import { PAYMENT_METHODS } from '@/constants'

type Props = {
  isOpen: boolean
  onOpenChange: () => void
}

const AddEditPaymentMethods: FC<Props> = ({ isOpen, onOpenChange }) => {
  const paymentMethod = useAppSelector(s => s.user.paymentMethod)
  const [pmValues, setPmValues] = useState<PaymentMethods | null>(null)
  const [isPending, submit] = useTransition()
  const [_, startTransition] = useTransition()
  const [state, action] = useActionState((_: any, values: FormData) => submitPM(_, values, `${pmValues?.type}`), {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(() => {
      action(formData)
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        setPmValues(null)
        dispatch(setPaymentMethod(null))
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>{paymentMethod?.id ? 'Edit Payment Method' : 'Add Payment Method'}</ModalHeader>
            <ModalBody>
              <Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit} ref={formRef}>
                <Select
                  label="Payment Type"
                  items={PAYMENT_METHODS}
                  selectedKeys={[pmValues?.type || PAYMENT_TYPE.CASH_ON_DELIVERY]}
                  // @ts-expect-error type error
                  onChange={handleChange('type')}
                >
                  {payment => (
                    <SelectItem key={payment.key} textValue={payment.label}>
                      <div className="grid grid-cols-[1fr_6.5fr] gap-3 items-center">
                        <div className="justify-self-end">
                          <Icon icon={payment.icon} />
                        </div>
                        <div>{payment.label}</div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <Input
                  label={['VISA', 'MASTERCARD'].includes(`${pmValues?.type}`) ? 'Name on Card' : 'Name'}
                  placeholder="John Doe"
                  value={pmValues?.name}
                  errorMessage={state?.errors?.name?.[0]}
                  onChange={handleChange('name')}
                  name="name"
                />
                {['VISA', 'MASTERCARD'].includes(`${pmValues?.type}`) && (
                  <>
                    <Input
                      label="Card Number"
                      placeholder="•••• •••• •••• ••••"
                      name="cardNumber"
                      value={pmValues?.cardNumber || ''}
                      errorMessage={state?.errors?.cardNumber?.[0]}
                      onChange={handleChange('cardNumber')}
                    />

                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={pmValues?.expiryDate || ''}
                      errorMessage={state?.errors?.expiryDate?.[0]}
                      onChange={handleChange('expiryDate')}
                    />
                  </>
                )}

                {pmValues?.type === PAYMENT_TYPE.PAYPAL && (
                  <Input
                    label="PayPal Email"
                    placeholder="email@example.com"
                    value={pmValues?.email || ''}
                    name="email"
                    onChange={handleChange('email')}
                    errorMessage={state?.errors?.email?.[0]}
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
