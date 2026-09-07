'use client'

import { ReactNode } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { setCurrentProfileTab } from '@/redux/reducers/appData'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { ProfileTab } from '@/services/types'

type ProfileTabsProps = {
  children: ReactNode
  initialTab?: ProfileTab
}

const ProfileTabs = ({ children, initialTab }: ProfileTabsProps) => {
  const dispatch = useAppDispatch()
  const currentProfileTab = useAppSelector((state) => state.appData.currentProfileTab)

  return (
    <Tabs
      value={currentProfileTab ?? initialTab ?? 'profile'}
      onValueChange={(tab) => dispatch(setCurrentProfileTab(tab as ProfileTab))}
      className='mt-8'
    >
      {children}
    </Tabs>
  )
}

export default ProfileTabs
