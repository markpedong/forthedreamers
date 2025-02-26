'use client'
import { Spinner } from '@heroui/react'
import { FC } from 'react'

const PageLoader: FC = () => {
  return (
    <div className="absolute w-full h-full flex flex-col items-center justify-center">
      <Spinner />
      <span className="mt-2 dark:text-white">Loading...</span>
    </div>
  )
}

export default PageLoader
