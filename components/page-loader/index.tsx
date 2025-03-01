'use client'
import { Spinner } from '@heroui/react'
import { FC } from 'react'

const PageLoader: FC = () => {
  return (
    <div className="absolute w-full h-full flex flex-col items-center justify-center">
      <Spinner label="Loading..." variant="default" color="default" labelColor="foreground" size="lg" />
    </div>
  )
}

export default PageLoader
