'use client'

import React from 'react'
import styles from './styles.module.scss'
import { Button, Form, Input } from '@heroui/react'
import { Typography } from 'antd'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setSellerFormState } from '@/redux/slices/appSlice'
import { LOGINFORM_STATE } from '@/constants/types'

type Props = {}

const Seller = (props: Props) => {
  const dispatch = useAppDispatch()
  const sellerFormState = useAppSelector(s => s.app.sellerFormState)
  const isRegister = sellerFormState === LOGINFORM_STATE.REGISTER

  return (
    <div className={styles.sellerWrapper}>
      <div className={styles.sellerContainer}>
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col items-center justify-center">
            <Typography.Title level={3}>Seller {isRegister ? 'Registration' : 'Login'}</Typography.Title>
            <Typography.Text>Access your dashboard to manage orders, products, and more.</Typography.Text>
          </div>
          <Form className="w-full gap-4 select-none">
            {isRegister && (
              <div className="flex justify-between gap-3 w-full">
                <Input placeholder="Shop Name" name="name" isRequired fullWidth />
                <Input placeholder="Phone Number" name="phoneNumber" isRequired fullWidth />
              </div>
            )}
            <Input placeholder="Email" name="email" type="email" isRequired />
            <Input placeholder="Password" name="password" type="password" isRequired />
            <Input placeholder="Confirm Password" name="confirmPassword" type="password" isRequired />
            <Typography.Text
              className="cursor-pointer text-end w-full select-none"
              onClick={() =>
                dispatch(setSellerFormState(isRegister ? LOGINFORM_STATE.LOGIN : LOGINFORM_STATE.REGISTER))
              }
            >
              {isRegister ? 'Already have an account?' : 'Create an account'}
            </Typography.Text>
            <Button radius="sm" color="default" type="submit" className="mt-5 customButton1" fullWidth>
              {isRegister ? 'Sign up' : 'Sign in'}
            </Button>
          </Form>
        </div>
        <div className={styles.imgWrapper}>
          <Image src={`/images/login_cover-2.webp`} alt="" fill sizes="60vw" className="rounded-md" priority />
        </div>
      </div>
    </div>
  )
}

export default Seller
