import { FC } from 'react';

type Props = {
  title?: string;
};

const Divider: FC<Props> = ({ title }) => {
  return (
    <div className='relative my-6'>
      <div className='absolute inset-0 flex items-center'>
        <div className='w-full border-t' />
      </div>
      <div className='relative flex justify-center text-sm'>
        {title && <div className='px-4 bg-card text-muted-foreground'>{title}</div>}
      </div>
    </div>
  );
};

export default Divider;
