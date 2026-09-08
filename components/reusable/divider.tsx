import { FC } from 'react';

type Props = {
  title?: string;
};

const Divider: FC<Props> = ({ title }) => {
  return (
    <div className="relative my-7">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" />
      </div>
      <div className="relative flex justify-center">
        {title && (
          <div className="bg-card px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default Divider;
