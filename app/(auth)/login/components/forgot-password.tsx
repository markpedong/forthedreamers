
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';

const ForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => (
  <PageWrapper>
    <div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Reset password</h1>
        <p className='text-muted-foreground'>Enter your email to receive a reset link</p>
      </div>

      <div className='space-y-5'>
        <div className='space-y-2'>
          <Label htmlFor='forgot-email'>Email</Label>
          <Input id='forgot-email' type='email' placeholder='you@example.com' className='h-11' />
        </div>

        <Button className='w-full h-11'>Send reset link</Button>
      </div>

      <div className='mt-6 text-center'>
        <button
          onClick={() => onNavigate('login')}
          className='text-sm text-muted-foreground hover:text-foreground inline-flex items-center transition-colors'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
          Back to sign in
        </button>
      </div>
    </div>
  </PageWrapper>
);

export default ForgotPasswordPage;