import { useTransition } from 'react'
import { GoogleIcon } from '@/components/icons/oauth'
import { Button } from '@/components/ui/button'
import { signInSocial } from '@/lib/server-actions'

type OauthButtonsProps = {next: '/profile' | '/dashboard'}

const OauthButtons = ({next}: OauthButtonsProps) => {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      type='button'
      variant='outline'
      className='h-11 w-full'
      disabled={pending}
      onClick={() => startTransition(() => signInSocial('google', next))}
    >
      {' '}
      <GoogleIcon /> <span className='ml-2'> {pending ? 'Opening Google...' : 'Continue with Google'} </span>{' '}
    </Button>
  )
}
export default OauthButtons
