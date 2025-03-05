import PaymentMethods from '@/components/profile/payment-methods'
import React, { FC } from 'react'
import { PaymentMethods as TPaymentMethod } from '@prisma/client'
import AddEditPaymentMethods from '@/components/profile/payment-methodsAddEdit'
import { Typography } from 'antd'
import { Button, useDisclosure } from '@heroui/react'
import { useAppDispatch } from '@/redux/store'
import { setPaymentMethod } from '@/redux/slices/userSlice'
type Props = {
  data: TPaymentMethod[]
}

const PaymentMethod: FC<Props> = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const dispatch = useAppDispatch()
  return (
    <div>
      <AddEditPaymentMethods isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="flex justify-between">
        <Typography.Title level={4}>Payment Methods</Typography.Title>
        <Button
          onPress={() => {
            dispatch(setPaymentMethod(null))
            onOpen()
          }}
          className="customButton1"
          size="sm"
        >
          New
        </Button>
      </div>
      <div className='grid gap-3 mt-8'>
        {data?.map(method => (
          <PaymentMethods key={method.id} method={method} openPaymentMethod={() => onOpen()} />
        ))}
      </div>
    </div>
  )
}

export default PaymentMethod
