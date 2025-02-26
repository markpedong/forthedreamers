'use client'

import { Button } from '@heroui/react'
import { signOut } from 'next-auth/react'

type Props = {}

const Page = (props: Props) => {
  return (
    <div>
      <Button onPress={() => signOut()}>Signout</Button>
    </div>
  )
}

export default Page
