import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

export const getDeviceIcon = (userAgent: string | null) => {
  const type = new UAParser(userAgent || '').getResult().device.type;
  if (type === 'tablet') return <Tablet className='w-4 h-4' />;
  if (type === 'mobile') return <Smartphone className='w-4 h-4' />;
  return <Monitor className='w-4 h-4' />;
};
