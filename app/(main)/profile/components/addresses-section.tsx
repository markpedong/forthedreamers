'use client'

import { FC, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MapPin, Trash2, Pencil, Star } from 'lucide-react'
import { deleteAddress, setDefaultAddress } from '@/lib/server-actions'
import { tryWithToast } from '@/utils/helper'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Form from '@/components/reusable/form'
import Input from '@/components/reusable/input'

const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  region: z.string().min(1, 'Region/State is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  street: z.string().min(1, 'Street address is required'),
  label: z.string().optional(),
  type: z.enum(['HOME', 'WORK', 'OTHER'])
})

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

type AddressFormValues = z.infer<typeof addressSchema>

const AddressesSection: FC<AddressesSectionProps> = ({ addresses }) => {
  const [isPending, startTransition] = useTransition()
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      region: '',
      city: '',
      postalCode: '',
      street: '',
      label: '',
      type: 'HOME'
    }
  })

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    form.reset({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      region: address.region,
      city: address.city,
      postalCode: address.postalCode,
      street: address.street,
      label: address.label ?? '',
      type: address.type
    })
    setIsDialogOpen(true)
  }

  const openNewDialog = () => {
    setEditingAddress(null)
    form.reset({
      fullName: '',
      phoneNumber: '',
      region: '',
      city: '',
      postalCode: '',
      street: '',
      label: '',
      type: 'HOME'
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      const result = await tryWithToast(deleteAddress(addressId))
      if (result?.success) {
        toast.success('Address deleted')
        window.location.reload()
      }
    })
  }

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      const result = await tryWithToast(setDefaultAddress(addressId))
      if (result?.id) {
        toast.success('Default address updated')
        window.location.reload()
      }
    })
  }

  const handleSubmit = (values: AddressFormValues) => {
    toast.info('Address management is not available yet')
    setIsDialogOpen(false)
  }

  const typeLabels: Record<string, string> = {
    HOME: 'Home',
    WORK: 'Work',
    OTHER: 'Other'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Addresses</CardTitle>
        <CardDescription>Manage your delivery addresses</CardDescription>
        <CardAction>
          <Button
            variant='outline'
            size='sm'
            onClick={openNewDialog}
            disabled={isPending}
            className='bg-transparent gap-2'
          >
            <MapPin className='h-4 w-4' /> Add Address
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {addresses.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            <MapPin className='h-12 w-12 mx-auto mb-3 opacity-50' />
            <p className='font-medium'>No saved addresses</p>
            <p className='text-sm mt-1'>Add your first delivery address</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-lg border p-4 transition-colors ${
                  address.isDefault
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-sm font-medium capitalize'>
                        {typeLabels[address.type] || address.type}
                      </span>
                      {address.isDefault && (
                        <span className='inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                          Default
                        </span>
                      )}
                    </div>
                    <p className='font-medium text-foreground truncate'>
                      {address.fullName}
                    </p>
                    <p className='text-sm text-muted-foreground truncate'>
                      {address.street}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {address.city}, {address.region} {address.postalCode}
                    </p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {address.phoneNumber}
                    </p>
                  </div>

                  <div className='flex items-center gap-2 flex-shrink-0'>
                    {!address.isDefault && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleSetDefault(address.id)}
                        disabled={isPending}
                        className='h-8 px-2 text-xs bg-transparent'
                        title='Set as default'
                      >
                        <Star className='h-3.5 w-3.5' />
                      </Button>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openEditDialog(address)}
                      disabled={isPending}
                      className='h-8 px-2 bg-transparent'
                    >
                      <Pencil className='h-3.5 w-3.5' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(address.id)}
                      disabled={isPending}
                      className='h-8 px-2 text-destructive hover:text-destructive bg-transparent'
                    >
                      <Trash2 className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? 'Update your delivery address details'
                : 'Enter your delivery address details'}
            </DialogDescription>
          </DialogHeader>

          <Form form={form as any} onSubmit={handleSubmit} customSubmitButton>
            <div className='space-y-4'>
              <Input
                name='fullName'
                label='Full Name'
                placeholder='John Doe'
                disabled={isPending}
              />
              <Input
                name='phoneNumber'
                label='Phone Number'
                placeholder='+1 (555) 000-0000'
                disabled={isPending}
              />
              <Input
                name='street'
                label='Street Address'
                placeholder='123 Main Street, Apt 4B'
                disabled={isPending}
              />
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  name='city'
                  label='City'
                  placeholder='New York'
                  disabled={isPending}
                />
                <Input
                  name='region'
                  label='State/Region'
                  placeholder='NY'
                  disabled={isPending}
                />
              </div>
              <Input
                name='postalCode'
                label='Postal Code'
                placeholder='10001'
                disabled={isPending}
              />
              <Input
                name='label'
                label='Label (optional)'
                placeholder='Home, Work, etc.'
                disabled={isPending}
              />
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default AddressesSection
