import { FC, PropsWithChildren } from 'react';

const PageWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground'>
      <div className='w-full max-w-md border bg-card p-6 text-card-foreground shadow-sm sm:p-8'>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
