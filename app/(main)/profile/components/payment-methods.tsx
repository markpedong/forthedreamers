import PaymentMethods from '@/components/payment-methods'
import React, { FC } from 'react'
import { PaymentMethods as TPaymentMethod } from '@prisma/client'
type Props = {
  data: TPaymentMethod[]
}

const PaymentMethod: FC<Props> = ({ data }) => {
  return (
    <div>
      {data?.map(method => (
        <PaymentMethods key={method.id} method={method} />
      ))}
    </div>
  )
}

export default PaymentMethod
