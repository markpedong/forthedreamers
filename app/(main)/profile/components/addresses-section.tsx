'use client'

import { FC, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { MapPin, Trash2, Star } from 'lucide-react'
import { deleteAddress, setDefaultAddress } from '@/lib/server-actions'
import { tryWithToast } from '@/utils/helper'
import { useRouter } from 'next/navigation'

type Address = {
  id: string
  type: 'HOME' | 'WORK' | 'OTHER'
  label?: string | null
  fullName: string
  phoneNumber: string
  region: string
  city: string
  postalCode: string
  street: string
  isDefault: boolean
}

type AddressesSectionProps = {
  addresses: Address[]
}

const AddressesSection: FC<AddressesSectionProps> = ({ addresses }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      const result = await tryWithToast(deleteAddress(addressId))
      if (result?.success) {
        toast.success('Address deleted')
        router.refresh()
      }
    })
  }

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      const result = await tryWithToast(setDefaultAddress(addressId))
      if (result?.id) {
        toast.success('Default address updated')
        router.refresh()
      }
    })
  }

  const typeLabels: Record<Address['type'], string> = {
    HOME: 'Home',
    WORK: 'Work',
    OTHER: 'Other'
  }

  return (
    <Card className='shadow-none'>
      <CardHeader className='border-b'>
        <CardTitle className='text-xl'>Saved addresses</CardTitle>
        <CardDescription>Your delivery addresses from completed checkout details.</CardDescription>
      </CardHeader>

      <CardContent>
        {addresses.length === 0 ? (
          <div className='py-12 text-center text-muted-foreground'>
            <MapPin className='mx-auto mb-3 h-10 w-10 opacity-40' />
            <p className='font-medium'>No saved addresses</p>
            <p className='mt-1 text-sm'>Saved checkout addresses will appear here.</p>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`flex min-h-52 flex-col justify-between rounded-lg border p-5 ${
                  address.isDefault
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border'
                }`}
              >
                <div>
                  <div className='mb-4 flex flex-wrap items-center gap-2'>
                    <Badge variant='outline'>{address.label || typeLabels[address.type]}</Badge>
                    {address.isDefault && <Badge>Default</Badge>}
                  </div>
                  <p className='font-medium text-foreground'>{address.fullName}</p>
                  <div className='mt-2 space-y-1 text-sm text-muted-foreground'>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.region} {address.postalCode}
                    </p>
                    <p>{address.phoneNumber}</p>
                  </div>
                </div>

                <div className='mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4'>
                  {!address.isDefault && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isPending}
                    >
                      <Star className='h-3.5 w-3.5' /> Set as default
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDelete(address.id)}
                    disabled={isPending}
                    className='text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-3.5 w-3.5' /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AddressesSection
