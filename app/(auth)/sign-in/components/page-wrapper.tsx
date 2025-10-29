import { FC, PropsWithChildren } from 'react';

const PageWrapper: FC<PropsWithChildren> = ({ children }) => (
  <div className='min-h-screen flex items-center justify-center p-4 bg-background text-foreground'>
    <div className='w-full max-w-xl rounded-2xl border bg-card text-card-foreground shadow-lg p-8'>
      {children}
    </div>
  </div>
);

export default PageWrapper;
