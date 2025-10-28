import { TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AppleIcon, FacebookIcon, GoogleIcon, TikTokIcon } from '@/components/icons/oauth';
import { Button } from '@/components/ui/button';

const LoginPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => (
  <PageWrapper>
    <div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Welcome back</h1>
        <p className='text-muted-foreground'>Sign in to your account to continue</p>
      </div>

      <div className='space-y-5'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' placeholder='you@example.com' className='h-11' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' placeholder='••••••••' className='h-11' />
        </div>

        <div className='flex items-center justify-end'>
          <button
            onClick={() => onNavigate('forgot')}
            className='text-sm text-primary hover:underline'
          >
            Forgot password?
          </button>
        </div>

        <Button className='w-full h-11'>Sign in</Button>
      </div>

      <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-4 bg-card text-muted-foreground'>or continue with</span>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {[GoogleIcon, AppleIcon, FacebookIcon, TikTokIcon].map((Icon, i) => (
          <Button key={i} variant='outline' className='h-11'>
            <Icon />
            <span className='ml-2'>{['Google', 'Apple', 'Facebook', 'TikTok'][i]}</span>
          </Button>
        ))}
      </div>

      <p className='text-center text-sm text-muted-foreground mt-6'>
        Don't have an account?{' '}
        <button onClick={() => onNavigate('register')} className='text-primary hover:underline'>
          Create account
        </button>
      </p>
    </div>
  </PageWrapper>
);

export default LoginPage;
