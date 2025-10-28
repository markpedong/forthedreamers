import { TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import OauthButtons from './oauth-buttons';

const SignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  return (
    <PageWrapper>
      <div>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Create account</h1>
          <p className='text-muted-foreground'>Sign up to get started</p>
        </div>

        <div className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Full Name</Label>
            <Input id='name' type='text' placeholder='John Doe' className='h-11' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='reg-email'>Email</Label>
            <Input id='reg-email' type='email' placeholder='you@example.com' className='h-11' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='reg-password'>Password</Label>
            <Input id='reg-password' type='password' placeholder='••••••••' className='h-11' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Confirm Password</Label>
            <Input id='confirm-password' type='password' placeholder='••••••••' className='h-11' />
          </div>

          <Button className='w-full h-11'>Create Account</Button>
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
          <OauthButtons />
        </div>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className='text-primary hover:underline'>
            Sign in
          </button>
        </p>
      </div>
    </PageWrapper>
  );
};

export default SignUp;
