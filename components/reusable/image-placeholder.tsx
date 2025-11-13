import { AlertCircle } from 'lucide-react'
import { FC } from 'react'

const ImagePlaceholder: FC<{hasError?: boolean}> = ({hasError = false}) => (
  <div className='w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 gap-3'>
    {hasError ? (
      <>
        <AlertCircle className='text-muted-foreground' size={40} />
        <p className='text-sm text-muted-foreground text-center'>Image unavailable</p>
      </>
    ) : (
      <div className='flex items-center justify-center w-16 h-16 rounded-lg border border-muted-foreground/20 bg-background/50'>
        <svg className='w-8 h-8 text-muted-foreground/40' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      </div>
    )}
  </div>
)

export default ImagePlaceholder
