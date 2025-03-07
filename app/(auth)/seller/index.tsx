'use client'

import React from 'react'
import styles from './styles.module.scss'
import { Button, Form, Input } from '@heroui/react'
import { Typography } from 'antd'

type Props = {}

const Seller = (props: Props) => {
  return (
    <div className={styles.sellerWrapper}>
      <div className={styles.sellerContainer}>
        <div className="flex flex-col items-center justify-center">
          <Typography.Title level={3}>Seller Login</Typography.Title>
          <Typography.Text>Access your dashboard to manage orders, products, and more.</Typography.Text>
        </div>
        <Form className="w-full gap-4">
          <Input placeholder="Email" name="email" type="email" isRequired />
          <Input placeholder="Password" name="password" type="password" isRequired />
          <Input placeholder="Confirm Password" name="confirmPassword" type="password" isRequired />
          <Button radius="sm" color="default" type="submit" className="mt-5 customButton1" fullWidth>
            Login
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Seller
