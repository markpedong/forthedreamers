import { addressInformation } from '@/actions/auth'
import { ADDRESS_OBJ, OPTIONS_ADDRESS } from '@/constants'
import { setAddress } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { createNewAddress, updateAddress } from '@/utils/request'
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
import { ADDRESS_TYPE, Addresses } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FC, memo, useActionState, useEffect, useRef, useState, useTransition } from 'react'

type Props = {
  isOpen?: boolean
  onOpenChange: () => void
}

const AddressAddEdit: FC<Props> = ({ isOpen, onOpenChange }) => {
  const [_, startTransition] = useTransition()
  const [state, action, isPending] = useActionState(addressInformation, {
    errors: {},
    values: {}
  })
  const { data: session } = useSession()
  const formRef = useRef(null)
  const { refresh } = useRouter()
  const address = useAppSelector(s => s.user.address)
  const hasDefaultAddress = useAppSelector(s => s.app.hasDefaultAddress)
  const [addressValues, setNewAddressValues] = useState<Addresses | null>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    state.success && handleSuccess()
  }, [state])

  useEffect(() => {
    if (!address?.id) {
      setNewAddressValues(null)
    } else {
      setNewAddressValues(address)

      console.log('addressValues', addressValues)
    }
  }, [address])

  const handleChange = (key: keyof Addresses) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //@ts-expect-error type error
    setNewAddressValues(prev => ({
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

  const handleSuccess = async () => {
    let res

    if (!address?.id) {
      res = await createNewAddress({ ...addressValues, userId: session?.user.id })
    } else {
      res = await updateAddress({ ...addressValues, id: address?.id })
    }

    if (res?.success) {
      addToast({ title: 'Success', description: 'Address saved successfully', color: 'success' })
      onOpenChange()
      refresh()
      setNewAddressValues(null)
      dispatch(setAddress(null))
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
        dispatch(setAddress(null))
        setNewAddressValues(null)
        onOpenChange()
        state.errors = {}
        state.values = {}
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">{!address?.id ? 'New' : 'Edit'} Address</ModalHeader>
            <ModalBody>
              <Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit} ref={formRef}>
                <div className="flexAllCenter w-full gap-3">
                  <Input
                    label="First Name"
                    name="firstName"
                    isRequired
                    errorMessage={state?.errors?.firstName?.[0]}
                    value={addressValues?.firstName || ''}
                    onChange={handleChange('firstName')}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    isRequired
                    errorMessage={state?.errors?.lastName?.[0]}
                    value={addressValues?.lastName || ''}
                    onChange={handleChange('lastName')}
                  />
                  <Input
                    label="Number"
                    name="number"
                    isRequired
                    errorMessage={state?.errors?.number?.[0]}
                    value={addressValues?.number || ''}
                    onChange={handleChange('number')}
                  />
                </div>
                <div className="flexAllCenter w-full gap-3">
                  <Input
                    label="Street"
                    name="street"
                    isRequired
                    errorMessage={state?.errors?.street?.[0]}
                    value={addressValues?.street || ''}
                    onChange={handleChange('street')}
                  />
                  <Input
                    label="City"
                    name="city"
                    isRequired
                    errorMessage={state?.errors?.city?.[0]}
                    value={addressValues?.city || ''}
                    onChange={handleChange('city')}
                  />
                </div>
                <div className="flexAllCenter w-full gap-3">
                  <Input
                    label="State"
                    name="state"
                    isRequired
                    errorMessage={state?.errors?.state?.[0]}
                    value={addressValues?.state || ''}
                    onChange={handleChange('state')}
                  />
                  <Input
                    label="Zip Code"
                    name="zipCode"
                    isRequired
                    errorMessage={state?.errors?.zipCode?.[0]}
                    value={addressValues?.zipCode || ''}
                    onChange={handleChange('zipCode')}
                  />
                </div>
                <div className="flexAllCenter w-full gap-3">
                  <Input
                    label="Country"
                    name="country"
                    isRequired
                    errorMessage={state?.errors?.country?.[0]}
                    value={addressValues?.country}
                    onChange={handleChange('country')}
                  />
                  <Select
                    items={OPTIONS_ADDRESS}
                    label="Address Type:"
                    placeholder="Select an address type:"
                    name="addressType"
                    disabledKeys={hasDefaultAddress ? ['DEFAULT'] : []}
                    selectedKeys={[ADDRESS_OBJ[addressValues?.type as keyof typeof ADDRESS_OBJ]]}
                    isDisabled={addressValues?.type === ADDRESS_TYPE.DEFAULT}
                    //@ts-expect-error type error
                    onChange={handleChange('type')}
                  >
                    {addr => <SelectItem>{addr.label}</SelectItem>}
                  </Select>
                </div>
                <Textarea
                  label="Landmark"
                  name="landmark"
                  errorMessage={state?.errors?.landmark?.[0]}
                  value={addressValues?.landmark || ''}
                  onChange={handleChange('landmark')}
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
                {address?.id ? (isPending ? 'Updating...' : 'Update') : isPending ? 'Adding...' : 'Add'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default memo(AddressAddEdit)
