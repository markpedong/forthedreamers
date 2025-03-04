'use client'

import { clearUserData } from '@/lib'
import { setUserData } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { uploadProfile } from '@/utils/request'
import { getLocalStorage, setLocalStorage } from '@/utils/xLocalStorage'
import { Button, Divider } from '@heroui/react'
import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { FC, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import styles from '../styles.module.scss'
import { ADDRESS_TYPE, Addresses as TAddresses, Users } from '@prisma/client'
import address from '@/components/address'
import { setHasDefaultAddress } from '@/redux/slices/appSlice'

type Props = {
  userInfo: Users
  addresses: TAddresses[]
}

const PersonalInformation = dynamic(() => import('./personal-information'), { ssr: false })
const Addresses = dynamic(() => import('./addresses'), { ssr: false })
const PaymentMethods = dynamic(() => import('./payment-methods'), { ssr: false })
const Orders = dynamic(() => import('./orders'), { ssr: false })
const Reviews = dynamic(() => import('./reviews'), { ssr: false })

const Profile: FC<Props> = ({ addresses, userInfo }) => {
  const menus = ['Personal Information', 'Addresses', 'Payment Methods', 'Orders', 'Wishlist', 'Reviews']
  const [activeMenu, setActiveMenu] = useState<string>('Addresses')
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const userData = useAppSelector(state => state.user.userData)

  useEffect(() => {
    fetchUserData()
  }, [session, userInfo])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const response = await uploadProfile(file)
    if (response?.success) {
      dispatch(setUserData({ ...userData, image: response.data.secure_url }))
    }
  }

  const fetchUserData = async () => {
    if (!session?.user?.id || !session?.accessToken) return
    if (!getLocalStorage('accessToken')) setLocalStorage('accessToken', session.accessToken)
    if (addresses?.findIndex(address => address.type === ADDRESS_TYPE.DEFAULT) !== -1) {
      dispatch(setHasDefaultAddress(true))
    }

    dispatch(setUserData(userInfo))
  }

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        <div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)]">
          <div className="p-5 mb-10">
            <div className="flex justify-between items-center mb-16 mt-4">
              <div className="flex gap-2 items-center justify-start text-sm text-neutral-400 hover:text-black cursor-pointer transition">
                <IoArrowBack />
                <span>Back</span>
              </div>
              <Button
                size="sm"
                color="default"
                onPress={() => {
                  clearUserData()
                  signOut()
                }}
              >
                Signout
              </Button>
            </div>
            <div className="flex flex-col gap-1 text-sm pl-3">
              {userData?.image ? (
                <NextImage alt="sample" src={userData?.image} width="50" height="50" className="rounded-full" />
              ) : (
                <label className="w-12 h-12 flex flex-col items-center justify-center bg-gray-400 text-white rounded-full cursor-pointer relative">
                  <FaPlus className="text-lg absolute top-2" size={10} />
                  <span className="text-xs mt-4">Upload</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              )}
              <span className="capitalize pt-2">
                {userData?.firstName} {userData?.lastName}
              </span>
              <span className="text-neutral-400">Customer</span>
            </div>
            <div className="flex flex-col gap-1 text-sm mt-7">
              {menus.map((menu, index) => (
                <span
                  key={index}
                  onClick={() => setActiveMenu(menu)}
                  className={classNames('cursor-pointer px-3 py-2 transition-all', {
                    'border-l-2 border-gray-500 text-black bg-gray-100': activeMenu === menu,
                    'text-neutral-400': activeMenu !== menu
                  })}
                >
                  {menu}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 h-full">
          {activeMenu === 'Personal Information' && <>{userData && <PersonalInformation user={userData} />}</>}
          {activeMenu === 'Addresses' && <Addresses data={addresses} />}
          {activeMenu === 'Payment Methods' && <PaymentMethods />}
          {activeMenu === 'Orders' && <Orders />}
          {activeMenu === 'Reviews' && <Reviews />}
        </div>
      </div>
    </div>
  )
}

export default Profile
