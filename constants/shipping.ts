export const COURIERS = [
  {
    code: 'JNT',
    name: 'J&T Express',
    description: 'Nationwide tracked delivery',
    fee: 3.99,
    estimatedDays: 3,
  },
  {
    code: 'NINJA_VAN',
    name: 'Ninja Van',
    description: 'Door-to-door standard delivery',
    fee: 4.49,
    estimatedDays: 3,
  },
  {
    code: 'FLASH_EXPRESS',
    name: 'Flash Express',
    description: 'Tracked express delivery',
    fee: 4.99,
    estimatedDays: 2,
  },
  {
    code: 'LBC',
    name: 'LBC Express',
    description: 'Priority nationwide delivery',
    fee: 6.99,
    estimatedDays: 1,
  },
] as const;

export type CourierCode = (typeof COURIERS)[number]['code'];

export const COURIER_CODES = COURIERS.map(courier => courier.code) as [CourierCode, ...CourierCode[]];

export const getCourier = (code: string) => COURIERS.find(courier => courier.code === code);
