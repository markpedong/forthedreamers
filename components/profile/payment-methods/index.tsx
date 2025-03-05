import React, { FC } from 'react'
import { Card, CardBody, Button, Divider } from '@heroui/react'
import { Icon } from '@iconify/react'
import { PAYMENT_TYPE, PaymentMethods as TPaymentMethods } from '@prisma/client'

type Props = {
  method: TPaymentMethods
}

const PaymentMethods: FC<Props> = ({ method }) => {
  const getCardIcon = (type: TPaymentMethods['type']) => {
    switch (type) {
      case PAYMENT_TYPE.VISA:
        return 'logos:visa'
      case PAYMENT_TYPE.MASTERCARD:
        return 'logos:mastercard'
      case PAYMENT_TYPE.PAYPAL:
        return 'logos:paypal'
      case PAYMENT_TYPE.APPLEPAY:
        return 'logos:apple-pay'
      default:
        return 'lucide:credit-card'
    }
  }

  return (
    <Card key={method.id} className="w-full">
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-default-100">
              <Icon icon={getCardIcon(method.type)} width={24} height={24} />
            </div>
            <div>
              <p className="font-medium">{method.name}</p>
              {method.number && (
                <div className="flex items-center gap-2">
                  <p className="text-small text-default-500">{method.number}</p>
                  {method.expiryDate && (
                    <>
                      <Divider orientation="vertical" className="h-4" />
                      <p className="text-small text-default-500">Expires {method.expiryDate}</p>
                    </>
                  )}
                </div>
              )}
              {method.isDefault && <span className="text-tiny text-primary">Default</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!method.isDefault && (
              <Button variant="light" size="sm">
                Set as default
              </Button>
            )}
            <Button variant="light" size="sm" color="danger" isIconOnly>
              <Icon icon="lucide:trash-2" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PaymentMethods
