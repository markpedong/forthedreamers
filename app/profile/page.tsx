'use client'

import { Button, Divider } from '@heroui/react'
import { signOut, useSession } from 'next-auth/react'
import styles from './styles.module.scss'
import { getUserData } from '@/utils/request'
import { useEffect } from 'react'

type Props = {}

const Page = (props: Props) => {
  const { data: session } = useSession()
  console.log('session', session)
  const fetchData = async () => {
    const res = await getUserData(session?.user?.id as string)

    console.log('res', res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        <div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)]">
          <div>{/* <Image src={}/> */}</div>
          <Divider />
          <Button onPress={() => signOut()}>Signout</Button>
        </div>
        <div>Profile</div>
      </div>
    </div>
  )
}

export default Page
