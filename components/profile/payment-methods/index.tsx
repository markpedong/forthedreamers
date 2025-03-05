import React, { FC, useTransition } from 'react'
import { Card, CardBody, Button, Divider, Spinner } from '@heroui/react'
import { Icon } from '@iconify/react'
import { PAYMENT_TYPE, PaymentMethods as TPaymentMethods } from '@prisma/client'
import { deletePaymentMethod, setDefaultPaymentMethod } from '@/utils/request'
import { useRouter } from 'next/navigation'

type Props = {
  method: TPaymentMethods
  openPaymentMethod: () => void
}

const PaymentMethods: FC<Props> = ({ method }) => {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleting] = useTransition()
  const { refresh } = useRouter()
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

  const handleSetDefault = () => {
    startTransition(async () => {
      const res = await setDefaultPaymentMethod(method.id)

      if (res.success) {
        refresh()
      }
    })
  }

  const handleDelete = () => {
    startDeleting(async () => {
      const res = await deletePaymentMethod(method.id)

      if (res.success) {
        refresh()
      }
    })
  }

  return (
    <Card key={method.id} className="w-full">
      <CardBody className="py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon={getCardIcon(method.type)} width={15} height={15} />
            <p className="font-medium text-sm">{method.name}</p>
            {method.cardNumber && (
              <div className="flex items-center gap-2">
                <p className="text-small text-default-500">{method.cardNumber.slice(-4)}</p>
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
          <div className="flex items-center gap-2">
            {!method.isDefault && (
              <Button variant="light" size="sm" onPress={handleSetDefault} isLoading={isPending}>
                {isPending ? 'Setting...' : 'Set as default'}
              </Button>
            )}
            <Button variant="light" size="sm" color="danger" isIconOnly disabled={isDeleting} onPress={handleDelete}>
              {isDeleting ? (
                <Spinner size="sm" color="danger" className="size-6" />
              ) : (
                <Icon icon="lucide:trash-2" width={16} height={16} />
              )}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PaymentMethods
