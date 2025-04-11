'use client'

import Loading from '@/components/loading'
import UploadImage from '@/components/profile/uploadImage'
import { PROFILE_MENUS } from '@/constants'
import { clearUserData } from '@/lib'
import { toggleDarkMode } from '@/redux/slices/appSlice'
import { setUserData } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { uploadProfile } from '@/utils/request'
import { Button, Switch } from '@heroui/react'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useTransition } from 'react'

const ProfileWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useAppSelector(state => state.app)
  const dispatch = useAppDispatch()
  const { userData } = useAppSelector(state => state.user)
  const [isPending, startTransition] = useTransition()
  const [isNavigating, startNavigate] = useTransition()
  const router = useRouter()
  const { setTheme } = useTheme()
  const params = usePathname()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    startTransition(async () => {
      const response = await uploadProfile(file)
      if (response?.success) {
        dispatch(setUserData({ ...userData, image: response.data.secure_url }))
        router.refresh()
      }
    })
  }

  const toggle = () => {
    dispatch(toggleDarkMode())
    setTheme(darkMode ? 'light' : 'dark')
  }

  return (
    <div className="max-w-5xl mx-auto min-h-56 pb-10 h-dvh">
      <div className="grid md:grid-cols-[1fr_2fr] gap-4 h-full px-6">
        <div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)] flex flex-col justify-between">
          <div className="p-5 mb-10">
            <div className="flex justify-between items-center mb-16 mt-4">
              <div
                className="flex gap-2 items-center justify-start text-sm text-neutral-400 hover:text-black dark:hover:text-white transition cursor-pointer"
                onClick={() => router.push('/')}
              >
                <Icon icon="pajamas:go-back" />
                <span>Back</span>
              </div>
              <Button
                size="sm"
                color="primary"
                variant="solid"
                onPress={() => {
                  clearUserData()
                  signOut()
                }}
              >
                Signout
              </Button>
            </div>
            <div className="flex flex-col gap-1 text-sm pl-3">
              <UploadImage isPending={isPending} handleFileChange={handleFileChange} />
              <span className="capitalize pt-2">
                {userData?.firstName} {userData?.lastName}
              </span>
              <span className="text-neutral-400">Customer</span>
            </div>
            <div className="flex flex-col gap-1 text-sm mt-7">
              {PROFILE_MENUS.map((menu, index) => (
                <span
                  key={index}
                  onClick={() =>
                    !params.includes(menu) && !isNavigating && startNavigate(() => router.push(`/profile/${menu}`))
                  }
                  className={classNames('cursor-pointer px-3 py-2 transition-all', {
                    'border-l-2 border-gray-500 text-black bg-gray-100': params.includes(menu),
                    'text-neutral-400': !params.includes(menu)
                  })}
                >
                  {menu?.replaceAll('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
          <div className="px-5">
            <Switch
              defaultSelected={darkMode}
              color="default"
              size="sm"
              onChange={toggle}
              thumbIcon={({ isSelected }) =>
                !isSelected ? (
                  <Icon icon="solar:sun-bold" className="cursor-pointer" color="black" />
                ) : (
                  <Icon icon="solar:moon-bold" className="cursor-pointer" color="black" />
                )
              }
            />
          </div>
        </div>
        {isNavigating ? <Loading /> : <div className="mt-8">{children}</div>}
      </div>
    </div>
  )
}

export default ProfileWrapper
