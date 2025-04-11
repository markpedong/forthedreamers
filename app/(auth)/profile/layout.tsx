import ProfileWrapper from '@/components/profile/profile-wrapper'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ProfileWrapper children={children} />
}

export default Layout
