export const PAYMENT_METHODS = [
  {
    code: 'CASH_ON_DELIVERY',
    name: 'Cash on Delivery',
    description: 'Pay the courier when your order arrives.',
    enabled: true,
  },
  {
    code: 'GCASH',
    name: 'GCash',
    description: 'Pay with your GCash wallet.',
    enabled: false,
  },
  {
    code: 'MAYA',
    name: 'Maya',
    description: 'Pay with your Maya wallet.',
    enabled: false,
  },
  {
    code: 'CARD',
    name: 'Credit/Debit Card',
    description: 'Pay using a credit or debit card.',
    enabled: false,
  },
  {
    code: 'ONLINE_BANKING',
    name: 'Online Banking',
    description: 'Pay through online bank transfer.',
    enabled: false,
  },
] as const;

export const ENABLED_PAYMENT_METHOD = 'CASH_ON_DELIVERY' as const;
