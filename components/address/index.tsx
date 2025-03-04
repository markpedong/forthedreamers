import { ADDRESS_TYPE, Addresses } from '@prisma/client'
import React, { FC, memo, useState, useTransition } from 'react'
import { Card, CardBody, Button, addToast, Popover, PopoverTrigger, PopoverContent } from '@heroui/react'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { deleteAddress, setDefaultAddress } from '@/utils/request'
import { useRouter } from 'next/navigation'
import { setAddress } from '@/redux/slices/userSlice'

type Props = {
  address: Addresses
  openEditModal: () => void
}

const Address: FC<Props> = ({ openEditModal, address }) => {
  const darkMode = useAppSelector(s => s.app.darkMode)
  const [isPending, startTransition] = useTransition()
  const { refresh } = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useAppDispatch()

  const handleSetDefaultAddress = () => {
    startTransition(async () => {
      const res = await setDefaultAddress({ id: address?.id })

      if (res.success) {
        addToast({ title: 'Success', description: 'Address set as default', color: 'success' })
        refresh()
      }
    })
  }

  const handleDelete = async () => {
    const res = await deleteAddress(`${address?.id}`)

    if (res.success) {
      addToast({ title: 'Success', description: 'Address deleted successfully', color: 'success' })
      refresh()
      setIsOpen(false)
    }
  }

  const renderDelete = () => {
    return (
      <Popover isOpen={isOpen} onOpenChange={setIsOpen} backdrop="blur" shouldCloseOnInteractOutside={() => false}>
        <PopoverTrigger>
          <Button isIconOnly size="sm" variant="light" aria-label="Delete address" onPress={() => setIsOpen(true)}>
            <FaTrash className="text-danger" size={12} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-4 py-3">
            <div className="text-small font-bold mb-2">Delete Address</div>
            <div className="text-tiny mb-4">Are you sure you want to delete this address?</div>
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="light" onPress={() => setIsOpen(false)} className="text-xs h-7">
                Cancel
              </Button>
              <Button size="sm" color="danger" onPress={handleDelete} className="text-xs h-7">
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Card key={address?.id} className="w-full" shadow="sm">
      <CardBody>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-medium">
                {address?.firstName} {address?.lastName} / {address?.number}
              </span>
              {address?.type === ADDRESS_TYPE.DEFAULT && (
                <span className="px-2 py-1 text-tiny bg-primary-50 text-primary rounded-full">Default</span>
              )}
            </div>
            <div className="text-default-500 text-xs">
              <p>{address?.street}</p>
              <p>{`${address?.city}, ${address?.state} ${address?.zipCode}`}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label="Edit address"
              onPress={() => {
                dispatch(setAddress(address))
                openEditModal()
              }}
            >
              <AiFillEdit className="text-default-500" size={12} color={darkMode ? 'white' : 'black'} />
            </Button>
            {renderDelete()}
          </div>
        </div>
        {address?.type === ADDRESS_TYPE.NONE && (
          <div className="mt-2 pt-2 border-t">
            <Button variant="flat" size="sm" onPress={handleSetDefaultAddress} isLoading={isPending}>
              {isPending ? 'Setting...' : 'Set as default'}
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default memo(Address)
