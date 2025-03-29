import Address from '@/components/profile/address'
import AddEditAddress from '@/components/profile/addressAddEdit'
import { setAddress } from '@/redux/slices/userSlice'
import { useAppDispatch } from '@/redux/store'
import { Button, useDisclosure } from '@heroui/react'
import { Addresses as TAddresses } from '@prisma/client'
import { Typography } from 'antd'
import { FC } from 'react'

type Props = {
  data: TAddresses[]
}

const Addresses: FC<Props> = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const dispatch = useAppDispatch()

  return (
    <>
      <AddEditAddress isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="flex justify-between">
        <Typography.Title level={4}>Addresses</Typography.Title>
        <Button
          onPress={() => {
            dispatch(setAddress(null))
            onOpen()
          }}
          className=""
          size="sm"
        >
          New
        </Button>
      </div>
      <div className="mt-7 flex flex-col gap-2">
        {data?.map(address => (
          <Address address={address} key={address.id} openEditModal={() => onOpen()} />
        ))}
      </div>
    </>
  )
}

export default Addresses
