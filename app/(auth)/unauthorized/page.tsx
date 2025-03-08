'use client'

import React from 'react'
import { Button } from '@heroui/react'
import { Icon } from '@iconify/react'

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <Icon icon="lucide:lock" className="w-24 h-24 text-default-400" />
        <h1 className="text-4xl font-bold">Unauthorized Access</h1>
        <p className="text-default-500 max-w-md">
          Sorry, you don't have permission to access this page. Please sign in or contact support if you think this is a
          mistake.
        </p>
        <div className="flex gap-3">
          <Button
            color="primary"
            startContent={<Icon icon="lucide:log-in" />}
            onPress={() => (window.location.href = '/login')}
          >
            Sign In
          </Button>
          <Button
            variant="bordered"
            startContent={<Icon icon="lucide:home" />}
            onPress={() => (window.location.href = '/')}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized