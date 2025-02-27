'use client'

import { Button, Divider } from '@heroui/react'
import { getSession, signOut } from 'next-auth/react'
import styles from '../styles.module.scss'
import { useEffect } from 'react'

type Props = {}

const Profile = (props: Props) => {
  const fetchData = async () => {
    const res = await getSession()

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
          <Button
            onPress={() => {
              localStorage.clear()
              signOut()
            }}
          >
            Signout
          </Button>
        </div>
        <div>Profile</div>
      </div>
    </div>
  )
}

export default Profile
