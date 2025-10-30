'use client';

import { useIsClient } from '@uidotdev/usehooks';
import { FC, PropsWithChildren } from 'react';

const ClientOnly: FC<PropsWithChildren> = ({ children }) => {
  const isCLient = useIsClient();

  return isCLient ? <>{children}</> : null;
};

export default ClientOnly;
